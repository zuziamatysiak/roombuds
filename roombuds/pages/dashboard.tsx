import { Box, Card, Grid, Typography } from '@material-ui/core'
import { useContext, useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Subtitle } from '../components/Text'
import { UserContext } from '../utils/auth'
import { USER_PREFERENCES_TABLE } from '../utils/constants'
import { get } from '../utils/database'

const DashboardPage = () => {
  const { user, setUser } = useContext(UserContext)
  const [userPrefs, setUserPrefs] = useState<any>({})

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
    fetchPrefs()
  }, [])

  return (
    <>
      <Navbar />
      <Box style={{ padding: '1rem 3rem', maxWidth: '75%', margin: 'auto' }}>
        <Typography variant="h4" style={{ margin: '1rem' }}>
          👋 Welcome {user?.firstName} {user?.lastName}
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6} md={6}>
            <Card variant="outlined" style={{ padding: '2rem' }}>
              <Typography>
                Looking for roommates in{' '}
                <span style={{ fontWeight: 600 }}>{userPrefs.location}</span>
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
