import { useState } from 'react'
import './CatGazeStage.css'
import { CatGaze } from '../CatGaze'
import { GlbCatGaze } from '../CatGaze/GlbCatGaze'

type Mode = 'glb' | 'original'

export const CAPTIONS: Record<Mode, string> = {
  glb: '頭部可上下左右轉動,身體保持固定。立體形狀為照片近似建構',
  original: '依滑鼠方向切換圖片',
}

export function CatGazeStage() {
  const [mode, setMode] = useState<Mode>('original')
  const [controlsHost, setControlsHost] = useState<HTMLDivElement | null>(null)
  return (
    <div className="cat-gaze-stage">
      {mode === 'glb' && <GlbCatGaze size={400} controlsHost={controlsHost} />}
      {mode === 'original' && <CatGaze size={400} />}
      <div className="cat-gaze-options" aria-label="Hana 預覽版本">
        <button type="button" aria-pressed={mode === 'original'} onClick={() => setMode('original')}>照片版本</button>
        <button type="button" aria-pressed={mode === 'glb'} onClick={() => setMode('glb')}>2.5D 版本</button>
      </div>
      <p className="cat-gaze-caption">{CAPTIONS[mode]}</p>
      <div ref={setControlsHost} className="cat-gaze-controls-host" />
    </div>
  )
}
export default CatGazeStage
