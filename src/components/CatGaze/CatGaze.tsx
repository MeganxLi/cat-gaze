import { useRef, useState, useEffect } from 'react'
import './CatGaze.css'

/** Props for the CatGaze component. */
interface CatGazeProps {
  mouseX: number
  mouseY: number
  /** Display size in pixels. Defaults to 300. */
  size?: number
}

/**
 * All 8 frame images with their corresponding angle ranges.
 *
 * Angle convention: atan2(dy, dx) in degrees, 0° = right, clockwise positive.
 *
 *   01_up_left   → upper-left   (mouse at ~225°)
 *   02_up        → above        (mouse at ~270°)
 *   03_up_right  → upper-right  (mouse at ~315°)
 *   04_right     → right side   (mouse at   0°)
 *   05_left      → left side    (mouse at ~180°)
 *   06_forward   → looking at viewer (default)
 *   07_down_right→ lower-right  (mouse at  ~45°)
 *   08_down      → below        (mouse at  ~90°)
 */
const FRAMES: { src: string; label: string }[] = [
  { src: '/01_up_left.png',    label: '左上' },  // index 0
  { src: '/02_up.png',         label: '正上' },  // index 1
  { src: '/03_up_right.png',   label: '右上' },  // index 2
  { src: '/04_right.png',      label: '右側' },  // index 3
  { src: '/05_left.png',       label: '左側' },  // index 4
  { src: '/06_forward.png',    label: '正前' },  // index 5 (default)
  { src: '/07_down_right.png', label: '右下' },  // index 6
  { src: '/08_down.png',       label: '正下' },  // index 7
]

/** Maps atan2 angle (degrees, 0°=right, clockwise) to a FRAMES index. */
function angleToFrameIndex(angleDeg: number): number {
  const a = ((angleDeg % 360) + 360) % 360
  if (a < 22.5 || a >= 337.5) return 3  // 右側
  if (a < 67.5)               return 6  // 右下
  if (a < 112.5)              return 7  // 正下
  if (a < 157.5)              return 4  // 左側 (下半)
  if (a < 202.5)              return 4  // 左側
  if (a < 247.5)              return 0  // 左上
  if (a < 292.5)              return 1  // 正上
  return 2                             // 右上
}

/**
 * CatGaze — Stacked independent image layers.
 *
 * All 8 images are pre-loaded and absolutely stacked in the DOM.
 * Only the active frame has opacity:1; all others are opacity:0.
 * No position ever changes — zero bobbing, instant switching.
 */
export function CatGaze({ mouseX, mouseY, size = 300 }: CatGazeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // Default: index 5 = 06_forward (直視觀看者)
  const [frameIndex, setFrameIndex] = useState<number>(5)

  useEffect(() => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const dx = mouseX - centerX
    const dy = mouseY - centerY
    const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI
    setFrameIndex(angleToFrameIndex(angleDeg))
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
