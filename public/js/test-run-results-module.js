//Vẽ biểu đồ Project Status, Issue Status
{
  const projectStatus = ['Passed', 'Untested', 'Blocked', 'Retest', 'Failed', 'Not Applicable', 'In Progress', 'Hold'];
  const numProjectStatus = [1, 32, 0, 0, 1, 0, 0, 0];
  const barColorsProjectStatus = [
  "rgb(92, 184, 92)",
  "rgb(70, 191, 189)",
  "rgb(77, 83, 96)",
  "rgb(253, 180, 92)",
  "rgb(247, 70, 74)",
  "rgb(147, 119, 85)",
  "rgb(87, 147, 243)",
  "rgb(23, 162, 184)"

  ];

  new Chart("chartProjectStatus", {
  type: "doughnut",
  data: {
      labels: projectStatus,
      datasets: [{
      backgroundColor: barColorsProjectStatus,
      data: numProjectStatus
      }]
  },
  options: {
      legend: {
          display: false // Ẩn chú thích
      },
      elements: {
          arc: {
              borderWidth: 2, // Độ rộng của viền
              borderColor: '#ffffff', // Màu sắc của viền
              shadowColor: '#000000', // Màu sắc của đổ bóng
              shadowBlur: 20 // Độ mờ của đổ bóng
          }
      }
  }
  });


  function statusCaption(containerClass, ArrStatus, ArrNumStatus) {
    const container = document.querySelector(containerClass);
    if (!container) {
        console.error("Container not found!");
        return;
    }

  


    // Duyệt qua mỗi phần tử trong mảng trạng thái dự án
    ArrStatus.forEach((status, index) => {
        // Tạo phần tử div
        const div = document.createElement('div');
        div.classList.add('col', 'mx-2', 'mb-2');
        const div2 = document.createElement('div');
        
        // Tạo phần tử chứa số lượng
        const countSpan = document.createElement('span');
        countSpan.classList.add('status-num');
        countSpan.textContent = ArrNumStatus[index] + ' ';
        
        // Tạo phần tử chứa hình tròn
        const circleDiv = document.createElement('div');
        circleDiv.classList.add('rounded-circle', 'd-inline-flex', `status-${status.toLowerCase().replace(' ', '-')}`);
        circleDiv.style.width = '7px';
        circleDiv.style.height = '7px';
        
        // Tạo phần tử chứa tên trạng thái
        const statusSpan = document.createElement('span');
        statusSpan.classList.add('status');
        statusSpan.textContent = status;
        
        // Gắn các phần tử vào div
        div2.appendChild(countSpan);
        div2.appendChild(circleDiv);
        div.appendChild(div2);
        div.appendChild(statusSpan);
        
        // Gắn div vào container
        container.appendChild(div);
    });
  }
  statusCaption('.project-status-container', projectStatus, numProjectStatus);

  projectStatusContainer = document.querySelector('.project-status-container');
  const divExportStatus = document.createElement('div');
  divExportStatus.classList.add('col', 'mx-2', 'mb-2', 'my-auto');
  const btnExportStatus = document.createElement('button');
  btnExportStatus.classList.add('btn-export-status','btn', 'btn-danger');
  btnExportStatus.textContent = 'Export Status';
  btnExportStatus.style.width = '10rem';
  divExportStatus.appendChild(btnExportStatus);
  projectStatusContainer.appendChild(divExportStatus);




  const issueStatus = ['New', 'Assigned', 'Open', 'Fixed', 'Retest', 'Verified', 'Reopen', 'Closed', 'Duplicate', 'Invalid', 'Deferred'];
  var numIssueStatus = [1, 4, 6, 8, 1, 3, 1, 8, 2, 2, 4]; // Số lượng vấn đề cho mỗi trạng thái
  const barColorsIssueStatus = [
      "#3498db", // New - Xanh dương
      "#9b59b6", // Assigned - Tím
      "#f1c40f", // Open - Vàng
      "#2ecc71", // Fixed - Xanh lá cây
      "#e74c3c", // Retest - Đỏ
      "#27ae60", // Verified - Xanh lá cây đậm
      "#e67e22", // Reopen - Cam
      "#34495e", // Closed - Xám
      "#95a5a6", // Duplicate - Xám nhạt
      "#e74c3c", // Invalid - Đỏ
      "#e67e22"  // Deferred - Cam
  ]; 

  
  new Chart("chartIssueStatus", {
  type: "doughnut",
  data: {
      labels: issueStatus,
      datasets: [{
      backgroundColor: barColorsIssueStatus,
      data: numIssueStatus
      }]
  },
  options: {
      legend: {
          display: false // Ẩn chú thích
      },
      elements: {
          arc: {
              borderWidth: 2, // Độ rộng của viền
              borderColor: '#ffffff', // Màu sắc của viền
              shadowColor: '#000000', // Màu sắc của đổ bóng
              shadowBlur: 20 // Độ mờ của đổ bóng
          }
      }
  }
  });

  statusCaption('.issue-status-container', issueStatus, numIssueStatus);

}

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

//Tạo dropdown cho status
{
  function setStatus(status, color) {
    var selectedStatusButton = document.getElementById('dropdownMenuButton');
    
    selectedStatusButton.style.borderLeftColor = color;

    var selectedStatus = document.getElementById('dropdownMenuButtonText');
    selectedStatus.textContent = status;
  }

  function toggleCheckAll(source) {
    var checkboxes = document.querySelectorAll('.case-code-item');
    checkboxes.forEach(function(checkbox) {
        if (checkbox !== source) {
            checkbox.checked = source.checked;
        }
    });
  }
}


//Đóng mở biểu đồ
{
  // Get the elements
  const belowContent = document.querySelector('.below-chart');
  const toggleButton = document.getElementById('toggleButton');
  const toggleIcon = document.getElementById('toggleIcon');

  // Add event listener to toggle button
  toggleButton.addEventListener('click', function() {
    console.log("hello");
      // Toggle visibility of below content
      belowContent.classList.toggle('d-none');
      
      // Toggle chevron icon
      if (toggleIcon.classList.contains('bi-chevron-up')) {
          toggleIcon.classList.remove('bi-chevron-up');
          toggleIcon.classList.add('bi-chevron-down');
      } else {
          toggleIcon.classList.remove('bi-chevron-down');
          toggleIcon.classList.add('bi-chevron-up');
      }
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