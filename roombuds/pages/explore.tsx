import { Box, Card, Grid, Typography, Button, TextField } from '@material-ui/core'
import Image from 'next/image'
import { useContext, useEffect, useState } from 'react'
import { mergeStyles } from 'react-select'
import { Navbar } from '../components/Navbar'
import { Subtitle } from '../components/Text'
import { useUser } from '../utils/auth'
import {
  USER_PREFERENCES_TABLE,
  USER_PROFILE_PICTURES,
  RANDOM_PATH,
  USER_TABLE,
} from '../utils/constants'
import { get, mergeTables, put, scanTable } from '../utils/database'

/*
TODO: 
- add error checking
- when clicking transfer to another website
- generalize mergeTable
- enable search
- fix image sizing
*/
const ExplorePage = () => {
  const [user, setUser] = useUser()
  const myLoader = ({ src, width, quality }) => {
    return src + '/${src}?w=${width}&q=${quality || 75}'
  }

  // TODO: add error checking
  const [peopleList, setPeopleList] = useState([])
  useEffect(() => {
    async function getPeople() {
      try {
        const people = await mergeTables(
          USER_PREFERENCES_TABLE,
          USER_TABLE,
          USER_PROFILE_PICTURES
        )
        setPeopleList(people)
      } catch (e) {
        console.error(e)
      }
    }
    getPeople()
  }, [])

  return (
    <>
      <Navbar />
      <Typography
        variant="h4"
        style={{ marginTop: '2rem', marginLeft: '2rem' }}
      >
        <span style={{ fontWeight: 600 }}>
          Explore your potential roommates
        </span>
      </Typography>
      <TextField id="filled-basic" label="Search by company:" variant="filled" 
                style = {{          
                    marginTop: '1rem',
                    marginLeft: '2rem',
                    width: "700px"}}/>
      <Button variant="contained" style = {{marginTop: '1.5rem', marginLeft: '1rem', backgroundColor: '#459b55', color: 'white'}}>Search</Button>
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
            <Card style={{ width: '90%' }}>
              <Grid container>
                {peopleList[index].tempPath !== undefined ? (
                  <Image
                    // TODO: improve UI
                    loader={myLoader}
                    src={peopleList[index].tempPath}
                    alt="profile_picture"
                    width={200}
                    height={200}
                    style={{ alignContent: 'center' }}
                  />
                ) : (
                  <Image
                    // TODO: improve UI
                    loader={myLoader}
                    src={RANDOM_PATH}
                    alt="profile_picture"
                    width={200}
                    height={200}
                    style={{ alignContent: 'center' }}
                  />
                )}
                <div style={{ marginLeft: '3rem', marginTop: '2rem' }}>
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
                    <span style={{ fontWeight: 600, fontSize: '12px' }}>
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

export default ExplorePage