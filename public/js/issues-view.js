 // Lắng nghe sự kiện khi checkbox thay đổi
 const categoryCheckboxes = document.querySelectorAll('.category-checkbox');
 categoryCheckboxes.forEach(function(checkbox) {
     checkbox.addEventListener('change', function() {
         // Đếm số checkbox đã được chọn
         const numSelected = document.querySelectorAll('.category-checkbox:checked').length;
         // Cập nhật số lượng num-category
         document.querySelector('.num-category').textContent = numSelected;
     });
 });

 const statusCheckboxes = document.querySelectorAll('.status-checkbox');
 statusCheckboxes.forEach(function(checkbox) {
     checkbox.addEventListener('change', function() {
         // Đếm số checkbox đã được chọn
         const numSelected = document.querySelectorAll('.status-checkbox:checked').length;
         // Cập nhật số lượng num-category
         document.querySelector('.num-status').textContent = numSelected;
     });
 });

 const priorityCheckboxes = document.querySelectorAll('.priority-checkbox');
 priorityCheckboxes.forEach(function(checkbox) {
     checkbox.addEventListener('change', function() {
         // Đếm số checkbox đã được chọn
         const numSelected = document.querySelectorAll('.priority-checkbox:checked').length;
         // Cập nhật số lượng num-category
         document.querySelector('.num-priority').textContent = numSelected;
     });
 });

 const bugTypeCheckboxes = document.querySelectorAll('.bug-type-checkbox');
 bugTypeCheckboxes.forEach(function(checkbox) {
     checkbox.addEventListener('change', function() {
         // Đếm số checkbox đã được chọn
         const numSelected = document.querySelectorAll('.bug-type-checkbox:checked').length;
         // Cập nhật số lượng num-category
         document.querySelector('.num-bug-type').textContent = numSelected;
     });
 });

 const operatingSystemsCheckboxes = document.querySelectorAll('.operating-systems-checkbox');
 operatingSystemsCheckboxes.forEach(function(checkbox) {
     checkbox.addEventListener('change', function() {
         // Đếm số checkbox đã được chọn
         const numSelected = document.querySelectorAll('.operating-systems-checkbox:checked').length;
         // Cập nhật số lượng num-category
         document.querySelector('.num-operating-systems').textContent = numSelected;
     });
 });

 const assigneeCheckboxes = document.querySelectorAll('.assignee-checkbox');
 assigneeCheckboxes.forEach(function(checkbox) {
     checkbox.addEventListener('change', function() {
         // Đếm số checkbox đã được chọn
         const numSelected = document.querySelectorAll('.assignee-checkbox:checked').length;
         // Cập nhật số lượng num-category
         document.querySelector('.num-assignee').textContent = numSelected;
     });
 });

 const createdByCheckboxes = document.querySelectorAll('.created-by-checkbox');
 createdByCheckboxes.forEach(function(checkbox) {
     checkbox.addEventListener('change', function() {
         // Đếm số checkbox đã được chọn
         const numSelected = document.querySelectorAll('.created-by-checkbox:checked').length;
         // Cập nhật số lượng num-category
         document.querySelector('.num-created-by').textContent = numSelected;
     });
 })

 const environmentCheckboxes = document.querySelectorAll('.environment-checkbox');
 environmentCheckboxes.forEach(function(checkbox) {
     checkbox.addEventListener('change', function() {
         // Đếm số checkbox đã được chọn
         const numSelected = document.querySelectorAll('.environment-checkbox:checked').length;
         // Cập nhật số lượng num-category
         document.querySelector('.num-environment').textContent = numSelected;
     });
 });

 const releaseCheckboxes = document.querySelectorAll('.release-checkbox');
 releaseCheckboxes.forEach(function(checkbox) {
     checkbox.addEventListener('change', function() {
         // Đếm số checkbox đã được chọn
         const numSelected = document.querySelectorAll('.release-checkbox:checked').length;
         // Cập nhật số lượng num-category
         document.querySelector('.num-release').textContent = numSelected;
     });
 });

 const moduleCheckboxes = document.querySelectorAll('.module-checkbox');
 moduleCheckboxes.forEach(function(checkbox) {
     checkbox.addEventListener('change', function() {
         // Đếm số checkbox đã được chọn
         const numSelected = document.querySelectorAll('.module-checkbox:checked').length;
         // Cập nhật số lượng num-category
         document.querySelector('.num-module').textContent = numSelected;
     });
 });


 // Lắng nghe sự kiện click cho nút "Clear"
 const clearButton = document.querySelector('.btn-clear');
 clearButton.addEventListener('click', function() {
    
     // Xóa các checkbox được chọn trong mỗi danh sách filter
     const categoryCheckboxes = document.querySelectorAll('.category-checkbox:checked');
     categoryCheckboxes.forEach(function(checkbox) {
         checkbox.checked = false;
     });

     const statusCheckboxes = document.querySelectorAll('.status-checkbox:checked');
     statusCheckboxes.forEach(function(checkbox) {
         checkbox.checked = false;
     });

     const priorityCheckboxes = document.querySelectorAll('.priority-checkbox:checked');
     priorityCheckboxes.forEach(function(checkbox) {
         checkbox.checked = false;
     });

     const bugTypeCheckboxes = document.querySelectorAll('.bug-type-checkbox:checked');
     bugTypeCheckboxes.forEach(function(checkbox) {
         checkbox.checked = false;
     });

     const operatingSystemsCheckboxes = document.querySelectorAll('.operating-systems-checkbox:checked');
     operatingSystemsCheckboxes.forEach(function(checkbox) {
         checkbox.checked = false;
     });

     const assigneeCheckboxes = document.querySelectorAll('.assignee-checkbox:checked');
     assigneeCheckboxes.forEach(function(checkbox) {
         checkbox.checked = false;
     });

     const createdByCheckboxes = document.querySelectorAll('.created-by-checkbox:checked');
     createdByCheckboxes.forEach(function(checkbox) {
         checkbox.checked = false;
     });

     const environmentCheckboxes = document.querySelectorAll('.environment-checkbox:checked');
     environmentCheckboxes.forEach(function(checkbox) {
         checkbox.checked = false;
     });

     const releaseCheckboxes = document.querySelectorAll('.release-checkbox:checked');
     releaseCheckboxes.forEach(function(checkbox) {
         checkbox.checked = false;
     });

     const moduleCheckboxes = document.querySelectorAll('.module-checkbox:checked');
     moduleCheckboxes.forEach(function(checkbox) {
         checkbox.checked = false;
     });

     // Đặt lại số lượng các filter về 0
     document.querySelector('.num-category').textContent = '0';
     document.querySelector('.num-status').textContent = '0';
     document.querySelector('.num-priority').textContent = '0';
     document.querySelector('.num-bug-type').textContent = '0';
     document.querySelector('.num-operating-systems').textContent = '0';
     document.querySelector('.num-assignee').textContent = '0';
     document.querySelector('.num-created-by').textContent = '0';
     document.querySelector('.num-environment').textContent = '0';
     document.querySelector('.num-release').textContent = '0';
     document.querySelector('.num-module').textContent = '0';
    
 
 });

const rightCol = document.querySelector('.right-col');

const toggleButtonFilter = document.getElementById('toggleButtonFilter');
const toggleIconFilter = document.getElementById('toggleIconFilter');


toggleButtonFilter.addEventListener('click', function() {
    rightCol.classList.toggle('d-none');
    if (toggleIconFilter.classList.contains('bi-chevron-compact-right')) {
      toggleIconFilter.classList.remove('bi-chevron-compact-right');
      toggleIconFilter.classList.add('bi-chevron-compact-left');
    }
    else {
      toggleIconFilter.classList.remove('bi-chevron-compact-left');
      toggleIconFilter.classList.add('bi-chevron-compact-right');
    }
  });


  function toggleCheckAll(source) {
    var checkboxes = document.querySelectorAll('.code-item');
    checkboxes.forEach(function(checkbox) {
        if (checkbox !== source) {
            checkbox.checked = source.checked;
        }
    });
  }