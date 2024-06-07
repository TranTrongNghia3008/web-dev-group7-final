// Đóng mở modules
{
    const modulesCard = document.querySelector('.modules-card');
    const testCasesCard = document.querySelector('.test-cases-card');

    const toggleButtonModules = document.getElementById('toggleButtonModules');
    const toggleIconModules = document.getElementById('toggleIconModules');

    const toggleButtonModulesRequirement = document.getElementById('toggleButtonModulesRequirement');
    const toggleIconModulesRequirement = document.getElementById('toggleIconModulesRequirement');

    toggleButtonModules.addEventListener('click', function() {
        testCasesCard .classList.toggle('d-none');
        toggleButtonModulesRequirement.classList.toggle('d-none');
        if (toggleIconModules.classList.contains('bi-arrow-right')) {
        toggleIconModules.classList.remove('bi-arrow-right');
        toggleIconModules.classList.add('bi-arrow-left');
        modulesCard.classList.add('w-100');
        }
        else {
        toggleIconModules.classList.remove('bi-arrow-left');
        toggleIconModules.classList.add('bi-arrow-right');
        modulesCard.classList.remove('w-100');
        }
    });



    toggleButtonModulesRequirement.addEventListener('click', function() {
        modulesCard.classList.toggle('d-none');
        if (toggleIconModulesRequirement.classList.contains('bi-chevron-compact-left')) {
        toggleIconModulesRequirement.classList.remove('bi-chevron-compact-left');
        toggleIconModulesRequirement.classList.add('bi-chevron-compact-right');
        testCasesCard.classList.add('w-100');
        }
        else {
        toggleIconModulesRequirement.classList.remove('bi-chevron-compact-right');
        toggleIconModulesRequirement.classList.add('bi-chevron-compact-left');
        testCasesCard.classList.remove('w-100');
        }
    });

}


function toggleCheckAllRequirement(source) {
    var checkboxes = document.querySelectorAll('.code-requirement-item');
    checkboxes.forEach(function(checkbox) {
        if (checkbox !== source) {
            checkbox.checked = source.checked;
        }
    });
  }