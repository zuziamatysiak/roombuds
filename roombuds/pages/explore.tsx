import { Box, Card, Grid, Typography, Button } from '@material-ui/core'
import Image from 'next/image'
import { useContext, useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Subtitle } from '../components/Text'
import { UserContext } from '../utils/auth'
import { USER_PREFERENCES_TABLE, USER_PROFILE_PICTURES, RANDOM_PATH, USER_TABLE } from '../utils/constants'
import { get, put, scanTable } from '../utils/database'

const ExplorePage = () => {
    const { user, setUser } = useContext(UserContext)
    const myLoader = ({ src, width, quality }) => {
        return RANDOM_PATH + "/${src}?w=${width}&q=${quality || 75}"
    }

    // TODO: add error checking
    const [peopleList, setPeopleList] = useState([])
    const [peopleNameList, setPeopleNameList] = useState([])
    useEffect(() => {
        async function getPeople() {
            try {
                const people = await scanTable(USER_PREFERENCES_TABLE)
                setPeopleList(people)
              } catch (e) {
                console.error(e)
              }
        }; 
        async function getNames() {
            try {
                const peopleNames = await scanTable(USER_TABLE)
                var peopleTemp = []
                for (var i = 0; i < peopleList.length; i++) {
                    for (var j = 0; j < peopleNames.length; j++) {
                        if (peopleList[i].email == peopleNames[j].email) {
                            peopleTemp.push(peopleNames[j])
                        }
                    }
                }
                setPeopleNameList(peopleTemp)
            } catch (e) {
                console.error(e)
            }
        }
        getPeople()
        getNames()
    }, [])

    console.log(peopleNameList)
  return (
    <>
      <Navbar />
      <Typography variant="h4" style={{marginTop: '2rem', marginLeft: "2rem"}}>
            <span style={{ fontWeight: 600 }}>Explore your potential roommates</span>
      </Typography>
      <Grid container spacing={7} columns={ 5 } style={{marginTop: '1rem', marginRight: "0.2rem", marginLeft: "0.2rem"}}>
        {Array.from(Array(peopleList.length)).map((_, index) => (
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
                                {peopleNameList.length > index ? 
                                <span style={{ fontWeight: 600 }}>{peopleNameList[index].firstName}</span> : 
                                <span style={{ fontWeight: 600 }}></span> }
                            </Typography>
                            <Typography>
                                {peopleList[index].loc_city.length <= 10 ?
                                 <span style={{ fontWeight: 600, fontSize: "12px" }}>{peopleList[index].loc_city}, {peopleList[index].loc_state}</span> : 
                                 <span style={{ fontWeight: 600, fontSize: "12px" }}>{peopleList[index].loc_city}</span>
                                 }
                            </Typography>
                            <Typography>
                                <span style={{ fontWeight: 600, fontSize: "12px" }}>{peopleList[index].budget}</span>
                            </Typography>
                            <Typography>
                                <span style={{ fontWeight: 600, fontSize: "12px" }}>{peopleList[index].college}</span>
                            </Typography>
                            <Typography>
                                <span style={{ fontWeight: 600, fontSize: "12px" }}>{peopleList[index].company}</span>
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