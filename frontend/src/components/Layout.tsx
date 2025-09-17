import { AppBar, Box, Button, Container, IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import DarkModeSwitch from './ThemeToggle'

export default function Layout() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <AppBar position="sticky" color="primary">
        <Toolbar>
          <IconButton color="inherit" edge="start" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Smart Feedback</Typography>
          <Button component={RouterLink} to="/dashboard" color="inherit">Dashboard</Button>
          <Button component={RouterLink} to="/surveys" color="inherit">Surveys</Button>
          <Button component={RouterLink} to="/admin" color="inherit">Admin</Button>
          <DarkModeSwitch />
          {user ? (
            <Button onClick={() => { logout(); navigate('/login') }} color="inherit">Logout</Button>
          ) : (
            <Button onClick={() => navigate('/login')} color="inherit">Login</Button>
          )}
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 3, flexGrow: 1 }}>
        <Outlet />
      </Container>
      <Box component="footer" textAlign="center" py={3}>
        <Typography variant="body2" color="text.secondary">© {new Date().getFullYear()} Smart Feedback</Typography>
      </Box>
    </Box>
  )
}

