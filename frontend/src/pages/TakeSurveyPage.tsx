import { useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { apiAuth } from '../services/api'
import { Box, Button, Card, CardContent, FormControlLabel, Radio, RadioGroup, TextField, Typography } from '@mui/material'

type Question = { id: number; text: string; type: 'likert' | 'text' | 'mcq'; options?: string[] }

export default function TakeSurveyPage() {
  const { id } = useParams()
  const [questions, setQuestions] = useState<Question[]>([])
  const [template, setTemplate] = useState<{ id: number; name: string } | null>(null)
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [params] = useSearchParams()
  const assignmentId = Number(params.get('assignment'))
  const targetId = Number(params.get('target'))

  useEffect(() => {
    if (!id) return
    apiAuth().get(`/api/v1/crud/templates/${id}`).then(r => {
      setTemplate(r.data)
      setQuestions(r.data.questions)
    })
  }, [id])

  function handleChange(q: Question, value: any) {
    setAnswers(a => ({ ...a, [q.id]: value }))
  }

  const isValid = useMemo(() => questions.every(q => answers[q.id] !== undefined && answers[q.id] !== null && answers[q.id] !== ''), [questions, answers])

  async function handleSubmit() {
    const payload = {
      assignment_id: assignmentId,
      template_id: Number(id),
      target_id: targetId,
      answers: questions.map(q => ({
        question_id: q.id,
        numeric_value: typeof answers[q.id] === 'number' ? answers[q.id] : null,
        text_value: typeof answers[q.id] === 'string' ? answers[q.id] : null
      }))
    }
    await apiAuth().post('/api/v1/feedback/submit', payload)
    alert('Thanks for your feedback!')
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>{template?.name || 'Survey'}</Typography>

      {questions.map(q => (
        <Card key={q.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>{q.text}</Typography>
            {q.type === 'likert' && (
              <RadioGroup row value={answers[q.id] ?? ''} onChange={(_, v) => handleChange(q, Number(v))}>
                {[1,2,3,4,5].map(v => (
                  <FormControlLabel key={v} value={v} control={<Radio />} label={String(v)} />
                ))}
              </RadioGroup>
            )}
            {q.type === 'text' && (
              <TextField fullWidth multiline minRows={3} value={answers[q.id] ?? ''} onChange={e => handleChange(q, e.target.value)} />
            )}
          </CardContent>
        </Card>
      ))}

      <Button variant="contained" disabled={!isValid} onClick={handleSubmit}>Submit</Button>
    </Box>
  )
}

