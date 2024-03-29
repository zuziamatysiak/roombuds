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
import { useRouter } from 'next/router'
import Link from 'next/link'

const ExplorePage = () => {
  // NOTE: only added company and school search as the rest should be based on the matching algorithm
  const [companyInput, setCompanyInput] = useState('')
  const [collegeInput, setCollegeInput] = useState('')
  const [user, setUser] = useUser()
  const myLoader = ({ src, width, quality }) => {
    return src + '/${src}?w=${width}&q=${quality || 75}'
  }
  const router = useRouter()

  const [peopleList, setPeopleList] = useState([])
  const [originalList, setOrginalList] = useState([])
  useEffect(() => {
    async function getPeople() {
      try {
        const people = await mergeTables(
          USER_PREFERENCES_TABLE,
          USER_TABLE,
          USER_PROFILE_PICTURES
        )
        setPeopleList(people)
        setOrginalList(people)
      } catch (e) {
        console.error(e)
      }
    }
    getPeople()
  }, [])

  async function handleSubmitCompany() {
    var newPplList = []
    originalList.forEach(function (p) {
      if (p.company == companyInput) {
        newPplList.push(p)
      }
    })
    if (newPplList.length >= 1) {
      setPeopleList(newPplList)
    } else {
      setPeopleList(originalList)
    }
  }

  async function handleSubmitCollege() {
    var newPplList = []
    originalList.forEach(function (p) {
      if (p.college == collegeInput) {
        newPplList.push(p)
      }
    })
    if (newPplList.length >= 1) {
      setPeopleList(newPplList)
    } else {
      setPeopleList(originalList)
    }
  }

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
      <TextField
        id="filled-basic"
        label="Search by company:"
        variant="filled"
        onChange={(e) => {
          setCompanyInput(e.target.value)
        }}
        style={{
          marginTop: '1rem',
          marginLeft: '2rem',
          width: '700px',
        }}
      />
      <Button
        variant="contained"
        style={{
          marginTop: '1.5rem',
          marginLeft: '1rem',
          backgroundColor: '#459b55',
          color: 'white',
        }}
        onClick={handleSubmitCompany}
      >
        Search
      </Button>
      <TextField
        id="filled-basic"
        label="Search by college:"
        variant="filled"
        onChange={(e) => {
          setCollegeInput(e.target.value)
        }}
        style={{
          marginTop: '1rem',
          marginLeft: '2rem',
          width: '700px',
        }}
      />
      <Button
        variant="contained"
        style={{
          marginTop: '1.5rem',
          marginLeft: '1rem',
          backgroundColor: '#459b55',
          color: 'white',
        }}
        onClick={handleSubmitCollege}
      >
        Search
      </Button>
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
                  <Image
                    src={peopleList[index].profilePicPath || RANDOM_PATH}
                    alt="profile_picture"
                    width={200}
                    height={200}
                    style={{ alignContent: 'center' }}
                  />
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
                    {peopleList[index].college.length <= 30 ? (
                        <span style={{ fontWeight: 600, fontSize: '12px' }}>
                          {peopleList[index].college}
                        </span>
                      ) : (
                        <span style={{ fontWeight: 600, fontSize: '12px' }}>
                          {peopleList[index].college.substring(0, 30) + "..."}
                        </span>
                      )}
                    </Typography>
                    <Typography>
                    {peopleList[index].company.length <= 30 ? (
                        <span style={{ fontWeight: 600, fontSize: '12px' }}>
                          {peopleList[index].company}
                        </span>
                      ) : (
                        <span style={{ fontWeight: 600, fontSize: '12px' }}>
                          {peopleList[index].company.substring(0, 30) + "..."}
                        </span>
                      )}
                    </Typography>
                  </div>
                </Grid>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default ExplorePage