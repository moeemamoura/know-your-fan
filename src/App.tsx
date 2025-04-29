import { Register } from './pages/Register'
import { Analise } from './components/Analise'
import './App.css'
import { ValidarLink } from './components/ValidarLink'

function App() {
  return (
    <div className="flex flex-col items-center justify-center gap-10 p-8">
      <Register />
      <Analise />
      <ValidarLink />
    </div>
  )
}

export default App
