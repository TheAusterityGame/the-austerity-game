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
                    vestedInterest: generateVestedInterest(i),
                    portrait: 'img/portrait_' + i + '.PNG'
                };
                var politician = $('.politician.template').clone();
                politician.find('img.portrait').attr('src', $$.politicians[i].portrait);
                politician.find('.title').html(titleFromGender($$.politicians[i].gender));
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

function titleFromGender(gender) {
    return gender == 'M' ? 'Sir' : 'Madam';
}

function generateGender(index) {
    var female = Math.random() < (70 / 331); // actual ratio of female to male Tory MPs
    if (female) {
        return "F";
    }
    return "M";
}

function generateLastName(index) {
    return pickRandomlyFrom(surnames).surname;
}

function generateDepartment(index) {
    return departments[index];
}

function generateVestedInterest(index) {
    return pickRandomlyFrom(departments);
}

function politicianInChargeOf(departmentName) {
    for (var i = 0; i < $$.politicians.length; i++) {
        var politician = $$.politicians[i];
        if (departmentName == politician.department.name) {
            return politician.firstName + ' ' + politician.lastName;
        }
    }
    return "the head of " + departmentName + " Department";
}
