import { useState } from 'react'
import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

export default function LoginPage() {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function handleLogin() {
    try {
      setLoading(true)
      setError(null)
      const { data } = await api.post('/api/v1/auth/login', { email, password })
      localStorage.setItem('token', data.access_token)
      navigate('/dashboard')
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight="70vh">
      <Card sx={{ maxWidth: 420, width: '100%' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Sign in</Typography>
          <TextField label="Email" type="email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} />
          <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleLogin} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </CardContent>
      </Card>
    </Box>
  )
}

