// TODO: Audrey
/*
Basic Matching Algorithm (let's call the person filling out x)
Step 1) Find individuals who agree on city with x.
Step 2) From those individuals only filter individuals who have the same rent Range, one rent range below and one rent range above.
Give 10 points to same rent range, 0 points to the one below or above.
Step 3: For each of the following assign the following points structure:
- college: if the same 5 points, if different 0.
- company: if the same 5 points, if different 0. 
- cleanliness: if exactly the same 5 points if different subtract difference amount of points (for example rating 1 and 3, we would subtract 3, so give 2 points)
- weed: 5 if agree, 0 if disagree
- alcohol: 5 if agree, 0 if disagree
- drugs: 5 if agree, 0 if disagree
- use the same schema for the rest of them 5 points if agree 0 if disagree on the yes no questions or subtract the difference of points from 5.
Finally: display percentage match of the people sorted in decreasing order.
*/