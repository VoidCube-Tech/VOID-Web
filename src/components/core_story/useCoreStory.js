import { useEffect, useRef, useState } from 'react'
import { animate, createScope, onScroll } from 'animejs'
import { clamp, lerp, smoothstep } from './coreStory.utils'

export default function useCoreStory() {
    const [heroBeat, setHeroBeat] = useState(0)
    const [solutionBeat, setSolutionBeat] = useState(0)

    const [reduceMotion, setReduceMotion] = useState(
        () =>
            typeof window !== 'undefined' &&
            window.matchMedia(
                '(prefers-reduced-motion: reduce)'
            ).matches
    )

    const storyRef = useRef(null)
    const heroRef = useRef(null)
    const heroSceneRef = useRef(null)
    const solutionsRef = useRef(null)
    const solutionsSceneRef = useRef(null)

    useEffect(() => {
        const media = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        )

        const update = () => setReduceMotion(media.matches)

        update()

        media.addEventListener('change', update)

        return () =>
            media.removeEventListener('change', update)
    }, [])

    useEffect(() => {
        const story = storyRef.current
        const hero = heroRef.current
        const heroScene = heroSceneRef.current
        const solutionsTrack = solutionsRef.current
        const solutionsScene = solutionsSceneRef.current

        if (
            !story ||
            !hero ||
            !heroScene ||
            !solutionsTrack ||
            !solutionsScene
        ) {
            return undefined
        }

        const storyState = {
            progress: 0,
        }

        const pointer = {
            x: 0,
            y: 0,
        }

        const metrics = {
            storyTravel: 1,
            heroTravel: 1,
            solutionsStart: 1,
            solutionsTravel: 1,
        }

        let currentHeroBeat = -2
        let currentSolutionBeat = -2
        let pointerAnimation
        let pointerFrame = 0
        let pointerEnabled = false
        let layoutObserver
        let disposed = false

        const measure = () => {
            const storyBounds =
                story.getBoundingClientRect()

            const trackBounds =
                solutionsTrack.getBoundingClientRect()

            metrics.storyTravel = Math.max(
                1,
                story.offsetHeight - window.innerHeight
            )

            metrics.heroTravel = Math.max(
                1,
                hero.offsetHeight -
                heroScene.offsetHeight
            )

            metrics.solutionsStart =
                trackBounds.top -
                storyBounds.top

            metrics.solutionsTravel = Math.max(
                1,
                solutionsTrack.offsetHeight -
                solutionsScene.offsetHeight
            )
        }

        const paintHeroPanel = (
            panel,
            opacity,
            x
        ) => {
            panel.style.setProperty(
                '--beat-opacity',
                opacity.toFixed(4)
            )

            panel.style.setProperty(
                '--beat-x',
                `${x.toFixed(2)}px`
            )

            panel.style.setProperty(
                '--beat-scale',
                (
                    0.985 +
                    opacity * 0.015
                ).toFixed(4)
            )
        }

        const paintSolutionPanel = (
            panel,
            opacity,
            y
        ) => {
            panel.style.setProperty(
                '--solution-opacity',
                opacity.toFixed(4)
            )

            panel.style.setProperty(
                '--solution-y',
                `${y.toFixed(2)}px`
            )

            panel.style.setProperty(
                '--solution-scale',
                (
                    0.985 +
                    opacity * 0.015
                ).toFixed(4)
            )
        }

        const paint = () => {
            const scrollDistance =
                storyState.progress *
                metrics.storyTravel

            const heroProgress = clamp(
                scrollDistance /
                metrics.heroTravel
            )

            const solutionsProgress = clamp(
                (
                    scrollDistance -
                    metrics.solutionsStart
                ) /
                metrics.solutionsTravel
            )

            const introTravel = Math.max(
                1,
                metrics.solutionsStart -
                metrics.heroTravel
            )

            const introProgress = clamp(
                (
                    scrollDistance -
                    metrics.heroTravel
                ) /
                introTravel
            )

            const heroActive =
                scrollDistance <=
                metrics.heroTravel + 1

            const solutionsActive =
                scrollDistance >=
                metrics.solutionsStart - 1

            const heroMoments = [
                {
                    id: 0,
                    enter: null,
                    exit: [0.3, 0.42],
                },
            ]

            let visibleHeroBeat = -1
            let visibleHeroOpacity = -1

            heroMoments.forEach(
                ({ id, enter, exit }) => {
                    const panel =
                        heroScene.querySelector(
                            `[data-hero-beat="${id}"]`
                        )

                    if (!panel) return

                    const entrance = enter
                        ? smoothstep(
                            enter[0],
                            enter[1],
                            heroProgress
                        )
                        : 1

                    const departure = exit
                        ? smoothstep(
                            exit[0],
                            exit[1],
                            heroProgress
                        )
                        : 0

                    const opacity =
                        heroActive
                            ? entrance *
                            (1 - departure)
                            : 0

                    paintHeroPanel(
                        panel,
                        opacity,
                        0
                    )

                    if (
                        opacity >
                        visibleHeroOpacity
                    ) {
                        visibleHeroOpacity =
                            opacity

                        visibleHeroBeat = id
                    }
                }
            )

            if (
                visibleHeroOpacity < 0.01
            ) {
                visibleHeroBeat = -1
            }

            const solutionMoments = [
                {
                    enter: [0.03, 0.14],
                    exit: [0.22, 0.28],
                },
                {
                    enter: [0.34, 0.42],
                    exit: [0.48, 0.54],
                },
                {
                    enter: [0.6, 0.68],
                    exit: [0.86, 0.92],
                },
            ]

            let visibleSolutionBeat = -1

            solutionMoments.forEach(
                ({ enter, exit }, index) => {
                    const panel =
                        solutionsScene.querySelector(
                            `[data-solution-beat="${index}"]`
                        )

                    if (!panel) return

                    const entrance =
                        smoothstep(
                            enter[0],
                            enter[1],
                            solutionsProgress
                        )

                    const departure =
                        smoothstep(
                            exit[0],
                            exit[1],
                            solutionsProgress
                        )

                    const opacity =
                        solutionsActive
                            ? entrance *
                            (1 - departure)
                            : 0

                    const y =
                        (1 - entrance) * 58 -
                        departure * 40

                    paintSolutionPanel(
                        panel,
                        opacity,
                        y
                    )

                    if (opacity > 0.52) {
                        visibleSolutionBeat =
                            index
                    }
                }
            )

            if (
                visibleHeroBeat !==
                currentHeroBeat
            ) {
                currentHeroBeat =
                    visibleHeroBeat

                setHeroBeat(
                    visibleHeroBeat
                )
            }

            if (
                visibleSolutionBeat !==
                currentSolutionBeat
            ) {
                currentSolutionBeat =
                    visibleSolutionBeat

                setSolutionBeat(
                    visibleSolutionBeat
                )
            }

            const passageSettle =
                smoothstep(
                    0.06,
                    0.5,
                    introProgress
                )

            const parallaxArrival =
                smoothstep(
                    0.02,
                    0.16,
                    solutionsProgress
                )

            const parallaxTravel =
                smoothstep(
                    0.16,
                    1,
                    solutionsProgress
                )

            const compactLayout =
                window.innerWidth <= 760

            const sideOffset = Math.min(
                20,
                (320 /
                    Math.max(
                        1,
                        window.innerWidth
                    )) *
                100
            )

            const passageX =
                compactLayout
                    ? 0
                    : Math.min(
                        27,
                        (410 /
                            Math.max(
                                1,
                                window.innerWidth
                            )) *
                        100
                    )

            const passageY =
                compactLayout ? 15 : 6

            const passageScale =
                compactLayout ? 0.6 : 0.66

            const passageOpacity =
                compactLayout ? 0.82 : 0.86

            const solutionY =
                compactLayout ? 15 : 0

            const solutionScale =
                compactLayout ? 0.62 : 0.9

            const settledScale =
                compactLayout ? 0.62 : 0.82

            const heroFocus =
                smoothstep(
                    0.26,
                    0.46,
                    heroProgress
                )

            const heroFocusScale =
                compactLayout ? 1.06 : 1.18

            let visualX = 0
            let visualY = compactLayout ? 15 : 0 // Empurra 25vh para baixo no mobile
            let visualScale = 0.94
            let visualOpacity = 1

            if (heroActive) {
                visualX = lerp(
                    sideOffset,
                    0,
                    heroFocus
                )

                visualScale = lerp(
                    0.94,
                    heroFocusScale,
                    heroFocus
                )
            } else if (!solutionsActive) {
                visualX = lerp(
                    0,
                    passageX,
                    passageSettle
                )

                visualY = lerp(
                    compactLayout ? 15 : 0, // Começa da nova posição mais baixa
                    passageY,
                    passageSettle
                )

                visualScale = lerp(
                    heroFocusScale,
                    passageScale,
                    passageSettle
                )

                visualOpacity = lerp(
                    1,
                    passageOpacity,
                    passageSettle
                )
            } else {
                const travelLeft =
                    smoothstep(
                        0.28,
                        0.34,
                        solutionsProgress
                    )

                const travelRight =
                    smoothstep(
                        0.54,
                        0.6,
                        solutionsProgress
                    )

                const settleCenter =
                    smoothstep(
                        0.92,
                        1,
                        solutionsProgress
                    )

                const arrivalX =
                    passageX

                visualX = lerp(
                    lerp(
                        lerp(
                            arrivalX,
                            -sideOffset,
                            travelLeft
                        ),
                        sideOffset,
                        travelRight
                    ),
                    0,
                    settleCenter
                )

                visualY =
                    lerp(
                        passageY,
                        solutionY,
                        parallaxArrival
                    ) +
                    lerp(
                        0,
                        2,
                        parallaxTravel
                    )

                const arrivalScale =
                    lerp(
                        passageScale,
                        solutionScale,
                        parallaxArrival
                    )

                visualScale = lerp(
                    arrivalScale,
                    settledScale,
                    smoothstep(
                        0.68,
                        1,
                        solutionsProgress
                    )
                )

                visualOpacity = lerp(
                    passageOpacity,
                    1,
                    parallaxArrival
                )
            }

            if (compactLayout) {
                visualX = 0
            }

            const pointerAvailable =
                solutionsActive &&
                solutionsProgress >= 0.16

            if (
                pointerEnabled !==
                pointerAvailable
            ) {
                pointerEnabled =
                    pointerAvailable

                if (!pointerEnabled) {
                    pointerAnimation?.pause()
                    pointer.x = 0
                    pointer.y = 0
                }
            }

            const pointerWeight =
                solutionsActive
                    ? smoothstep(
                        0.16,
                        0.24,
                        solutionsProgress
                    )
                    : 0

            const pointerX =
                (pointerEnabled
                    ? pointer.x
                    : 0) *
                pointerWeight

            const pointerY =
                (pointerEnabled
                    ? pointer.y
                    : 0) *
                pointerWeight

            story.style.setProperty(
                '--story-visual-x',
                `${(
                    visualX +
                    pointerX * 0.35
                ).toFixed(3)}vw`
            )

            story.style.setProperty(
                '--story-visual-y',
                `${(
                    visualY +
                    pointerY * 0.7
                ).toFixed(3)}vh`
            )

            story.style.setProperty(
                '--story-visual-scale',
                visualScale.toFixed(4)
            )

            story.style.setProperty(
                '--story-visual-opacity',
                visualOpacity.toFixed(4)
            )

            story.style.setProperty(
                '--hero-progress',
                heroProgress.toFixed(4)
            )

            story.style.setProperty(
                '--solutions-progress',
                solutionsProgress.toFixed(4)
            )

            const explodeOut =
                smoothstep(
                    0.38,
                    0.64,
                    heroProgress
                )

            const assembleBack =
                smoothstep(
                    0.72,
                    0.92,
                    heroProgress
                )

            const cubeFocus =
                heroActive
                    ? heroFocus
                    : !solutionsActive
                        ? 1 - passageSettle
                        : 0

            const focusedCubeScale =
                compactLayout ? 1.05 : 1.1

            story.dataset.cubeExplode =
                (
                    explodeOut *
                    (1 - assembleBack)
                ).toFixed(4)

            story.dataset.cubeDepth = '0'
            story.dataset.cubeDescent = '0'

            story.dataset.cubeScale =
                lerp(
                    1,
                    focusedCubeScale,
                    cubeFocus
                ).toFixed(4)

            story.dataset.cubeField = '1'

            story.dataset.parallaxPhase =
                heroActive
                    ? 'hero'
                    : solutionsActive &&
                        solutionsProgress >= 0.16
                        ? 'solutions'
                        : 'passage'

            const activeBeat =
                solutionsActive
                    ? visibleSolutionBeat
                    : visibleHeroBeat

            const gravity =
                activeBeat === 1
                    ? 'left'
                    : 'right'

            story.dataset.gravity =
                gravity

            heroScene.dataset.gravity =
                gravity

            solutionsScene.dataset.gravity =
                gravity
        }

        measure()
        paint()

        layoutObserver =
            new ResizeObserver(() => {
                measure()
                paint()
            })

            ;[
                hero,
                heroScene,
                solutionsTrack,
                solutionsScene,
            ].forEach(element =>
                layoutObserver.observe(element)
            )

        document.fonts?.ready.then(() => {
            if (disposed) return

            measure()
            paint()
        })

        const scope = createScope({
            root: story,
            mediaQueries: {
                reduceMotion:
                    '(prefers-reduced-motion: reduce)',
                compact:
                    '(max-width: 760px)',
            },
        }).add(self => {
            if (self.matches.reduceMotion) {
                storyState.progress = 0

                story.dataset.cubeExplode = '0'
                story.dataset.cubeDepth = '0'
                story.dataset.cubeDescent = '0'
                story.dataset.cubeScale = '1'

                paint()

                return undefined
            }

            animate(storyState, {
                progress: 1,
                ease: 'linear',
                autoplay: onScroll({
                    target: story,
                    enter: 'start start',
                    leave: 'end end',
                    sync: 1,
                    onResize: () => {
                        measure()
                        paint()
                    },
                }),
                onUpdate: paint,
            })

            const queuePointer = (
                x,
                y
            ) => {
                cancelAnimationFrame(
                    pointerFrame
                )

                pointerFrame =
                    requestAnimationFrame(() => {
                        pointerAnimation?.pause()

                        pointerAnimation =
                            animate(pointer, {
                                x,
                                y,
                                duration:
                                    self.matches.compact
                                        ? 180
                                        : 260,
                                ease: 'out(4)',
                                onUpdate: paint,
                            })
                    })
            }

            const move = event => {
                if (
                    !pointerEnabled ||
                    story.dataset.cubeDragging ===
                    'true'
                ) {
                    return
                }

                queuePointer(
                    clamp(
                        event.clientX /
                        window.innerWidth
                    ) *
                    2 -
                    1,
                    clamp(
                        event.clientY /
                        window.innerHeight
                    ) *
                    2 -
                    1
                )
            }

            const reset = () =>
                queuePointer(0, 0)

            const resize = () => {
                measure()
                paint()
            }

            story.addEventListener(
                'pointermove',
                move,
                { passive: true }
            )

            story.addEventListener(
                'pointerleave',
                reset
            )

            window.addEventListener(
                'resize',
                resize
            )

            return () => {
                cancelAnimationFrame(
                    pointerFrame
                )

                story.removeEventListener(
                    'pointermove',
                    move
                )

                story.removeEventListener(
                    'pointerleave',
                    reset
                )

                window.removeEventListener(
                    'resize',
                    resize
                )
            }
        })

        return () => {
            disposed = true
            layoutObserver?.disconnect()
            scope.revert()
        }
    }, [])

    return {
        storyRef,
        heroRef,
        heroSceneRef,
        solutionsRef,
        solutionsSceneRef,
        heroBeat,
        solutionBeat,
        reduceMotion,
    }
}