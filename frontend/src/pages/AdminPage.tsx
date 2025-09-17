import { useEffect, useState } from 'react'
import { Box, Button, Card, CardContent, CircularProgress, Divider, Grid, MenuItem, TextField, Typography } from '@mui/material'
import { apiAuth } from '../services/api'

export default function AdminPage() {
  const [name, setName] = useState('Faculty Teaching Template')
  const [templates, setTemplates] = useState<any[]>([])
  const [questionText, setQuestionText] = useState('Clarity of explanations')
  const [depName, setDepName] = useState('Physics')
  const [deps, setDeps] = useState<any[]>([])
  const [facName, setFacName] = useState('Main Auditorium')
  const [facType, setFacType] = useState('classroom')
  const [facilities, setFacilities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

  async function loadDeps() {
    const { data } = await apiAuth().get('/api/v1/crud/departments')
    setDeps(data)
  }

  async function loadFacilities() {
    const { data } = await apiAuth().get('/api/v1/crud/facilities')
    setFacilities(data)
  }

  useEffect(() => {
    Promise.all([loadTemplates(), loadDeps(), loadFacilities()]).finally(() => setLoading(false))
  }, [])

  async function createDepartment() {
    await apiAuth().post('/api/v1/crud/departments', { name: depName })
    setDepName('')
    loadDeps()
  }

  async function createFacility() {
    await apiAuth().post('/api/v1/crud/facilities', { name: facName, type: facType })
    setFacName('')
    loadFacilities()
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Admin</Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
      ) : (
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

        <Grid item xs={12}>
          <Divider sx={{ my: 1 }} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Departments</Typography>
              <TextField fullWidth label="Department name" value={depName} onChange={e => setDepName(e.target.value)} sx={{ mt: 2 }} />
              <Button variant="outlined" sx={{ mt: 2 }} onClick={createDepartment}>Add Department</Button>
              <Box sx={{ mt: 2 }}>
                {deps.map(d => (
                  <Typography variant="body2" key={d.id}>{d.name}</Typography>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Facilities</Typography>
              <TextField fullWidth label="Facility name" value={facName} onChange={e => setFacName(e.target.value)} sx={{ mt: 2 }} />
              <TextField select fullWidth label="Type" value={facType} onChange={e => setFacType(e.target.value)} sx={{ mt: 2 }}>
                {['classroom','laboratory','library','hostel'].map(t => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </TextField>
              <Button variant="outlined" sx={{ mt: 2 }} onClick={createFacility}>Add Facility</Button>
              <Box sx={{ mt: 2 }}>
                {facilities.map(f => (
                  <Typography variant="body2" key={f.id}>{f.name} · {f.type}</Typography>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      )}
    </Box>
  )
}

