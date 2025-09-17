import { useEffect, useState } from 'react'
import { Box, Button, Card, CardActions, CardContent, CircularProgress, Grid, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { apiAuth } from '../services/api'

type Assignment = { id: number; target_id: number; template: { id: number; name: string; target_type: string } }

export default function SurveysPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiAuth()
      .get('/api/v1/crud/assignments/active')
      .then(r => setAssignments(r.data))
      .catch(() => setAssignments([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Surveys</Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
      ) : assignments.length === 0 ? (
        <Typography>No active surveys available right now.</Typography>
      ) : (
        <Grid container spacing={2}>
          {assignments.map(a => (
            <Grid item xs={12} sm={6} md={4} key={a.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{a.template.name}</Typography>
                  <Typography variant="body2" color="text.secondary">Target: {a.template.target_type}</Typography>
                </CardContent>
                <CardActions>
                  <Button component={RouterLink} to={`/surveys/${a.template.id}?assignment=${a.id}&target=${a.target_id}`} size="small">Take Survey</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}

