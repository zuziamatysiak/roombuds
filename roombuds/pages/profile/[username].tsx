import { Box, Card, Grid, Typography } from '@material-ui/core'
import { useEffect, useState } from 'react'
import { Navbar } from '../../components/Navbar'
import { Subtext, Subtitle } from '../../components/Text'
import { useUser } from '../../utils/auth'
import { COLORS } from '../../utils/colors'
import { USER_PREFERENCES_TABLE, USER_TABLE } from '../../utils/constants'
import { get } from '../../utils/database'
import { useRouter } from 'next/router'
import { ErrorMessage } from '../../components/ErrorMessage'
import ProfileHeader from '../../components/profile/ProfileHeader'

const ProfilePage = () => {
  const [currUser] = useUser() // user logged in
  const router = useRouter()
  const { username } = router.query // username of profile being viewed
  const [userInfo, setUserInfo] = useState<any>({})
  const [userPrefs, setUserPrefs] = useState<any>({})
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    async function fetchUserInfo() {
      const response = await get('username', username, USER_TABLE)
      if (!response.data) {
        setErrorMsg('Sorry, no profile with that username was found 😞')
      } else if (response.success) {
        setUserInfo(response.data)
      } else {
        console.log('Error fetching user info:', response.errorMessage)
      }
    }
    async function fetchPrefs() {
      const response = await get('username', username, USER_PREFERENCES_TABLE)
      if (response.success) {
        setUserPrefs(response.data)
      }
    }
    if (username) {
      fetchUserInfo()
      fetchPrefs()
    }
  }, [username])

  return (
    <>
      <Navbar />
      <Box style={{ padding: '3rem 3rem', maxWidth: '75%', margin: 'auto' }}>
        {errorMsg ? (
          <ErrorMessage errorMsg={errorMsg} />
        ) : (
          <>
            <ProfileHeader
              userPrefs={userPrefs}
              userInfo={userInfo}
              username={username}
            />
            <Grid container spacing={1} style={{ paddingTop: '3rem' }}>
              <Grid item xs={12} sm={6} md={6}>
                <Card variant="outlined" style={{ padding: '2rem' }}>
                  <Typography>
                    Looking for roommates in{' '}
                    <span style={{ fontWeight: 600 }}>
                      {userPrefs?.loc_city}, {userPrefs?.loc_state}
                    </span>
                  </Typography>
                  <Typography>
                    Works at{' '}
                    <span style={{ fontWeight: 600 }}>
                      {userPrefs?.company}
                    </span>
                  </Typography>
                  <Typography>
                    Goes to{' '}
                    <span style={{ fontWeight: 600 }}>
                      {userPrefs?.college}
                    </span>
                  </Typography>
                  <Subtitle text="Bio">
                    {userPrefs?.bio || (
                      <Subtext>{`${userInfo.firstName} has not written a bio yet.`}</Subtext>
                    )}
                  </Subtitle>
                  <div style={{ display: 'flex' }}>
                    <Subtitle text="Age" style={{ width: '50%' }}>
                      {userPrefs?.age}
                    </Subtitle>
                    <Subtitle text="Gender">{userPrefs?.gender}</Subtitle>
                  </div>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <Card variant="outlined" style={{ padding: '2rem' }}>
                  <Typography variant="h5">
                    About {userInfo?.firstName} {userInfo?.lastName}
                  </Typography>
                  <Grid container>
                    <Grid item xs={12} sm={6} md={6}>
                      <Subtitle text="BUDGET:" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <p>{userPrefs?.budget}</p>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <Subtitle text="WAKE UP TIME:" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <p>{userPrefs?.wakeuptime}</p>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <Subtitle text="BED TIME:" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <p>{userPrefs?.bedtime}</p>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <Subtitle text="HOBBIES:" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <p>{userPrefs?.hobbies}</p>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <Subtitle text="SMOKES CIGARETTE:" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <p>{userPrefs?.cigarettes}</p>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <Subtitle text="DRINKS ALCOHOL:" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <p>{userPrefs?.alcohol}</p>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </>
  )
}

export default ProfilePage
