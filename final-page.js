$$.page1.className += ' active';

$(document).ready(function() { 

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

    $('input.proceed').click(function () {
        alert("Move to page 2");
    });
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

const DEPARTMENTS = [
    { name: "Healthcare", vestedInterest: "a private hospital" },
    { name: "Education", vestedInterest: "a posh private school" },
    { name: "Housing", vestedInterest: "a real-estate company" },
    { name: "Transport", vestedInterest: "a private taxi fleet" },
    { name: "Sanitation", vestedInterest: "a company running an incinerator facility" },
    { name: "Recreation and Parklands", vestedInterest: "a popular fitness centre chain" },
    { name: "Museums and Libraries", vestedInterest: "a multiplex cinema" }
];

function generateDepartment(index) {
    return DEPARTMENTS[index];
}

function generateVestedInterest(index) {
    return pickRandomlyFrom(DEPARTMENTS);
}

function pickRandomlyFrom(array) {
    return array[Math.floor(Math.random() * array.length)];
}