import React, { useLayoutEffect, useRef } from 'react'
import { animate, createScope, scrambleText } from 'animejs'

const decodeCharacters = 'A-Z0-9/[]<>+_='
const initialCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/[]<>+_='

export default function DecodeText({ text, delay = 0 }) {
  const rootRef = useRef(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const words = [...root.querySelectorAll('[data-decode-value]')]
    const originalWords = words.map(word => word.textContent)
    const scope = createScope({
      root,
      mediaQueries: { reducedMotion: '(prefers-reduced-motion: reduce)' },
    }).add(self => {
      const restoreWords = () => words.forEach((word, index) => { word.textContent = originalWords[index] })
      if (self.matches.reducedMotion) {
        restoreWords()
        return undefined
      }

      words.forEach((word, wordIndex) => {
        word.textContent = [...originalWords[wordIndex]].map((character, characterIndex) => {
          if (/\s/.test(character)) return character
          return initialCharacters[(characterIndex * 7 + wordIndex * 13 + delay) % initialCharacters.length]
        }).join('')
      })

      animate(words, {
        textContent: scrambleText({
          text: (_, index) => originalWords[index],
          chars: decodeCharacters,
          from: 'left',
          override: true,
          perturbation: .06,
          revealRate: 44,
          settleDuration: 260,
          settleRate: 24,
          duration: 760,
          delay: (_, index) => delay + index * 48,
          ease: 'out(3)',
          seed: 2908,
        }),
      })

      return restoreWords
    })

    return () => {
      scope.revert()
      words.forEach((word, index) => { word.textContent = originalWords[index] })
    }
  }, [delay, text])

  const parts = text.split(/(\s+)/)

  return <span ref={rootRef} className="decode-text" aria-hidden="true">
    {parts.map((part, index) => part.trim()
      ? <span className="decode-word" key={`${part}-${index}`}>
          <span className="decode-word__measure">{part}</span>
          <span className="decode-word__value" data-decode-value>{part}</span>
        </span>
      : <React.Fragment key={`space-${index}`}>{part}</React.Fragment>)}
  </span>
}
