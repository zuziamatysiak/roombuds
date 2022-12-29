import { Box, Card, Grid, Typography } from '@material-ui/core'
import { useContext, useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Subtitle } from '../components/Text'
import { UserContext } from '../utils/auth'
import { USER_PREFERENCES_TABLE } from '../utils/constants'
import { get, getAll } from '../utils/database'

const DashboardPage = () => {
  const { user, setUser } = useContext(UserContext)
  const [userPrefs, setUserPrefs] = useState<any>({})
  const [userMatches, setUserMatches] = useState<any>([])

  const prefWeights = {
    'location': 0.08771929824561403,
    'price': 0.2631578947368421,
    'personality': 0.2631578947368421,
    'hobbies': 0.008771929824561403,
    'clean': 0.2982456140350877,
    'schedule': 0.05263157894736842,
    'college': 0.02631578947
  }

  useEffect(() => {
    async function fetchPrefs() {
      try {
        const response = await get('email', user.email, USER_PREFERENCES_TABLE)
        console.log(response)
        if (response.success) {
          setUserPrefs(response.data)
        }
      } catch (e) {
        console.error(e)
      }
    }
    async function fetchMatches() {
      try {
        const response = await getAll( USER_PREFERENCES_TABLE)
        if (response.success) {
          const matchesRes = []
          for (const item of response.data) {
            if (item.email != user.email) {
              matchesRes.push(item)
            }
          }
          console.log(matchesRes)
          return matchesRes
        } 
      } catch (e) {
        console.error(e)
      }
    }
    async function orderMatches(matches: [any]) {
      const ordered = matches.sort((userData) => {
        console.log(userData)
        let score = 0;
        // location
        score += (
          userData["location"] == user.location ? 1 : 0
        ) *  prefWeights["location"]
        // price
        score += (
          userData["budget"] == user.budget ? 1 : 0 +
          userData["shared_room"] == user.shared_room ? 1 : 0
        ) *  prefWeights.price
        // personality
        score += (
          userData["alcohol"] == user.alcohol ? 1 : 0 +
          userData["cigarettes"] == user.cigarettes ?  1 : 0 +
          userData["drugs"] == user.drugs ?  1 : 0 +
          userData["social"] == user.social ?  1 : 0 +
          userData["weed"] == user.weed ?  1 : 0
        ) *  prefWeights.personality
        // hobbies
        score += (
          userData["hobbies"] == user.hobbies ? 1 : 0
        ) *  prefWeights.hobbies
        // clean
        score += (
          userData["cleanliness"] == user.cleanliness ? 1 : 0 +
          userData["atmosphere"] == user.atmosphere ?  1 : 0 +
          userData["common_space"] == user.common_space ?  1 : 0 +
          userData["common_space_things"] == user.common_space_things ?  1 : 0 +
          userData["company"] == user.company ?  1 : 0 +
          userData["atmosphere"] == user.atmosphere ?  1 : 0 +
          userData["dishes"] == user.dishes ?  1 : 0 +
          userData["leftovers"] == user.leftovers ?  1 : 0 + 
          userData["parties"] == user.parties ?  1 : 0 +
          userData["social"] == user.social ?  1 : 0 +
          userData["trash"] == user.trash ?  1 : 0 + 
          userData["weed_apartment"] == user.weed_apartment ?  1 : 0
        ) *  prefWeights.clean
        // schedule
        score += (
          userData["bathroom"] == user.bathroom ? 1 : 0 +
          userData["bedtime"] == user.bedtime ?  1 : 0 +
          userData["wakeuptime"] == user.wakeuptime ? 1 : 0
        ) *  prefWeights.schedule
        // college
        score += (
          userData["college"] == user.college ? 1 : 0
        ) *  prefWeights.college
        
        return score
      })
      setUserMatches(ordered)
    }
    fetchPrefs().then(_ =>
      fetchMatches().then(res =>
        orderMatches(res)
      )
    )
  }, [])


  return (
    <>
      <Navbar />
      <Box style={{ padding: '1rem 3rem', maxWidth: '75%', margin: 'auto' }}>
        <Typography variant="h4" style={{ margin: '1rem' }}>
          👋 Welcome {user?.firstName} {user?.lastName} {user?.verified ? '✅' : ''}
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6} md={6}>
            <Card variant="outlined" style={{ padding: '2rem' }}>
              <Typography>
                Looking for roommates in{' '}
                <span style={{ fontWeight: 600 }}>{userPrefs.loc_city}, {userPrefs.loc_state}</span>
              </Typography>
              <Typography>
                Works at{' '}
                <span style={{ fontWeight: 600 }}>{userPrefs.company}</span>
              </Typography>
              <Typography>
                Goes to{' '}
                <span style={{ fontWeight: 600 }}>{userPrefs.college}</span>
              </Typography>
            </Card>
            <Card variant="outlined" style={{ padding: '2rem' }}>
              <Typography>
               Match for you{' '}
                <span style={{ fontWeight: 600 }}>{userMatches[0].email}</span>
              </Typography>
              <Typography>
                Location{' '}
                <span style={{ fontWeight: 600 }}>{userMatches[0].location}</span>
              </Typography>
              <Typography>
                Works at{' '}
                <span style={{ fontWeight: 600 }}>{userMatches[0].company}</span>
              </Typography>
              <Typography>
                Goes to{' '}
                <span style={{ fontWeight: 600 }}>{userMatches[0].college}</span>
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Card variant="outlined" style={{ padding: '2rem' }}>
              <Typography variant="h5">
                About {user?.firstName} {user?.lastName}
              </Typography>
              <Grid container>
                <Grid item xs={12} sm={6} md={6}>
                  <Subtitle text="BUDGET:" />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <p>{userPrefs.budget}</p>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Subtitle text="WAKE UP TIME:" />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <p>{userPrefs.wakeuptime}</p>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Subtitle text="BED TIME:" />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <p>{userPrefs.bedtime}</p>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Subtitle text="TAKES OUT TRASH:" />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <p>{userPrefs.trash}</p>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Subtitle text="HOBBIES:" />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <p>{userPrefs.hobbies}</p>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Subtitle text="SMOKES CIGARETTE:" />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <p>{userPrefs.cigarettes}</p>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Subtitle text="DRINKS ALCOHOL:" />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <p>{userPrefs.alcohol}</p>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default DashboardPage
