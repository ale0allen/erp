import { AuthProvider } from './auth/AuthContext'
import { AppRoutes } from './routes/AppRoutes'

import './styles/erp.css'

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
