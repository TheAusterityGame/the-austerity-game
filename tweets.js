const TWEET_PERIOD = 2000; // 10 seconds
const TWEET_FRESHNESS_FACTOR = 3; // check 3 random tweets each time and get the least displayed one
var tweets = null;

function getTweetData() {
    var leastDisplayed = { displayed: Infinity };
    for (var i = 0; i < TWEET_FRESHNESS_FACTOR; i++) {
        do {
            var candidate = pickRandomlyFrom(tweets);
        } while (!isTweetOk(candidate));
        if (candidate.displayed < leastDisplayed.displayed) {
            leastDisplayed = candidate;
        }
    }
    leastDisplayed.displayed++;
    return leastDisplayed;
}

function isTweetOk(tweet) {
    var department = tweet.department;    
    if (department == undefined) { // generic tweet
        var popularity = totalPopularity;
    } else {        
        var popularity = nameToDepartment[department].popularity;
    }
    var popular = (popularity > 50);   
    if (popular == tweet.complaint) { // mood mismatch
        return false;
    }
    if (popular) {
        return (Math.random() * 100 < popularity); // the more it's popular, the more it's OK
    } else {
        return (Math.random() * 100 > popularity); // the less it's popular, the more it's OK
    }
}

function tweetLoop() {
    var newTweet = $('#side .tweet:first-child').clone();
    var tweetData = getTweetData();
    newTweet.find('.datetime').html(time().hhmm);
    newTweet.find('.username').html(tweetData.username);
    newTweet.find('.content').html(tweetData.content);
    newTweet.prependTo('#side');
    setTimeout(function() {
        newTweet.remove();
    }, TWEET_PERIOD * 10);
}

// when questions are loaded from the spreadsheet, display 3 random ones
document.addEventListener('TWEETS LOADED', function(event)
{
    tweets = event.detail;
    tweets.shuffle();
    var tweetLoopId = setInterval(tweetLoop, TWEET_PERIOD);
    document.addEventListener('PAGE DISPLAYED', function(event) {
        if (event.detail != 2) {
            clearInterval(tweetLoopId);
        }
    });
});

document.addEventListener('PAGE DISPLAYED', function(event) {
    if (event.detail == 2) {
        $('#side .tweet .datetime').html(time().hhmm);
        loadData(tweetsUrl, 'TWEETS', parseTweet);
    }
});