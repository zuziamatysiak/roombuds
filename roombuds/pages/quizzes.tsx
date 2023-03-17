import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Modal
} from '@material-ui/core'

import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { FormSelect } from '../components/Form'
import { Navbar } from '../components/Navbar'
import { useUser } from '../utils/auth'
import { USER_PREFERENCES_TABLE } from '../utils/constants'
import { update } from '../utils/database'

export interface question {
  id: string
  label: string
  items: any[]
}

const emptyQuestion = {
  id: '',
  label: '',
  items: ['']
}


// Price: shared_room
const price: question[] = [
  {
    id: "shared_room",
    label: "Do you mind a shared room with your roommate at a cheaper price?",
    items: ['Yes', 'No']
  }
]

// Personality: drugs, social, weed
const personality: question[] = [
  {
    id: 'drugs',
    label: "Do you do other drugs?",
    items: ['Yes', 'No'],
  },
  {
    id: 'social',
    label: "How often do you plan to have people over?",
    items: [
      'Never',
      'Once or twice a month',
      'Several times a week',
      'Once a week',
      'Everyday',
    ]
  },
  {
    id: 'weed',
    label: "Do you smoke weed?",
    items: ['Yes', 'No']
  }
]

// Cleanliness: cleanliness, atmosphere, common_space, common_space_things, dishes, leftovers, parties, weed_apartment
const cleanliness: question[] = [
  {
    id: 'cleanliness',
    label: "How clean are you on a scale of 1-5?",
    items: [
      { value: 1, label: '1 (does not clean)' },
      { value: 2, label: '2 (cleans once a month)' },
      { value: 3, label: '3 (cleans usually once a week)' },
      { value: 4, label: '4 (cleans at least twice a week)' },
      { value: 5, label: '5 (cleans everyday)' },
    ]
  },
  {
    id: 'atmosphere',
    label: "Do you prefer loud or quiet atmosphere?",
    items: [
      'Quiet',
      'Loud',
      'Quiet at night, loud during the day',
      'Quiet during the day, loud at night',
      'Quiet on weekdays, loud on the weekends',
      "Don't really mind adjusting to either",
    ]
  },
  {
    id: 'common_space',
    label: "Should your roommate tell you if they will have people over in the common space?",
    items: ['Yes', 'No']
  },
  {
    id: 'common_space_things',
    label: "Should you inform your roommate before putting things in the common space?",
    items: ['Yes', 'No']
  },
  {
    id: 'dishes',
    label: "When do you clean the dishes?",
    items: [
      'Right after preparing my meal',
      'Right after I finish eating',
      'Next day',
      'Within a week',
      'I do not have a timeline on when',
    ]
  },
  {
    id: 'leftovers',
    label: "When do you throw away leftovers?",
    items: ['< 5 min', '< 15 min', '< 30 min', 'more than 30 min']
  },
  {
    id: 'parties',
    label: "How many parties / month do you plan on having?",
    items: ['0', '1', '2', '< 3', 'At least once a week']
  },
  {
    id: 'weed_apartment',
    label: "Do you plan on smoking weed in the apartment?",
    items: ['Yes', 'No']
  },
  {
    id: 'trash',
    label: "How often do you throw out the trash?",
    items: [
      'Never',
      'Once or twice a month',
      'Several times a week',
      'Once a week',
      'Everyday',
    ]
  }
]

// Schedule: bathroom
const schedule: question[] = [
  {
    id: 'bathroom',
    label: "How much time do you spend in the bathroom in the morning?",
    items: ['< 5 min', '< 15 min', '< 30 min', 'more than 30 min']
  },
  {
    id: 'notice',
    label: "Should your roommate let you know if they will have people over in their room?",
    items: ['Yes', 'No']
  }
]

const categories = [
  { category: 'Price', questions: price },
  { category: 'Personality', questions: personality },
  { category: 'Cleanliness', questions: cleanliness },
  { category: 'Schedule', questions: schedule }
]

function getRandomQuestion(categoryIdx: number): question {
  let idx = Math.floor(Math.random() * categories[categoryIdx].questions.length)
  return categories[categoryIdx].questions[idx]
}

const QuizzesPage = () => {
  const router = useRouter()
  const [user, _] = useUser()
  const [categoryIdx, setCategoryIdx] = useState(-1)
  const [question, setQuestion] = useState(emptyQuestion)
  const [answer, setAnswer] = useState('')
  const updateAnswer = useCallback((newState: any) => {
    setAnswer(newState.value)
  }, [])

  const handleSubmit = async () => {
    if (answer.length == 0) {
      alert('Please answer!')
      return
    }
    const resp = await update(
      { [question.id]: answer },
      'email',
      user?.email,
      USER_PREFERENCES_TABLE
    )
    if (!resp.success) {
      console.log(resp.errorMessage)
    }
    setQuestion(emptyQuestion)
    setAnswer('')
    router.push('/quizzes')
  }

  return (
    <>
      <Navbar />
      <Typography variant="h4" style={{ margin: '1rem' }}>
        Answer some more questions for better matches 🌱
      </Typography>

      <div>
        <Grid container spacing={3} style={{ margin: 'auto', maxWidth: '100%' }}>
          {categories.map(function (category, i) {
            return (
              <Grid item xs={6}>
                <Button
                  style={{
                    backgroundColor: 'white',
                    color: '#459b55',
                    marginRight: '1em',
                    height: '10rem',
                    width: '100%',
                    fontSize: '2rem',
                    fontWeight: 1000,
                    border: '0.2rem solid'
                  }}
                  variant="contained"
                  onClick={() => {
                    setCategoryIdx(i)
                    setQuestion(getRandomQuestion(i))
                  }}
                >
                  {category.category}
                </Button>
              </Grid>
            )
          })
          }
        </Grid>
        <Modal
          open={question.id.length > 0}
          onClose={_ => {
            setQuestion(emptyQuestion)
            setAnswer('')
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Card style={{
            width: '30em',
            height: '30em',
          }}>
            <CardContent style={{
              width: '100%',
              height: '70%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            >
              <FormSelect
                id={'value'}
                label={question.label}
                value={answer}
                items={question.items}
                updateState={updateAnswer}
                labelShrink={false}
                labelStyle={{ textAlign: 'center', width: '100%' }}
                selectStyle={{ marginTop: '10rem' }}
              />
            </CardContent>
            <CardActions>
              <Grid style={{ width: '100%' }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  onClick={handleSubmit}
                  style={{
                    margin: '0.5rem 0',
                    backgroundColor: '#459b55',
                    color: 'white',
                  }}
                >
                  Submit
                </Button>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  onClick={() => {
                    setQuestion(getRandomQuestion(categoryIdx))
                    setAnswer('')
                  }}
                  style={{
                    margin: '0.5rem 0',
                    backgroundColor: '#459b55',
                    color: 'white',
                  }}
                >
                  Another Question
                </Button>
              </Grid>
            </CardActions>
          </Card>
        </Modal>
      </div>
    </>
  )
}

export default QuizzesPage