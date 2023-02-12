import { Box, Card, Grid, Typography, Button } from '@material-ui/core'
import Image from 'next/image'
import { useContext, useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Subtitle } from '../components/Text'
import { UserContext } from '../utils/auth'
import { USER_PREFERENCES_TABLE, USER_PROFILE_PICTURES, RANDOM_PATH } from '../utils/constants'
import { get, put } from '../utils/database'

const ExplorePage = () => {
  const { user, setUser } = useContext(UserContext)
//   const [userPrefs, setUserPrefs] = useState<any>({})
//   // TODO: maybe as a stretch at the start everyone could get a random plant picture 
//   const randomPicPath = RANDOM_PATH
//   const [filePath, setFilePath] = useState(randomPicPath)
//   const [tempPath, setTempPath] = useState(randomPicPath)

//   useEffect(() => {
//     async function fetchPrefs() {
//       try {
//         const response = await get('email', user.email, USER_PREFERENCES_TABLE)
//         console.log(response)
//         if (response.success) {
//           setUserPrefs(response.data)
//         }
//       } catch (e) {
//         console.error(e)
//       }
//     };
//     async function fetchProfilePic() {
//       try {
//         const response = await get('email', user.email, USER_PROFILE_PICTURES)
//         if (response.success) {
//           setFilePath(response.data.tempPath)
//         } else {
//           setFilePath(RANDOM_PATH)
//         }
//       }
//       catch (e) {
//         console.error(e)
//         setFilePath(RANDOM_PATH)
//       }
//     }
//     fetchPrefs()
//     fetchProfilePic()
//   }, [])

//   // TODO: add picture cropping instead of squashing
//   const myLoader = ({ src, width, quality }) => {
//     console.log(filePath)
//     if (filePath == undefined) setFilePath(RANDOM_PATH)
//     // TODO: Add check if someone added a valid URL
//     return filePath + "/${src}?w=${width}&q=${quality || 75}"
//   }

//   // TODO: later change it to save a file as opposed to saving a link
//   function onFileChange(data: any) {
//     setTempPath(data.target.value)
//   }

//   // TODO: once AWS works, save it in the database
//   function onFileSubmit(data: any) {
//     setFilePath(tempPath)
//     const pic = { email: user.email, tempPath}
//     put(pic, USER_PROFILE_PICTURES)
//   }
console.log("X")
console.log(user)
const myLoader = ({ src, width, quality }) => {
    return RANDOM_PATH + "/${src}?w=${width}&q=${quality || 75}"
}

  return (
    <>
      <Navbar />
      <Typography variant="h4" style={{marginTop: '2rem', marginLeft: "2rem"}}>
            <span style={{ fontWeight: 600 }}>Explore your potential roommates</span>
      </Typography>
      <Grid container spacing={7} columns={ 5 } style={{marginTop: '1rem', marginRight: "0.2rem", marginLeft: "0.2rem"}}>
        {Array.from(Array(6)).map((_, index) => (
            <Grid item xs={2} sm={4} md={4} lg ={4} key={index}>
                <Card style={{width: "90%"}}>
                    <Grid container>
                        <Image
                        // TODO: improve UI
                        loader={myLoader}
                        src="profile.png"
                        alt="profile_picture"
                        width={200}
                        height={200}
                        style = {{alignContent: 'center'}}
                        />
                        <div style = {{marginLeft:"3rem", marginTop: "2rem"}}>
                            <Typography>
                                <span style={{ fontWeight: 600 }}>NAME</span>
                            </Typography>
                            <Typography>
                                <span style={{ fontWeight: 600 }}>LOCATION</span>
                            </Typography>
                            <Typography>
                                <span style={{ fontWeight: 600 }}>BUDGET</span>
                            </Typography>
                            <Typography>
                                <span style={{ fontWeight: 600 }}>SCHOOL</span>
                            </Typography>
                            <Typography>
                                <span style={{ fontWeight: 600 }}>COMPANY</span>
                            </Typography>
                        </div>
                    </Grid>
                </Card>
            </Grid>
  ))}
</Grid>
    </>
  )
}

export default ExplorePage