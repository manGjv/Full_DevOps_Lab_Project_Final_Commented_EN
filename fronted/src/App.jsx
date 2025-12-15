import { useEffect, useState } from 'react'
import Header from './components/Header';

function App() {
const [message, setMessage] = useState('')

useEffect(() => {
fetch('/api')
.then(res => res. json())
. then (data => setMessage(data.message))
}, [])

return (
  <>
      <Header />
       <h1>{message}</h1>
  </>
);

}

export default App