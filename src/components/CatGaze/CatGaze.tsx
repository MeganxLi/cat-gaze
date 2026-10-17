import { useRef, useState, useEffect } from 'react'
import { useMousePosition } from '../../hooks/useMousePosition'
import './CatGaze.css'

/** Props for the CatGaze component. */
interface CatGazeProps {
  /** Display size in pixels. Defaults to 300. */
  size?: number
}

/**
 * All 8 frame images. Angle convention: atan2(dy, dx) in degrees,
 * 0° = right, clockwise positive.
 */
const BASE = import.meta.env.BASE_URL
const FRAMES: { src: string; label: string }[] = [
  { src: BASE + '01_up_left.png',    label: '左上' },  // 0
  { src: BASE + '02_up.png',         label: '正上' },  // 1
  { src: BASE + '03_up_right.png',   label: '右上' },  // 2
  { src: BASE + '04_right.png',      label: '右側' },  // 3
  { src: BASE + '05_left.png',       label: '左側' },  // 4
  { src: BASE + '06_forward.png',    label: '正前' },  // 5 (default)
  { src: BASE + '07_down_right.png', label: '右下' },  // 6
  { src: BASE + '08_down.png',       label: '正下' },  // 7
]

/** Maps atan2 angle (degrees, 0°=right, clockwise) to a FRAMES index. */
function angleToFrameIndex(angleDeg: number): number {
  const a = ((angleDeg % 360) + 360) % 360
  if (a < 22.5 || a >= 337.5) return 3
  if (a < 67.5)               return 6
  if (a < 112.5)              return 7
  if (a < 202.5)              return 4
  if (a < 247.5)              return 0
  if (a < 292.5)              return 1
  return 2
}

/**
 * CatGaze — original version: stacked image layers, the active frame
 * is swapped according to the mouse direction.
 */
export function CatGaze({ size = 300 }: CatGazeProps) {
  const { x: mouseX, y: mouseY } = useMousePosition()
  const containerRef = useRef<HTMLDivElement>(null)
  const [frameIndex, setFrameIndex] = useState<number>(5)

  useEffect(() => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const dx = mouseX - (rect.left + rect.width / 2)
    const dy = mouseY - (rect.top + rect.height / 2)
    setFrameIndex(angleToFrameIndex((Math.atan2(dy, dx) * 180) / Math.PI))
  }, [mouseX, mouseY])

  return (
    <div
      ref={containerRef}
      className="cat-gaze"
      style={{ width: size, height: size }}
      aria-label="跟隨滑鼠的貓咪"
      role="img"
    >
      {FRAMES.map((frame, i) => (
        <img
          key={frame.src}
          src={frame.src}
          alt={frame.label}
          className="cat-gaze-frame"
          style={{ opacity: i === frameIndex ? 1 : 0 }}
          draggable={false}
        />
      ))}
    </div>
  )
}

export default CatGaze
