const TWEET_PERIOD = 10000; // 10 seconds
var tweets = null;

function getTweetData() {    
    return tweets[0];
}

function tweet() {
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

$('#side .tweet .datetime').html(time().hhmm);

// when questions are loaded from the spreadsheet, display 3 random ones
document.addEventListener('TWEETS LOADED', function(event)
{
    tweets = event.detail;
    tweets.shuffle();
    var tweetLoopId = setInterval(tweet, TWEET_PERIOD);
});