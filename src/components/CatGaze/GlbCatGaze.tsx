import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { HanaGlbViewer } from './glbViewerBundle'
import './GlbCatGaze.css'
import { CAPTIONS } from '../CatGazeStage/CatGazeStage'

const YAW_MIN = -55, YAW_MAX = 55, PITCH_MIN = -30, PITCH_MAX = 35

interface GlbCatGazeProps {
  size?: number
  /** Element the action buttons are rendered into (falls back to inline). */
  controlsHost?: HTMLElement | null
}

export function GlbCatGaze({ size = 400, controlsHost }: GlbCatGazeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const viewerRef = useRef<HanaGlbViewer | null>(null)
  const followRef = useRef(true)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [follow, setFollowState] = useState(true)
  const [headOnly, setHeadOnly] = useState(false)
  const [yaw, setYaw] = useState(0)
  const [pitch, setPitch] = useState(0)

  const setFollow = (v: boolean) => { followRef.current = v; setFollowState(v) }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let viewer: HanaGlbViewer
    try {
      viewer = new HanaGlbViewer(canvas, import.meta.env.BASE_URL + 'hana-fixed-body.glb', {
        onReady: () => setReady(true),
        onError: () => { setReady(false); setFailed(true) },
        onPose: (y, p) => { if (followRef.current) { setYaw(Math.round(y)); setPitch(Math.round(p)) } },
      })
    } catch { setFailed(true); return }
    viewerRef.current = viewer
    const pointer = (e: PointerEvent) => {
      if (!followRef.current) return
      if (e.target instanceof Element && e.target.closest('button,input')) return
      viewer.aim(e.clientX, e.clientY)
    }
    const reset = () => { if (followRef.current) viewer.setAngles(0, 0) }
    window.addEventListener('pointermove', pointer, { passive: true })
    window.addEventListener('pointerdown', pointer, { passive: true })
    window.addEventListener('blur', reset)
    document.documentElement.addEventListener('pointerleave', reset)
    return () => {
      viewer.destroy(); viewerRef.current = null
      window.removeEventListener('pointermove', pointer)
      window.removeEventListener('pointerdown', pointer)
      window.removeEventListener('blur', reset)
      document.documentElement.removeEventListener('pointerleave', reset)
    }
  }, [])

  const apply = (y: number, p: number) => {
    setFollow(false)
    setYaw(Math.round(y)); setPitch(Math.round(p))
    viewerRef.current?.setAngles(y, p)
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home'].includes(e.key)) return
    e.preventDefault()
    let y = yaw, p = pitch
    if (e.key === 'Home') { y = 0; p = 0 }
    if (e.key === 'ArrowUp') p = Math.max(PITCH_MIN, p - 5)
    if (e.key === 'ArrowDown') p = Math.min(PITCH_MAX, p + 5)
    if (e.key === 'ArrowLeft') y = Math.max(YAW_MIN, y - 5)
    if (e.key === 'ArrowRight') y = Math.min(YAW_MAX, y + 5)
    apply(y, p)
  }

  const controls = (
    <>
      <div className="glb-cat-sliders">
        <label>左右
          <input type="range" min={YAW_MIN} max={YAW_MAX} step={1} value={yaw} disabled={!ready}
            onChange={e => apply(Number(e.target.value), pitch)} />
          <output>{yaw}°</output>
        </label>
        <label>抬頭／低頭
          <input type="range" min={PITCH_MIN} max={PITCH_MAX} step={1} value={pitch} disabled={!ready}
            onChange={e => apply(yaw, Number(e.target.value))} />
          <output>{pitch}°</output>
        </label>
      </div>
      <div className="glb-cat-controls" aria-label="頭部動作">
        <button type="button" disabled={!ready} aria-pressed={follow} onClick={() => setFollow(!follow)}>跟隨滑鼠</button>
        <button type="button" disabled={!ready} onClick={() => apply(0, -30)}>抬頭</button>
        <button type="button" disabled={!ready} onClick={() => apply(0, 35)}>低頭</button>
        <button type="button" disabled={!ready} onClick={() => apply(0, 0)}>回正</button>
        <button type="button" disabled={!ready} aria-pressed={headOnly}
          onClick={() => { const v = !headOnly; setHeadOnly(v); viewerRef.current?.setHeadOnly(v) }}>看頭部</button>
      </div>
    </>
  )

  return <div className="glb-cat-container">
    <div className="glb-cat" style={{ width: size, maxWidth: '100%', height: size }}>
      {!ready && <img src={import.meta.env.BASE_URL + '06_forward.png'} alt="Hana 原照片" />}
      <canvas ref={canvasRef} tabIndex={0} role="img" onKeyDown={onKey}
        aria-label={CAPTIONS.glb}
        style={{ opacity: ready ? 1 : 0 }} />
    </div>
    {controlsHost && createPortal(controls, controlsHost)}
    {!ready && <p className="glb-cat-status" role="status">{failed ? '此環境無法顯示 GLB,目前顯示原照片。' : '正在載入 Hana 的頭部模型…'}</p>}
  </div>
}
