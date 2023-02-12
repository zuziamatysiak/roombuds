import { Box, Card, Grid, Typography, Button } from '@material-ui/core'
import Image from 'next/image'
import { useContext, useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Subtitle } from '../components/Text'
import { UserContext } from '../utils/auth'
import { USER_PREFERENCES_TABLE, USER_PROFILE_PICTURES, RANDOM_PATH } from '../utils/constants'
import { get, put, scanTable } from '../utils/database'

const ExplorePage = () => {
    const { user, setUser } = useContext(UserContext)
    const myLoader = ({ src, width, quality }) => {
        return RANDOM_PATH + "/${src}?w=${width}&q=${quality || 75}"
    }

    // TODO: add error checking
    const people = scanTable(USER_PREFERENCES_TABLE)
    var peopleList = []
    people.then((val) => peopleList.push(val));

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