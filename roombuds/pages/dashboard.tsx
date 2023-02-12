import { Box, Card, Grid, Typography, Button } from '@material-ui/core'
import Image from 'next/image'
import { useContext, useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Subtitle } from '../components/Text'
import { UserContext } from '../utils/auth'
import { USER_PREFERENCES_TABLE, USER_PROFILE_PICTURES, RANDOM_PATH } from '../utils/constants'
import { get, put } from '../utils/database'

const DashboardPage = () => {
  const { user, setUser } = useContext(UserContext)
  const [userPrefs, setUserPrefs] = useState<any>({})
  // TODO: maybe as a stretch at the start everyone could get a random plant picture 
  const randomPicPath = RANDOM_PATH
  const [filePath, setFilePath] = useState(randomPicPath)
  const [tempPath, setTempPath] = useState(randomPicPath)

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
    };
    async function fetchProfilePic() {
      try {
        const response = await get('email', user.email, USER_PROFILE_PICTURES)
        if (response.success) {
          setFilePath(response.data.tempPath)
        } else {
          setFilePath(RANDOM_PATH)
        }
      }
      catch (e) {
        console.error(e)
        setFilePath(RANDOM_PATH)
      }
    }
    fetchPrefs()
    fetchProfilePic()
  }, [])

  // TODO: add picture cropping instead of squashing
  const myLoader = ({ src, width, quality }) => {
    console.log(filePath)
    if (filePath == undefined) setFilePath(RANDOM_PATH)
    // TODO: Add check if someone added a valid URL
    return filePath + "/${src}?w=${width}&q=${quality || 75}"
  }

  // TODO: later change it to save a file as opposed to saving a link
  function onFileChange(data: any) {
    setTempPath(data.target.value)
  }

  function onFileSubmit(data: any) {
    setFilePath(tempPath)
    const pic = { email: user.email, tempPath}
    put(pic, USER_PROFILE_PICTURES)
  }

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
              <Image
              // TODO: improve UI
                loader={myLoader}
                src="profile.png"
                alt="profile_picture"
                width={200}
                height={200}
                style = {{alignContent: 'center'}}
              />
              <Typography style = {{fontSize: 12}}>
                  Change your profile picture by providing a link to your pic.
                </Typography>
              <input type="form" onChange={onFileChange}/>
              <Button 
                variant="contained" 
                onClick={onFileSubmit}
                style ={{margin: '0.5rem', maxHeight: '20px', minHeight: '20px'}}>
                  Change picture
              </Button>
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
