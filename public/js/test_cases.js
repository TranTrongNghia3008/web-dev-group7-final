//Tạo cart Modules

{
    // Mảng module và số lượng test case tương ứng
  const modules = ['Contact', 'Blog', 'Pricing', 'Footer Section', 'Header Section', 'Home Page'];
  const testCaseCount = [3, 4, 5, 6, 6, 10];

  let totalTestCases = 0;

  // Duyệt qua từng phần tử trong mảng và cộng dồn vào biến totalTestCases
  for (let i = 0; i < testCaseCount.length; i++) {
      totalTestCases += testCaseCount[i];
  }

  document.getElementById('totalTestCases').textContent = totalTestCases;

  // Lặp qua mảng module để tạo các thẻ button
  const listGroup = document.querySelector('.list-modules');
  for (let i = 0; i < modules.length; i++) {
      // Tạo thẻ button
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'list-group-item list-group-item-action border-0';

      // Tạo icon
      const icon = document.createElement('i');
      icon.className = 'bi bi-folder2 me-2';
      button.appendChild(icon);

      // Thêm tên module
      const spanModule = document.createElement('span');
      spanModule.className = 'me-2';
      spanModule.textContent = modules[i];
      button.appendChild(spanModule);

      // Thêm số lượng test case
      const spanCount = document.createElement('span');
      spanCount.className = 'num';
      spanCount.textContent = '(' + testCaseCount[i] + ')';
      button.appendChild(spanCount);

      // Tạo tooltip cho hình ảnh total test cases
      const tooltipTotalTestCases = document.createElement('a');
      tooltipTotalTestCases.href = '#';
      tooltipTotalTestCases.setAttribute('data-bs-toggle', 'tooltip');
      tooltipTotalTestCases.title = 'Click to know Total Test Cases';
      tooltipTotalTestCases.style.margin = '0 1rem';
      const imgTotalTestCases = document.createElement('img');
      imgTotalTestCases.src = '../assets/images/total-test-cases.png';
      imgTotalTestCases.alt = '';
      imgTotalTestCases.style.width = '1rem';
      imgTotalTestCases.style.height = '1rem';
      tooltipTotalTestCases.appendChild(imgTotalTestCases);
      button.appendChild(tooltipTotalTestCases);

      // Tạo tooltip cho hình ảnh add
      const tooltipAdd = document.createElement('a');
      tooltipAdd.href = '#';
      tooltipAdd.setAttribute('data-bs-toggle', 'tooltip');
      tooltipAdd.title = 'Click here to add Newly created Test cases to the Test run';
      const imgAdd = document.createElement('img');
      imgAdd.src = '../assets/images/add.svg';
      imgAdd.alt = '';
      imgAdd.style.width = '1rem';
      imgAdd.style.height = '1rem';
      tooltipAdd.appendChild(imgAdd);
      button.appendChild(tooltipAdd);

      // Thêm button vào list-group
      listGroup.appendChild(button);
  }

  const buttons = document.querySelectorAll('.list-group-item');
  const allTestCaseButton = document.querySelector('.all-test-case');

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        buttons.forEach(btn => btn.classList.remove('text-danger'));
        button.classList.add('text-danger');
      });
    });

    allTestCaseButton.addEventListener('click', () => {
      buttons.forEach(btn => btn.classList.remove('text-danger'));
    });
}
  
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