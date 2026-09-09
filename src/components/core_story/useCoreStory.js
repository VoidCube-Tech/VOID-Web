import { useEffect, useRef, useState } from 'react'
import { animate, createScope } from 'animejs'
import { clamp, lerp, smoothstep, smootherstep } from './coreStory.utils'

export default function useCoreStory() {
  const [heroBeat, setHeroBeat] = useState(0)
  const [solutionBeat, setSolutionBeat] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const storyRef = useRef(null)
  const heroRef = useRef(null)
  const heroSceneRef = useRef(null)
  const solutionsRef = useRef(null)
  const solutionsSceneRef = useRef(null)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const story = storyRef.current
    const hero = heroRef.current
    const heroScene = heroSceneRef.current
    const solutionsTrack = solutionsRef.current
    const solutionsScene = solutionsSceneRef.current
    if (!story || !hero || !heroScene || !solutionsTrack || !solutionsScene) return undefined
    const heroPanels = [...heroScene.querySelectorAll('[data-hero-beat]')]
    const solutionPanels = [...solutionsScene.querySelectorAll('[data-solution-beat]')]
    const model = story.querySelector('.core-story__model')
    const visualStage = story.querySelector('.core-story__visual-stage')
    const page = story.parentElement
    const solutionsSection = solutionsTrack.parentElement
    const solutionsIntro = solutionsSection.querySelector('.section-intro')
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const pointer = { x: 0, y: 0 }
    const metrics = { heroTravel: 1, solutionsStart: 1, solutionsTravel: 1 }
    let currentHeroBeat = -2
    let currentSolutionBeat = -2
    let pointerAnimation
    let pointerFrame = 0
    let pointerEnabled = false
    let layoutObserver
    let disposed = false

    const measure = () => {
      metrics.viewportWidth = model.offsetWidth
      metrics.viewportHeight = model.offsetHeight
      metrics.headerClear = (document.querySelector('.site-header')?.offsetHeight || 76) + 24
      const title = heroPanels[0].querySelector('h1')
      metrics.heroTitleCenter = heroPanels[0].offsetTop + title.offsetTop + title.offsetHeight / 2
      metrics.heroTitleHeight = title.offsetHeight
      metrics.heroClearLeft = heroPanels[0].offsetLeft + (window.innerWidth <= 760 ? title.offsetWidth : heroPanels[0].offsetWidth)
      // Measure every panel before animating: even the longest copy gets a clear reading area.
      metrics.solutionPanelBottoms = solutionPanels.map(panel => panel.offsetTop + panel.offsetHeight)
      metrics.solutionClear = Math.max(...metrics.solutionPanelBottoms) + 32
      const height = metrics.viewportHeight
      const entryOverlap = reducedMotionQuery.matches ? 0 : Math.max(0, height - Math.min(height * .35, 280))
      const handoffOverlap = reducedMotionQuery.matches ? 0 : Math.max(0, height - metrics.solutionPanelBottoms.at(-1) - 24)
      // Static, measured overlaps remove empty sticky tails without animating layout.
      page.style.setProperty('--story-entry-overlap', `${entryOverlap.toFixed(2)}px`)
      page.style.setProperty('--story-handoff-overlap', `${handoffOverlap.toFixed(2)}px`)
      const storyBounds = story.getBoundingClientRect()
      metrics.storyTop = storyBounds.top + window.scrollY
      metrics.introStart = solutionsSection.getBoundingClientRect().top - storyBounds.top
      // Read layout coordinates: the global text reveal temporarily translates the heading.
      let introCopyTop = 0
      for (let node = solutionsIntro.querySelector('h2'); node && node !== story; node = node.offsetParent) {
        introCopyTop += node.offsetTop
      }
      // Finish the hero's dissipation with the next heading already in view.
      metrics.heroTravel = Math.max(1, introCopyTop - height * .58)
      metrics.solutionsStart = solutionsTrack.getBoundingClientRect().top - storyBounds.top
      metrics.solutionsTravel = Math.max(1, solutionsTrack.offsetHeight - solutionsScene.offsetHeight)
      metrics.exitTravel = Math.max(180, handoffOverlap)
      metrics.readingTravel = Math.max(1, metrics.solutionsTravel - metrics.exitTravel)
      const horizonSize = Math.min(metrics.viewportWidth * .94, Math.max(0, height - metrics.solutionClear) * 1.8, height * .96)
      metrics.departureLead = Math.min(height * .18, metrics.readingTravel * .12)
      metrics.departureTravel = metrics.departureLead + Math.min(metrics.exitTravel, Math.max(180, horizonSize * .5))
      metrics.projectsStart = metrics.solutionsStart + solutionsTrack.offsetHeight - handoffOverlap
    }

    const paintHeroPanel = (panel, opacity, x) => {
      panel.style.setProperty('--beat-opacity', opacity.toFixed(4))
      panel.style.setProperty('--beat-x', `${x.toFixed(2)}px`)
      panel.style.setProperty('--beat-scale', (.985 + opacity * .015).toFixed(4))
    }

    const paintSolutionPanel = (panel, opacity, y) => {
      panel.style.setProperty('--solution-opacity', opacity.toFixed(4))
      panel.style.setProperty('--solution-y', `${y.toFixed(2)}px`)
      panel.style.setProperty('--solution-scale', (.985 + opacity * .015).toFixed(4))
    }

    const paint = () => {
      const compactLayout = window.innerWidth <= 760
      // Text and canvas share native scroll, including fast reversals and sticky release.
      const scrollDistance = reducedMotionQuery.matches ? 0 : Math.max(0, window.scrollY - metrics.storyTop)
      const heroProgress = clamp(scrollDistance / metrics.heroTravel)
      const solutionsProgress = clamp((scrollDistance - metrics.solutionsStart) / metrics.readingTravel)
      const exitProgress = clamp((scrollDistance - metrics.solutionsStart - metrics.readingTravel) / metrics.exitTravel)
      // Start while the final capability is still being read, so narrow screens
      // show the downward turn before the incoming section reaches the cube.
      const departure = clamp((scrollDistance - metrics.solutionsStart - metrics.readingTravel + metrics.departureLead) / metrics.departureTravel)
      const exitEase = departure * departure
      const introTravel = Math.max(1, metrics.solutionsStart - metrics.heroTravel)
      const introProgress = clamp((scrollDistance - metrics.heroTravel) / introTravel)
      const heroActive = scrollDistance <= metrics.heroTravel + 1
      const solutionsActive = scrollDistance >= metrics.solutionsStart - 1
      const heroMoments = [
        { id: 0, enter: null, exit: [.24, .4] },
      ]
      let visibleHeroBeat = -1
      let visibleHeroOpacity = -1
      heroMoments.forEach(({ id, enter, exit }) => {
        const panel = heroPanels[id]
        if (!panel) return
        const entrance = enter ? smoothstep(enter[0], enter[1], heroProgress) : 1
        const departure = exit ? smoothstep(exit[0], exit[1], heroProgress) : 0
        const opacity = heroActive ? entrance * (1 - departure) : 0
        paintHeroPanel(panel, opacity, 0)
        if (opacity > visibleHeroOpacity) {
          visibleHeroOpacity = opacity
          visibleHeroBeat = id
        }
      })
      if (visibleHeroOpacity < .01) visibleHeroBeat = -1

      const solutionMoments = compactLayout ? [
        { enter: null, exit: [.29, .33] },
        { enter: [.36, .4], exit: [.63, .67] },
        { enter: [.7, .74], exit: null },
      ] : [
        { enter: null, exit: [.22, .28] },
        { enter: [.34, .42], exit: [.48, .54] },
        { enter: [.6, .68], exit: null },
      ]
      let visibleSolutionBeat = -1
      let sceneClearTop = metrics.solutionClear
      solutionMoments.forEach(({ enter, exit }, index) => {
        const panel = solutionPanels[index]
        if (!panel) return
        const entrance = enter ? smoothstep(enter[0], enter[1], solutionsProgress) : 1
        const departure = exit ? smoothstep(exit[0], exit[1], solutionsProgress) : 0
        // The first card enters with the section, not after an empty viewport has passed.
        const opacity = solutionsActive || index === 0 ? entrance * (1 - departure) : 0
        const y = (1 - entrance) * (compactLayout ? 24 : 58) - departure * (compactLayout ? 20 : 40)
        paintSolutionPanel(panel, opacity, y)
        if (opacity > .001) {
          sceneClearTop = Math.max(sceneClearTop, metrics.solutionPanelBottoms[index] + Math.max(0, y) + 32)
        }
        if (opacity > .52) visibleSolutionBeat = index
      })

      if (visibleHeroBeat !== currentHeroBeat) {
        currentHeroBeat = visibleHeroBeat
        setHeroBeat(visibleHeroBeat)
      }
      if (visibleSolutionBeat !== currentSolutionBeat) {
        currentSolutionBeat = visibleSolutionBeat
        setSolutionBeat(visibleSolutionBeat)
      }

      const passageSettle = smoothstep(0, .92, introProgress)
      const solutionSettle = smoothstep(.12, .88, solutionsProgress)
      const heroFocus = smootherstep(.28, .54, heroProgress)
      const heroVisibility = 1 - smootherstep(.92, 1, heroProgress)
      const solutionVisibility = smoothstep(0, .055, solutionsProgress) * (1 - smoothstep(.76, .99, departure))
      // A cubic release spends more of the arrival slowing down than accelerating.
      const arrival = 1 - Math.pow(1 - clamp(solutionsProgress / .18), 3)
      // Reposition the shared scene while hidden. It returns only after the
      // capabilities track is pinned and its full reading area is protected.
      const sceneOpacity = heroActive ? heroVisibility : solutionsActive ? solutionVisibility : 0
      const { viewportWidth: width, viewportHeight: height } = metrics
      const heroSize = compactLayout
        ? Math.min(width * .4, metrics.heroTitleHeight + 40)
        : Math.min(width * .34, height * .57)
      // Frame the whole opening cube between the navigation and the incoming section.
      const focusBottom = Math.min(height - 32, metrics.introStart - scrollDistance - 32)
      const focusHeight = Math.max(96, focusBottom - metrics.headerClear)
      const focusSize = Math.min(width * .52, focusHeight * .72)
      const horizonSize = Math.min(width * .94, Math.max(0, height - metrics.solutionClear) * 1.8, height * .96)
      const horizon = heroActive ? 0 : solutionsActive ? 1 : passageSettle
      const heroY = compactLayout ? metrics.heroTitleCenter / height : .48
      const focusY = (metrics.headerClear + focusHeight / 2) / height
      let visualX = lerp(compactLayout ? .8 : .78, .5, heroFocus)
      let visualY = lerp(heroY, focusY, heroFocus)
      let cubeSize = lerp(heroSize, focusSize, heroFocus)
      if (heroActive) {
        visualY -= Math.sin(heroFocus * Math.PI) * .018
      } else {
        visualX = .5
        visualY = lerp(focusY, 1.01 + solutionSettle * .025, horizon)
        if (solutionsActive) visualY += (1 - arrival) * .16 + exitEase * .2
        cubeSize = lerp(focusSize, horizonSize, horizon)
        if (solutionsActive) cubeSize *= (.9 + arrival * .1) * (1 - exitEase * .08)
      }

      const pointerAvailable = !compactLayout && solutionsActive && solutionsProgress >= .16 && departure === 0
      if (pointerEnabled !== pointerAvailable) {
        pointerEnabled = pointerAvailable
        if (!pointerEnabled) {
          pointerAnimation?.pause()
          pointer.x = 0
          pointer.y = 0
        }
      }
      const pointerWeight = solutionsActive ? smoothstep(.16, .24, solutionsProgress) : 0
      const pointerX = (pointerEnabled ? pointer.x : 0) * pointerWeight
      const pointerY = (pointerEnabled ? pointer.y : 0) * pointerWeight
      visualX += pointerX * .004
      visualY += pointerY * .003
      story.dataset.sceneX = visualX.toFixed(5)
      story.dataset.sceneY = visualY.toFixed(5)
      story.dataset.sceneSize = cubeSize.toFixed(2)
      story.dataset.sceneFieldWidth = lerp(cubeSize * 2.6, width * 1.8, horizon).toFixed(2)
      story.dataset.sceneHorizon = horizon.toFixed(4)
      story.dataset.sceneOpacity = sceneOpacity.toFixed(4)
      visualStage.setAttribute('aria-hidden', sceneOpacity < .01 ? 'true' : 'false')
      story.style.setProperty('--story-scene-opacity', sceneOpacity.toFixed(4))
      story.style.setProperty('--story-scene-x', `${(visualX * 100).toFixed(3)}%`)
      story.style.setProperty('--story-scene-y', `${(visualY * 100).toFixed(3)}%`)
      story.style.setProperty('--story-cube-size', `${cubeSize.toFixed(2)}px`)
      story.style.setProperty('--story-clear-top', `${(heroActive ? 0 : sceneClearTop).toFixed(2)}px`)
      const nextSectionTop = heroActive ? metrics.introStart : metrics.projectsStart
      story.style.setProperty('--story-visible-bottom', `${Math.min(height + 48, nextSectionTop - scrollDistance).toFixed(2)}px`)
      const heroReading = heroActive ? 1 - smoothstep(.24, .4, heroProgress) : 0
      story.style.setProperty('--story-clear-left', `${(metrics.heroClearLeft * heroReading).toFixed(2)}px`)
      story.style.setProperty('--story-clear-feather', `${((compactLayout ? 18 : 32) * heroReading).toFixed(2)}px`)
      story.style.setProperty('--hero-progress', heroProgress.toFixed(4))
      story.style.setProperty('--solutions-progress', solutionsProgress.toFixed(4))
      story.style.setProperty('--solutions-exit', exitProgress.toFixed(4))

      // Dissolve the separated pieces, then return with an already assembled cube.
      // These values are scroll-derived, so reversing the gesture rebuilds every piece.
      // Each piece supplies its own easing; a linear driver avoids accelerating twice.
      story.dataset.cubeExplode = (heroActive ? clamp((heroProgress - .46) / .38) : smoothstep(.05, .75, departure) * .18).toFixed(4)
      story.dataset.cubeDissolve = (heroActive ? smootherstep(.74, 1, heroProgress) : smoothstep(.12, .88, departure)).toFixed(4)
      story.dataset.vortexDissolve = (heroActive ? smootherstep(.7, 1, heroProgress) : smoothstep(.08, .98, departure)).toFixed(4)
      story.dataset.cubeTurn = (solutionsActive ? -(1 - arrival) * Math.PI * 1.35 + exitEase * .95 : heroActive ? smootherstep(.34, .92, heroProgress) * .58 : 0).toFixed(5)
      story.dataset.cubePitch = (exitEase * 1.15).toFixed(5)
      story.dataset.cubeDepth = '0'
      story.dataset.cubeDescent = '0'
      story.dataset.cubeScale = '1'
      story.dataset.cubeField = '1'
      story.dataset.parallaxPhase = heroActive ? 'hero' : solutionsActive && solutionsProgress >= .16 && departure === 0 ? 'solutions' : 'passage'
      story.dataset.motionPhase = heroActive
        ? heroProgress < .28 ? 'hero' : heroProgress < .46 ? 'focus' : heroProgress < .74 ? 'decompose' : 'dissolve'
        : solutionsActive ? departure >= .99 ? 'complete' : departure > 0 ? 'depart' : solutionsProgress < .18 ? 'arrive' : 'settled' : 'handoff'

      const activeBeat = solutionsActive ? visibleSolutionBeat : visibleHeroBeat
      const gravity = activeBeat === 1 ? 'left' : 'right'
      story.dataset.gravity = gravity
      heroScene.dataset.gravity = gravity
      solutionsScene.dataset.gravity = gravity
    }

    measure()
    paint()
    layoutObserver = new ResizeObserver(() => {
      measure()
      paint()
    })
    ;[hero, heroScene, solutionsIntro, solutionsTrack, solutionsScene, model, ...solutionPanels].forEach(element => layoutObserver.observe(element))
    document.fonts?.ready.then(() => {
      if (disposed) return
      measure()
      paint()
    })

    const scope = createScope({
      root: story,
      mediaQueries: {
        reduceMotion: '(prefers-reduced-motion: reduce)',
        compact: '(max-width: 760px)',
      },
    }).add(self => {
      if (self.matches.reduceMotion) {
        story.dataset.cubeExplode = '0'
        story.dataset.cubeDepth = '0'
        story.dataset.cubeDescent = '0'
        story.dataset.cubeScale = '1'
        paint()
        return undefined
      }

      let scrollFrame = 0
      const update = () => {
        if (scrollFrame) return
        scrollFrame = requestAnimationFrame(() => { scrollFrame = 0; paint() })
      }
      window.addEventListener('scroll', update, { passive: true })
      update()

      const queuePointer = (x, y) => {
        cancelAnimationFrame(pointerFrame)
        pointerFrame = requestAnimationFrame(() => {
          pointerAnimation?.pause()
          pointerAnimation = animate(pointer, {
            x,
            y,
            duration: self.matches.compact ? 240 : 420,
            ease: 'out(4)',
            onUpdate: paint,
          })
        })
      }
      const move = event => {
        if (!pointerEnabled || story.dataset.cubeDragging === 'true') return
        queuePointer(
          clamp(event.clientX / window.innerWidth) * 2 - 1,
          clamp(event.clientY / window.innerHeight) * 2 - 1,
        )
      }
      const reset = () => queuePointer(0, 0)
      const resize = () => {
        measure()
        paint()
      }
      const pointerTrackingEnabled = !self.matches.compact

      if (pointerTrackingEnabled) {
        story.addEventListener('pointermove', move, { passive: true })
        story.addEventListener('pointerleave', reset)
      }
      window.addEventListener('resize', resize)
      return () => {
        cancelAnimationFrame(pointerFrame)
        cancelAnimationFrame(scrollFrame)
        pointerAnimation?.pause()
        if (pointerTrackingEnabled) {
          story.removeEventListener('pointermove', move)
          story.removeEventListener('pointerleave', reset)
        }
        window.removeEventListener('resize', resize)
        window.removeEventListener('scroll', update)
      }
    })

    return () => {
      disposed = true
      layoutObserver?.disconnect()
      scope.revert()
      page.style.removeProperty('--story-entry-overlap')
      page.style.removeProperty('--story-handoff-overlap')
    }
  }, [reduceMotion])

  return {
    storyRef, heroRef, heroSceneRef, solutionsRef, solutionsSceneRef,
    heroBeat, solutionBeat, reduceMotion,
  }
}
