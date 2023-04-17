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
import { sortMatches, getFeaturedMatch } from '../utils/matching'
import Link from 'next/link'

const MatchPage = () => {
  const [user] = useUser()
  const [featuredMatch, setFeaturedMatch] = useState<any>({})

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
          try {
            const people = await mergeTables(
              USER_PREFERENCES_TABLE,
              USER_TABLE,
              USER_PROFILE_PICTURES
            )
            const match1 = getFeaturedMatch(user, userPrefs, people)
            const sortedMatches = sortMatches(user, userPrefs, match1, people)
            setFeaturedMatch(match1 ?? sortedMatches[0])
            setPeopleList(match1 ? sortedMatches : sortedMatches.slice(1))
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
      {featuredMatch != null ? 
        <>
          <Typography
            variant="h5"
            style={{ marginTop: '2rem', marginLeft: '2rem' }}
          >
            <span style={{ fontWeight: 600 }}>
              Featured roommate match
            </span>
          </Typography>
          <Link href={`/profile/${featuredMatch.username}`}>
            <Card style={{ width: '33%', marginLeft: '3rem', marginTop: '2rem' }}>
              <Grid container>
                {featuredMatch?.profilePicPath !== undefined ? (
                  <Image
                    src={featuredMatch?.profilePicPath}
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
                    {featuredMatch?.firstName !== undefined ? (
                      <span style={{ fontWeight: 600 }}>
                        {featuredMatch.firstName}
                      </span>
                    ) : (
                      <span style={{ fontWeight: 600 }}></span>
                    )}
                  </Typography>
                  <Typography>
                    {featuredMatch?.loc_city?.length ?? 11 <= 10 ? (
                      <span style={{ fontWeight: 600, fontSize: '12px' }}>
                        {featuredMatch?.loc_city},{' '}
                        {featuredMatch?.loc_state}
                      </span>
                    ) : (
                      <span style={{ fontWeight: 600, fontSize: '12px' }}>
                        {featuredMatch?.loc_city}
                      </span>
                    )}
                  </Typography>
                  <Typography>
                    <span style={{ fontWeight: 600, fontSize: '12px' }}>
                      {featuredMatch?.budget}
                    </span>
                  </Typography>
                  <Typography>
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: '12px',
                      }}
                    >
                      {featuredMatch?.college}
                    </span>
                  </Typography>
                  <Typography>
                    <span style={{ fontWeight: 600, fontSize: '12px' }}>
                      {featuredMatch?.company}
                    </span>
                  </Typography>
                </div>
              </Grid>
            </Card>
          </Link>
        </>
      : null }
      <Typography
        variant="h5"
        style={{ marginTop: '2rem', marginLeft: '2rem' }}
      >
        <span style={{ fontWeight: 600 }}>
        {peopleList.length == 0 ? "No matches found" : "Your matches"}
        </span>
      </Typography>
      {peopleList.length > 0 ? 
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
              <Link href={`/profile/${peopleList[index].username}`}>
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
              </Link>
            </Grid>
          ))}
        </Grid>
        : null }
    </>
  )
}

export default MatchPage