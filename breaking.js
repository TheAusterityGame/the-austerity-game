

function publishBreakingNews(message) {
    var scrollingNews = $('#breaking_news_text .scroll');
    while (message.length < 100) {
        message += '    ';
    }
    message.replace(/ /g, '&nbsp;');
    console.log('BREAKING: «' + message + '»');
    scrollingNews.fadeOut( "slow", function() {
        scrollingNews.html(message);
        scrollingNews.fadeIn();
    });    
}