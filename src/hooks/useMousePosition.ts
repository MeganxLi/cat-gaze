import { useState, useEffect } from 'react'

/** Represents the absolute mouse position on the page. */
export interface MousePosition {
  x: number
  y: number
}

/**
 * Tracks the current mouse position across the entire window.
 *
 * @returns The current { x, y } position of the mouse cursor in page coordinates.
 *          Defaults to { x: 0, y: 0 } before the first mousemove event.
 */
export function useMousePosition(): MousePosition {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return position
}
