import { useState } from 'react'
import Navbar from './components/Navbar'
import Sender from './components/Sender'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar/>
      <Sender/>

    </>
  )
}

export default App
