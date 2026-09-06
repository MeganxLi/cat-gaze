import { useState, useEffect } from 'react'

/** Represents the absolute cursor/touch position in the viewport. */
export interface MousePosition {
  x: number
  y: number
}

/**
 * Tracks the current pointer position across the entire window.
 * Supports both mouse (mousemove) and touch (touchmove) events,
 * so the cat responds correctly on mobile devices too.
 *
 * @returns The current { x, y } position in viewport coordinates (clientX/Y).
 *          Defaults to { x: 0, y: 0 } before the first interaction.
 */
export function useMousePosition(): MousePosition {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 })

  useEffect(() => {
    // Mouse: fires continuously while moving
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    // Touch: fires while finger is dragging across the screen
    // touches[0] is the first contact point
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (!touch) return
      setPosition({ x: touch.clientX, y: touch.clientY })
    }

    // touchstart handles a single tap (finger down, no drag)
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (!touch) return
      setPosition({ x: touch.clientX, y: touch.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchstart', handleTouchStart)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchstart', handleTouchStart)
    }
  }, [])

  return position
}
