import { useEffect, useState } from 'react'
import { Box, Card, CardContent, Grid, Typography } from '@mui/material'
import { apiAuth } from '../services/api'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    apiAuth().get('/api/v1/auth/me').then(r => setUser(r.data)).catch(() => setUser(null))
  }, [])

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Welcome</Typography>
              <Typography variant="body1">{user ? user.full_name : 'Guest'}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Quick Tips</Typography>
              <Typography variant="body2">Use the Surveys tab to submit feedback. Admins manage templates and assignments.</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

