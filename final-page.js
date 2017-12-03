document.addEventListener('PAGE DISPLAYED', function(event) {
    if (event.detail == 3) {
        $('input.proceed').click(function () {
            window.location.reload(true);
        });
        
        $('.duration').html(duration);
        var bestPolitician = undefined;
        var worstPolitician = undefined;
        for (var i = 0; i < $$.politicians.length; i++) {
            var politician = $$.politicians[i];
            var department = politician.department.name;
            politician.popularity = nameToDepartment[department].popularity;
            var vestedInterestDepartment = politician.vestedInterest.name;
            politician.lucre = 100 - nameToDepartment[vestedInterestDepartment].spending;
            if (politician.popularity >= totalPopularity) {
                politician.score = politician.lucre;
            } else {
                politician.score = politician.popularity - 1000;
            }
            if (bestPolitician == undefined) {
                bestPolitician = politician;
            } else if (politician.score > bestPolitician.score) {
                bestPolitician = politician;
            }
            if (worstPolitician == undefined) {
                worstPolitician = politician;
            } else if (politician.score < worstPolitician.score) {
                worstPolitician = politician;
            }
        }
        fillPoliticianData('.best', bestPolitician);
        if (bestPolitician == worstPolitician) {
            $('.worst').hide();
        } else {
            fillPoliticianData('.worst', worstPolitician);
        }

        $('.' + outcome()).show();        
    }
});

function fillPoliticianData(selector, politician) {
    var element = $(selector);
    element.find('img.portrait').attr('src', politicians.portrait);
    element.find('.title').html(titleFromGender(politician.gender));
    element.find('.first-name').html(politician.firstName);
    element.find('.last-name').html(politician.lastName);
    element.find('.department').html(politician.department.name);
    element.find('.vested-interest').html(politician.vestedInterest.vestedInterest);
    element.find('.vested-interest-department').html(politician.vestedInterest.name);
    element.find('.popularity').html(politician.popularity);
    element.find('.lucre').html(politician.lucre);
}