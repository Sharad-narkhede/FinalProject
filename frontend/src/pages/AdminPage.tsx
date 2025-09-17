import { useEffect, useState } from 'react'
import { Box, Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material'
import { apiAuth } from '../services/api'

export default function AdminPage() {
  const [name, setName] = useState('Faculty Teaching Template')
  const [templates, setTemplates] = useState<any[]>([])
  const [questionText, setQuestionText] = useState('Clarity of explanations')

  async function createTemplate() {
    const payload = {
      name,
      target_type: 'faculty',
      questions: [
        { text: questionText, type: 'likert' },
        { text: 'What went well?', type: 'text' }
      ]
    }
    await apiAuth().post('/api/v1/crud/templates', payload)
    loadTemplates()
  }

  async function loadTemplates() {
    const { data } = await apiAuth().get('/api/v1/crud/templates')
    setTemplates(data)
  }

  useEffect(() => { loadTemplates() }, [])

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Admin</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Create Template</Typography>
              <TextField fullWidth label="Template name" value={name} onChange={e => setName(e.target.value)} sx={{ mt: 2 }} />
              <TextField fullWidth label="First question" value={questionText} onChange={e => setQuestionText(e.target.value)} sx={{ mt: 2 }} />
              <Button variant="contained" sx={{ mt: 2 }} onClick={createTemplate}>Create</Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Existing Templates</Typography>
              {templates.map(t => (
                <Box key={t.id} sx={{ mt: 1 }}>
                  <Typography variant="body2">{t.name} · {t.target_type}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

