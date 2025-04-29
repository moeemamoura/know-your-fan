import { Register } from './pages/Register';
import { Analise } from './components/Analise';
import { ValidarLink } from './components/ValidarLink';
import './App.css';


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
