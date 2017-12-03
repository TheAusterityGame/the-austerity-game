var greenLights = 0;

$(document).ready(function() { 
    loadData(departmentsUrl, 'DEPARTMENTS', parseDepartment);
    loadData(surnamesUrl, 'SURNAMES', parseSurname);
    document.addEventListener('DEPARTMENTS LOADED', function(event) {
        departments = event.detail;
        greenLights++;
        if (greenLights >= 2) {
            moveToPage(1);
        }
    });
    document.addEventListener('SURNAMES LOADED', function(event) {
        surnames = event.detail;
        greenLights++;
        if (greenLights >= 2) {
            moveToPage(1);
        }
    });
});