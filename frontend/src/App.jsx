import './App.css'
import Home from './components/Home'
import { AppProvider } from './components/AppContext'
import { Toaster } from "react-hot-toast"

function App() {

  return (
     <AppProvider>
      <Home/>
      <Toaster/>
    </AppProvider>
  )
}

export default App

