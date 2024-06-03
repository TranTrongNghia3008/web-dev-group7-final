// Đóng mở modules
{
    const modulesCard = document.querySelector('.modules-card');
    const testCasesCard = document.querySelector('.test-cases-card');

    const toggleButtonModules = document.getElementById('toggleButtonModules');
    const toggleIconModules = document.getElementById('toggleIconModules');

    const toggleButtonModules2 = document.getElementById('toggleButtonModules2');
    const toggleIconModules2 = document.getElementById('toggleIconModules2');

    toggleButtonModules.addEventListener('click', function() {
        testCasesCard .classList.toggle('d-none');
        toggleButtonModules2.classList.toggle('d-none');
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



    toggleButtonModules2.addEventListener('click', function() {
        modulesCard.classList.toggle('d-none');
        if (toggleIconModules2.classList.contains('bi-chevron-compact-left')) {
        toggleIconModules2.classList.remove('bi-chevron-compact-left');
        toggleIconModules2.classList.add('bi-chevron-compact-right');
        testCasesCard.classList.add('w-100');
        }
        else {
        toggleIconModules2.classList.remove('bi-chevron-compact-right');
        toggleIconModules2.classList.add('bi-chevron-compact-left');
        testCasesCard.classList.remove('w-100');
        }
    });

}