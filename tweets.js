const TWEET_PERIOD = 10000; // 10 seconds

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
var tweetLoopId = setInterval(tweet, TWEET_PERIOD);

function getTweetData() {
    return {
        username: '@maurovanetti',
        content: 'Test test test lorem ipsum yeah yeah. <b>#test</b>'
    }
}