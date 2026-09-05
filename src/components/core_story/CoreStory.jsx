import React from 'react'
import useCoreStory from './useCoreStory'
import CoreStoryVisual from './CoreStoryVisual'
import CoreStoryContent from './CoreStoryContent'

export default function CoreStory() {
  const {
    storyRef,
    heroRef,
    heroSceneRef,
    solutionsRef,
    solutionsSceneRef,
    heroBeat,
    solutionBeat,
    reduceMotion,
  } = useCoreStory()

  return (
    <div
      ref={storyRef}
      className="core-story"
      data-cube-motion
      data-gravity="right"
      data-parallax-phase="hero"
    >
      <CoreStoryVisual />

      <CoreStoryContent
        heroRef={heroRef}
        heroSceneRef={heroSceneRef}
        solutionsRef={solutionsRef}
        solutionsSceneRef={solutionsSceneRef}
        heroBeat={heroBeat}
        solutionBeat={solutionBeat}
        reduceMotion={reduceMotion}
      />
    </div>
  )
}