const OAuth = require('oauth')
const got = require('got')
const { promisify } = require('util')



getTwitterUserProfileWithOAuth2('elcorteingles')
    .then((profile) => 
      showResult(profile)
    )
    .catch(err => console.error(err) && process.exit(1))

async function getTwitterUserProfileWithOAuth2 (username = 'elcorteingles') {
  var oauth2 = new OAuth.OAuth2(
    "8AwdDjAbUCw5FtYG1YrVLvi3o",
    "pYOwSP8vWzxDP4iHsciu7twwOw8HFSEL560J4LOsxjTYnxATon",
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

async function showResult(result){
  console.log('Followers el corte ingles', result.followers_count);
  process.exit(0);
}