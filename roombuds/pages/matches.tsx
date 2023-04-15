import { Box, Card, Grid, Typography, Button, TextField } from '@material-ui/core'
import Image from 'next/image'
import { useContext, useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { useUser } from '../utils/auth'
import {
  USER_PREFERENCES_TABLE,
  USER_PROFILE_PICTURES,
  RANDOM_PATH,
  USER_TABLE,
} from '../utils/constants'
import { get, mergeTables, put, scanTable } from '../utils/database'
import { sortMatches } from '../utils/matching'

const MatchPage = () => {
  const [user] = useUser()
  const [userPrefs, setUserPrefs] = useState<any>({})
  const myLoader = ({ src, width, quality }) => {
    return src + '/${src}?w=${width}&q=${quality || 75}'
  }

  // TODO: add error checking
  const [peopleList, setPeopleList] = useState([])
  useEffect(() => {
    async function getPeople() {
      if (!user.username) {
        return []
      }
      try {
        const response = await get(
          'username',
          user.username,
          USER_PREFERENCES_TABLE
        )
        if (response.success) {
          const userPrefs = response.data
          setUserPrefs(userPrefs)
          try {
            const people = await mergeTables(
              USER_PREFERENCES_TABLE,
              USER_TABLE,
              USER_PROFILE_PICTURES
            )
            const sortedMatches = sortMatches(user, userPrefs, people)
            setPeopleList(sortedMatches)
          } catch (e) {
            console.error(e)
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
    getPeople()
  }, [user])

  return (
    <>
      <Navbar />
      <Typography
        variant="h4"
        style={{ marginTop: '2rem', marginLeft: '2rem' }}
      >
        <span style={{ fontWeight: 600 }}>
          Your roommate matches
        </span>
      </Typography>
      <Typography
        variant="h5"
        style={{ marginTop: '2rem', marginLeft: '2rem' }}
      >
        <span style={{ fontWeight: 600 }}>
          Featured roommate match
        </span>
      </Typography>
      <Card style={{ width: '100%' }}>
        <Grid container>
          {userPrefs.profilePicPath !== undefined ? (
            <Image
              // TODO: improve UI
              src={userPrefs.profilePicPath}
              alt="profile_picture"
              width={200}
              height={200}
              style={{ alignContent: 'center' }}
            />
          ) : (
            <Image
              // TODO: improve UI
              src={RANDOM_PATH}
              alt="profile_picture"
              width={200}
              height={200}
              style={{ alignContent: 'center' }}
            />
          )}
          <div
            style={{
              marginLeft: '3rem',
              marginTop: '2rem',
            }}
          >
            <Typography>
              {userPrefs.firstName !== undefined ? (
                <span style={{ fontWeight: 600 }}>
                  {userPrefs.firstName}
                </span>
              ) : (
                <span style={{ fontWeight: 600 }}></span>
              )}
            </Typography>
            <Typography>
              {userPrefs.loc_city.length <= 10 ? (
                <span style={{ fontWeight: 600, fontSize: '12px' }}>
                  {userPrefs.loc_city},{' '}
                  {userPrefs.loc_state}
                </span>
              ) : (
                <span style={{ fontWeight: 600, fontSize: '12px' }}>
                  {userPrefs.loc_city}
                </span>
              )}
            </Typography>
            <Typography>
              <span style={{ fontWeight: 600, fontSize: '12px' }}>
                {userPrefs.budget}
              </span>
            </Typography>
            <Typography>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: '12px',
                }}
              >
                {userPrefs.college}
              </span>
            </Typography>
            <Typography>
              <span style={{ fontWeight: 600, fontSize: '12px' }}>
                {userPrefs.company}
              </span>
            </Typography>
          </div>
        </Grid>
      </Card>
      <Typography
        variant="h5"
        style={{ marginTop: '2rem', marginLeft: '2rem' }}
      >
        <span style={{ fontWeight: 600 }}>
          Your matches
        </span>
      </Typography>
      <Grid
        container
        spacing={7}
        columns={5}
        style={{
          marginTop: '1rem',
          marginRight: '0.2rem',
          marginLeft: '0.2rem',
        }}
      >
        {Array.from(Array(peopleList.length)).map((_, index) => (
          <Grid item xs={2} sm={4} md={4} lg={4} key={index}>
            <Card style={{ width: '100%' }}>
              <Grid container>
                {peopleList[index].profilePicPath !== undefined ? (
                  <Image
                    // TODO: improve UI
                    src={peopleList[index].profilePicPath}
                    alt="profile_picture"
                    width={200}
                    height={200}
                    style={{ alignContent: 'center' }}
                  />
                ) : (
                  <Image
                    // TODO: improve UI
                    src={RANDOM_PATH}
                    alt="profile_picture"
                    width={200}
                    height={200}
                    style={{ alignContent: 'center' }}
                  />
                )}
                <div
                  style={{
                    marginLeft: '3rem',
                    marginTop: '2rem',
                  }}
                >
                  <Typography>
                    {peopleList[index].firstName !== undefined ? (
                      <span style={{ fontWeight: 600 }}>
                        {peopleList[index].firstName}
                      </span>
                    ) : (
                      <span style={{ fontWeight: 600 }}></span>
                    )}
                  </Typography>
                  <Typography>
                    {peopleList[index].loc_city.length <= 10 ? (
                      <span style={{ fontWeight: 600, fontSize: '12px' }}>
                        {peopleList[index].loc_city},{' '}
                        {peopleList[index].loc_state}
                      </span>
                    ) : (
                      <span style={{ fontWeight: 600, fontSize: '12px' }}>
                        {peopleList[index].loc_city}
                      </span>
                    )}
                  </Typography>
                  <Typography>
                    <span style={{ fontWeight: 600, fontSize: '12px' }}>
                      {peopleList[index].budget}
                    </span>
                  </Typography>
                  <Typography>
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: '12px',
                      }}
                    >
                      {peopleList[index].college}
                    </span>
                  </Typography>
                  <Typography>
                    <span style={{ fontWeight: 600, fontSize: '12px' }}>
                      {peopleList[index].company}
                    </span>
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

export default MatchPage