document.addEventListener('PAGE DISPLAYED', function(event) {
    if (event.detail == 1) {        
        $('input.proceed').click(function () {            
            moveToPage(2);
        });
        $('input[name="players_count"]').change(function () {
            var playersCount = $(this).val();
            var politiciansList = $('.politicians .which');
            politiciansList.empty();
            $$.politicians = [];
            for (var i = 0; i < playersCount; i++) {
                $$.politicians[i] = {
                    gender: generateGender(i),
                    firstName: "",
                    lastName: generateLastName(i),
                    department: generateDepartment(i),
                    vestedInterest: generateVestedInterest(i)
                };
                var politician = $('.politician.template').clone();
                politician.find('.title').html($$.politicians[i].gender == 'M' ? 'Sir' : 'Madam');
                politician.find('.last-name').html($$.politicians[i].lastName);
                politician.find('.department').html($$.politicians[i].department.name);
                politician.find('.vested-interest').html($$.politicians[i].vestedInterest.vestedInterest);
                if (playersCount > 5) {
                    politician.css('font-size', '16px');
                    politician.find('input').css('font-size', '16px');
                }
                politician.appendTo(politiciansList).removeClass('template');
                politician.find('input').data('index', i).on('input', function () {
                    $$.politicians[$(this).data('index')].firstName = $(this).val();
                    var allFilled = true;
                    for (var j = 0; j < playersCount; j++) {
                        if ($$.politicians[j].firstName == "") {
                            allFilled = false;
                        }
                    }
                    $('input.proceed').prop('disabled', !allFilled);
                });
            }
        });        
    }
});

function generateGender(index) {
    var female = Math.random() < (70 / 331); // actual ratio of female to male Tory MPs
    if (female) {
        return "F";
    }
    return "M";
}

function generateLastName(index) {
    return pickRandomlyFrom([
        "McTory",
        "Wealthy",
        "Filthy-Rich",
        "Greedy",
        "Leech",
        "Vermin",
        "Vampire",
        "McEvil",        
        "Baddie",
        "Evilguy",
        "Toryman",
        "Heartless",
        "Thatcher",
        "Ruthless",
        "Weasel",
        "Scoundrel"
    ]);
}

function generateDepartment(index) {
    return departments[index];
}

function generateVestedInterest(index) {
    return pickRandomlyFrom(departments);
}

