import './App.css'
import CatGazeStage from './components/CatGazeStage'

function App() {
  return (
    <div className="app">
      <h2 className="app-header">我叫 Hana，是一隻玳瑁貓</h2>
      <p className="app-title">移動你的滑鼠，看看貓咪的反應！</p>
      <CatGazeStage />
    </div>
  )
}

export default App
