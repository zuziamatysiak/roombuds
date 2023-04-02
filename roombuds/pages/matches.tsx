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

const MatchPage = () => {
  // NOTE: only added company and school search as the rest should be based on the matching algorithm 
  const [companyInput, setCompanyInput] = useState('')
  const [collegeInput, setCollegeInput] = useState('')
  const [user] = useUser()
  const [userPrefs, setUserPrefs] = useState<any>({})
  const myLoader = ({ src, width, quality }) => {
    return src + '/${src}?w=${width}&q=${quality || 75}'
  }

  const prefWeights = {
    'location': 0.08771929824561403,
    'price': 0.2631578947368421,
    'personality': 0.2631578947368421,
    'hobbies': 0.008771929824561403,
    'clean': 0.2982456140350877,
    'schedule': 0.05263157894736842,
    'college': 0.02631578947
  }

  async function filterMatches() {
    var matchList = []
    peopleList.forEach(function (p) {
      if (p.loc_state == userPrefs.loc_state) {
        matchList.push(p)
      }
    })
	console.log(userPrefs)
	console.log(peopleList)
	const orderedList = matchList.sort((p) => {
      let score = 0;
      // location
      score += (
        userPrefs["loc_city"] == p.loc_city ? 1 : 0
	  ) *  prefWeights["location"]
      // price
	  score += (
		userPrefs["budget"] == p.budget ? 1 : 0 +
		userPrefs["shared_room"] == p.shared_room ? 1 : 0
	  ) *  prefWeights.price
	  // personality
	  score += (
		userPrefs["alcohol"] == p.alcohol ? 1 : 0 +
		userPrefs["cigarettes"] == p.cigarettes ?  1 : 0 +
		userPrefs["drugs"] == p.drugs ?  1 : 0 +
		userPrefs["social"] == p.social ?  1 : 0 +
		userPrefs["weed"] == p.weed ?  1 : 0
	  ) *  prefWeights.personality
	  // hobbies
	  score += (
		userPrefs["hobbies"] == p.hobbies ? 1 : 0
	  ) *  prefWeights.hobbies
	  // clean
	  score += (
		userPrefs["cleanliness"] == p.cleanliness ? 1 : 0 +
		userPrefs["atmosphere"] == p.atmosphere ?  1 : 0 +
		userPrefs["common_space"] == p.common_space ?  1 : 0 +
		userPrefs["common_space_things"] == p.common_space_things ?  1 : 0 +
		userPrefs["company"] == p.company ?  1 : 0 +
		userPrefs["atmosphere"] == p.atmosphere ?  1 : 0 +
		userPrefs["dishes"] == p.dishes ?  1 : 0 +
		userPrefs["leftovers"] == p.leftovers ?  1 : 0 + 
		userPrefs["parties"] == p.parties ?  1 : 0 +
		userPrefs["social"] == p.social ?  1 : 0 +
		userPrefs["trash"] == p.trash ?  1 : 0 + 
		userPrefs["weed_apartment"] == p.weed_apartment ?  1 : 0
	  ) *  prefWeights.clean
	  // schedule
	  score += (
		userPrefs["bathroom"] == p.bathroom ? 1 : 0 +
		userPrefs["bedtime"] == p.bedtime ?  1 : 0 +
		userPrefs["wakeuptime"] == p.wakeuptime ? 1 : 0
	  ) *  prefWeights.schedule
	  // college
	  score += (
		userPrefs["college"] == p.college ? 1 : 0
	  ) *  prefWeights.college
	  console.log(p)
	  console.log(score)
      return score
    })
	console.log(orderedList)
	setPeopleList(orderedList)
  }

  // TODO: add error checking
  const [peopleList, setPeopleList] = useState([])
  const [originalList, setOrginalList] = useState([])
  useEffect(() => {
    async function getPeople() {
	  try {
		const response = await get('email', user.email, USER_PREFERENCES_TABLE)
		if (response.success) {
		  setUserPrefs(response.data)
		  try {
			const people = await mergeTables(
			  USER_PREFERENCES_TABLE,
			  USER_TABLE,
			  USER_PROFILE_PICTURES
			)
			setPeopleList(people)
			console.log(peopleList)
			filterMatches()
		  } catch (e) {
			console.error(e)
		  }
		}
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
          Your roommate matches
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