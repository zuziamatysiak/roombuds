import { Box, Button, Card, Grid, Typography } from '@material-ui/core'
import { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Avatar } from '../components/profile/Avatar'
import { EditProfileModal } from '../components/profile/EditProfile'
import { Subtitle } from '../components/Text'
import { useUser } from '../utils/auth'
import { COLORS } from '../utils/colors'
import {
  USER_PREFERENCES_TABLE,
  USER_PROFILE_PICTURES,
} from '../utils/constants'
import { get } from '../utils/database'

const ProfilePage = () => {
  const [user] = useUser()

  const [userPrefs, setUserPrefs] = useState<any>({})
  const [editMode, setEditMode] = useState(false)
  // TODO: maybe as a stretch at the start everyone could get a random plant picture
  const [profilePicPath, setProfilePicPath] = useState('')

  useEffect(() => {
    async function fetchPrefs() {
      try {
        const response = await get('email', user.email, USER_PREFERENCES_TABLE)
        if (response.success) {
          setUserPrefs(response.data)
        }
      } catch (e) {
        console.error(e)
      }
    }
    async function fetchProfilePic() {
      try {
        const response = await get('email', user.email, USER_PROFILE_PICTURES)
        if (response.success) {
          setProfilePicPath(response.data.profilePicPath)
        } else {
          console.log('no profile pic found', response)
        }
      } catch (e) {
        console.error(e)
      }
    }
    if (user.email) {
      fetchPrefs()
      fetchProfilePic()
    }
  }, [user.email])

  return (
    <>
      <Navbar />
      <Box style={{ padding: '3rem 3rem', maxWidth: '75%', margin: 'auto' }}>
        <Grid container>
          <Grid item xs={12} sm={12} md={4} lg={3}>
            <Avatar
              src={profilePicPath}
              alt="profile_picture"
              width={200}
              height={200}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={9}>
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                position: 'relative',
              }}
            >
              <Button
                variant="outlined"
                style={{ position: 'absolute', top: 0, right: 0 }}
                onClick={() => setEditMode(!editMode)}
              >
                Edit
              </Button>
              {profilePicPath && (
                <EditProfileModal
                  open={editMode}
                  setOpen={setEditMode}
                  userPrefs={{ ...userPrefs, ...{ profilePicPath } }}
                />
              )}
              <Typography variant="h4">
                {user?.firstName} {user?.lastName} {user?.verified ? '✅' : ''}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={1} style={{ paddingTop: '3rem' }}>
          <Grid item xs={12} sm={6} md={6}>
            <Card variant="outlined" style={{ padding: '2rem' }}>
              <Typography>
                Looking for roommates in{' '}
                <span style={{ fontWeight: 600 }}>
                  {userPrefs.loc_city}, {userPrefs.loc_state}
                </span>
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

export default ProfilePage
