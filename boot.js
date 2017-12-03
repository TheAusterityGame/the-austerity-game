$(document).ready(function() { 
    loadData(departmentsUrl, 'DEPARTMENTS', parseDepartment);

    document.addEventListener('DEPARTMENTS LOADED', function(event) {
        departments = event.detail;

        moveToPage(1);
    });
});