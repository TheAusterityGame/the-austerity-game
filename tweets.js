const TWEET_PERIOD = 2000 // milliseconds
const TWEET_FRESHNESS_FACTOR = 5 // check some random tweets each time and get the least displayed one
var tweets = null

function getTweet()
{
  // organise the tweets by how much they've been displayed already
  var leastDisplayed = { displayed: Infinity }
  for (var i = 0; i < TWEET_FRESHNESS_FACTOR; i++)
  {
    var tweet = pickRandomlyFrom(tweets) // let's start with a random tweet
    // we'll then try to make pick semi-random tweets, until we get one that is appropriate
    var count = 0
    while (!isTweetAppropriate(tweet) && count<tweets.length)
    {
      tweet = pickRandomlyFrom(tweets)
      count ++
    }

    // check if this tweet has been displayed less than the currently least diplayed
    if (tweet.displayed < leastDisplayed.displayed) leastDisplayed = tweet
  }
  leastDisplayed.displayed++
  return leastDisplayed
}

function isTweetAppropriate(tweet)
{
  var department = tweet.department,
      popularity = totalPopularity // if the tweet is not directed to a specific department, we'll default to the general popularity

  // if the tweet is about a certain department, then we can use that department's popularity
  if (department != undefined) popularity = nameToDepartment[department].popularity

  // define if the politician/administration is popular (>50)
  var isPopular = (popularity > 50)

  // if the politician/administration is popular BUT the tweet is a complaint
  // or viceversa
  // the tweet is not appropriate
  if (isPopular == tweet.complaint) return false

  if (isPopular)
  {
    // the more the politician/administration is popular, the more the tweet is appropriate
    return (Math.random() * 100 < popularity)
  }
  else
  {
    // the less the politician/administration is popular, the more the tweet is appropriate
    return (Math.random() * 100 > popularity)
  }
}

function tweetLoop()
{
    var $tweet = $('#side .tweet:first-child').clone()
    var tweet = getTweet(),
        department = tweet.department

    $tweet.find('.datetime').html(getTime().randomised)
    $tweet.find('.username').html('@' + tweet.username)

    var replaceWith = (department) ? politicianInChargeOf(department) : 'Council'
    // check if the tweet contains placeholders
    var politicianCatcher = /({{politician}})+/gim // regular expression
    // eg: "Everyone needs to know what {{politician}} is doing. Welfare negligence has gone too far"
    var tweetContent = tweet.content.replace(politicianCatcher, replaceWith)

    $tweet.find('.content').html(tweetContent)
    $tweet.prependTo('#side')
    setTimeout(function() {
        $tweet.remove()
    }, TWEET_PERIOD * 10)
}

// when questions are loaded from the spreadsheet, display 3 random ones
document.addEventListener('TWEETS LOADED', function(event)
{
  tweets = event.detail
  tweets.shuffle()
  var tweetLoopId = setInterval(tweetLoop, TWEET_PERIOD)
  document.addEventListener('PAGE DISPLAYED', function(event)
  {
    if (event.detail != 2)
    {
      clearInterval(tweetLoopId)
    }
  })
})

document.addEventListener('PAGE DISPLAYED', function(event)
{
  if (event.detail == 2)
  {
    $('#side .tweet .datetime').html(getTime().randomised)
    loadData(tweetsUrl, 'TWEETS', parseTweet)
  }
})
