const blossom = require('edmonds-blossom')

export const prefWeights = {
  'location': 0.08771929824561403,
  'price': 0.2631578947368421,
  'personality': 0.2631578947368421,
  'hobbies': 0.008771929824561403,
  'clean': 0.2982456140350877,
  'schedule': 0.05263157894736842,
  'college': 0.02631578947
}

function getScore(userPrefs, p) {
  let score = 0
  // location
  score += (
    userPrefs["loc_city"] == p.loc_city ? 1 : 0
  ) *  prefWeights["location"]
  // price
  score += (
    userPrefs["budget"] == p.budget ? 1 : 0 +
    userPrefs["shared_room"] == p.shared_room ? 1 : 0
  ) *  prefWeights.price * 0.5
  // personality
  score += (
    userPrefs["alcohol"] == p.alcohol ? 1 : 0 +
    userPrefs["cigarettes"] == p.cigarettes ?  1 : 0 +
    userPrefs["drugs"] == p.drugs ?  1 : 0 +
    userPrefs["social"] == p.social ?  1 : 0 +
    userPrefs["weed"] == p.weed ?  1 : 0
  ) *  prefWeights.personality * (1 / 5)
  // hobbies
  const hobbyIntersection = userPrefs["hobb"].filter(h => p.hobb.includes(h))
  score += (
    hobbyIntersection.length
  ) *  prefWeights.hobbies * (1 / 3)
  // clean
  score += (
    userPrefs["cleanliness"] == p.cleanliness ? 1 : 0 +
    userPrefs["atmosphere"] == p.atmosphere ?  1 : 0 +
    userPrefs["common_space"] == p.common_space ?  1 : 0 +
    userPrefs["common_space_things"] == p.common_space_things ?  1 : 0 +
    userPrefs["dishes"] == p.dishes ?  1 : 0 +
    userPrefs["leftovers"] == p.leftovers ?  1 : 0 + 
    userPrefs["parties"] == p.parties ?  1 : 0 +
    userPrefs["social"] == p.social ?  1 : 0 +
    userPrefs["trash"] == p.trash ?  1 : 0 + 
    userPrefs["weed_apartment"] == p.weed_apartment ?  1 : 0
  ) *  prefWeights.clean * (1 / 10)
  // schedule
  score += (
    userPrefs["bathroom"] == p.bathroom ? 1 : 0 +
    Math.abs(userPrefs["bedtime"] - p.bedtime) < 3 ?  1 : 0 +
    Math.abs(userPrefs["wakeuptime"] - p.wakeuptime) < 3 ? 1 : 0
  ) *  prefWeights.schedule * (1 / 3)
  // college
  score += (
    userPrefs["college"] == p.college ? 1 : 0 + 
	userPrefs["company"] == p.company ? 1 : 0
  ) *  prefWeights.college * (1 / 2)
  score *= 1000
  return score | 0
}

/**
 * sort the people 
 * @param user
 * @param userPrefs
 * @param ppl  list of people attributes
 * @returns orderedList
 */
export function sortMatches(user, userPrefs, match1, ppl) {
    const matchList = []
    ppl.forEach(function (p) {
      if (p.loc_state == userPrefs.loc_state && p.username != user.username && p.username != match1?.username) {
        matchList.push(p)
      }
    })
    const orderedList = matchList.sort((p) => getScore(userPrefs, p))
    return orderedList
}

  /**
 * match users 
 * @param user
 * @param userPrefs
 * @param ppl  list of people attributes
 * @returns match corresponding to user
 */
export function getFeaturedMatch(user, userPrefs, ppl) {
  const everyone = []
  ppl.forEach(function (p) {
	if (p.loc_state == userPrefs.loc_state) {
		everyone.push(p)
	}
  })
  let data = [...Array(everyone.length)].map(e => Array(everyone.length));

  let i = 0, j = 0, me = 0
  for (let p1 of everyone) {
	if (p1.username == user.username) {
		me = i
	}
	for (let p2 of everyone) {
		// blossom is weird if we use actual scores??
		data[i][j] = j // getScore(p1, p2) + (j / i)
		j += 1
	}
	j = 0
	i += 1
  }

  const results = blossom(data)
  if (results[me] == -1) {
	return null
  }
  return everyone[results[me]]
}