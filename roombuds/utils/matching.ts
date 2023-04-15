export const prefWeights = {
  'location': 0.08771929824561403,
  'price': 0.2631578947368421,
  'personality': 0.2631578947368421,
  'hobbies': 0.008771929824561403,
  'clean': 0.2982456140350877,
  'schedule': 0.05263157894736842,
  'college': 0.02631578947
}

/**
 * sort the people 
 * @param user
 * @param ppl	list of people attributes
 * @returns orderedList
 */
export function sortMatches(user, userPrefs, ppl) {
    const matchList = []
    ppl.forEach(function (p) {
      if (p.loc_state == userPrefs.loc_state && p.username != user.username) {
        matchList.push(p)
      }
    })
    const orderedList = matchList.sort((p) => {
      let score = 0
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
	  return score
    })
    return orderedList
  }