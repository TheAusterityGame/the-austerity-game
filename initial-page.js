$$.page1.className += ' active';

$(document).ready(function() { 
    $("input[name='players_count']").change(function (e) {
        window.alert("Changed to " + $(this).val());
    });
});
