const OAuth = require('oauth')
const got = require('got')
const {promisify} = require('util')
const firebase = require("firebase");


var firebaseConfig = {
  apiKey: process.env['FIREBASE_API_KEY'],
  authDomain: "twitterfollowercountertracker2.firebaseapp.com",
  databaseURL: "https://twitterfollowercountertracker2.firebaseio.com",
  projectId: "twitterfollowercountertracker2",
  storageBucket: "twitterfollowercountertracker2.appspot.com",
  messagingSenderId: "978600642574",
  appId: "1:978600642574:web:e02cd7a2839e83320d945f"
};

firebase.initializeApp(firebaseConfig);


getTwitterUserProfileWithOAuth2('elcorteingles')
  .then((profile) => showFollowersResult(profile) )
  .catch(err => console.error(err) && process.exit(1))


async function getTwitterUserProfileWithOAuth2 (username = 'elcorteingles') {
  var oauth2 = new OAuth.OAuth2(
    process.env['TWITTER_KEY'],
    process.env['TWITTER_SECRET'],
    'https://api.twitter.com/', null, 'oauth2/token', null
  )
  const getOAuthAccessToken = promisify(oauth2.getOAuthAccessToken.bind(oauth2))
  const accessToken = await getOAuthAccessToken('', { grant_type: 'client_credentials' })

  return got(`https://api.twitter.com/1.1/users/show.json?screen_name=${username}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
    .then((res) => JSON.parse(res.body))
}

async function showFollowersResult(result){

  const fireBaseRegister = {
    "twitter_id":  result.id,
    "followers":   result.followers_count,
    "twitter_name": "elcorteingles",
    "data_date": Date.now()
  }
  
  const database = firebase.database();
  let dataRef = database.ref('measures');
  let dataPush = await dataRef.push(fireBaseRegister); 

  console.log(fireBaseRegister);
}
