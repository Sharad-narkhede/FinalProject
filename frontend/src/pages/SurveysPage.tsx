import { useEffect, useState } from 'react'
import { Box, Button, Card, CardActions, CardContent, Grid, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { apiAuth } from '../services/api'

type Template = { id: number; name: string; target_type: string }

export default function SurveysPage() {
  const [templates, setTemplates] = useState<Template[]>([])

  useEffect(() => {
    apiAuth().get('/api/v1/crud/templates').then(r => setTemplates(r.data)).catch(() => setTemplates([]))
  }, [])

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Surveys</Typography>
      <Grid container spacing={2}>
        {templates.map(t => (
          <Grid item xs={12} sm={6} md={4} key={t.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{t.name}</Typography>
                <Typography variant="body2" color="text.secondary">Target: {t.target_type}</Typography>
              </CardContent>
              <CardActions>
                <Button component={RouterLink} to={`/surveys/${t.id}`} size="small">Take Survey</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

