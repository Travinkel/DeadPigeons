import { useEffect, useState } from 'react'

function App() {
  const [health, setHealth] = useState('unknown')

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((d) => setHealth(d.status))
      .catch(() => setHealth('unavailable'))
  }, [])

  return <div>API Health: {health}</div>
}

export default App
