import { useEffect, useState } from 'react'
import { Box, Card, CardContent, Grid, Typography } from '@mui/material'
import { apiAuth } from '../services/api'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [summary, setSummary] = useState<any>(null)

  useEffect(() => {
    apiAuth().get('/api/v1/auth/me').then(r => setUser(r.data)).catch(() => setUser(null))
    // naive: try to fetch summary for assignment 1 if exists
    apiAuth().get('/api/v1/crud/assignments/active').then(r => {
      const first = r.data?.[0]
      if (first) {
        apiAuth().get(`/api/v1/feedback/summary/${first.id}`).then(sr => setSummary(sr.data)).catch(() => setSummary(null))
      }
    }).catch(() => {})
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
        {summary && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">Latest Survey Summary</Typography>
                <Typography variant="body2">Responses: {summary.responses}</Typography>
                {summary.sentiment_avg !== undefined && summary.sentiment_avg !== null && (
                  <Typography variant="body2">Avg Sentiment: {summary.sentiment_avg.toFixed(2)}</Typography>
                )}
                {summary.message && (
                  <Typography variant="body2" color="text.secondary">{summary.message}</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

