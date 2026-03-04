import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [clientes, setClientes] = useState([])

  useEffect(() => {
    // Asegúrate de que tu Spring Boot esté corriendo en el 8080
    axios.get('http://localhost:8080/api/clientes')
      .then(res => setClientes(res.data))
      .catch(err => console.error("¡Huston, tenemos un problema!", err))
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h1>SweetDash - Panel de Control</h1>
      <h2>Lista de Clientes (Prueba de API)</h2>
      <ul>
        {clientes.map(c => (
          <li key={c.idCliente}>{c.nombre} {c.apellidos}</li>
        ))}
      </ul>
    </div>
  )
}

export default App