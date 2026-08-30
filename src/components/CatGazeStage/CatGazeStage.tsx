import './CatGazeStage.css'
import { CatGaze } from '../CatGaze'
import { useMousePosition } from '../../hooks/useMousePosition'

export function CatGazeStage() {
  const { x, y } = useMousePosition()

  return (
    <div className="cat-gaze-stage">
      <CatGaze mouseX={x} mouseY={y} size={300} />
    </div>
  )
}

export default CatGazeStage
