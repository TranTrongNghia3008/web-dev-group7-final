function createModuleCard(moduleName) {
    // Tạo phần tử card
    const cardContainer = document.createElement('div');
    cardContainer.className = 'col-3 module-' + moduleName.toLowerCase().replace(/\s+/g, '-');

    const card = document.createElement('div');
    card.className = 'card h-100';

    // Tạo phần tử card header
    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header d-flex justify-content-between';
    const headerContent = document.createElement('div');
    headerContent.textContent = moduleName + ' (0)'; // Số lượng module, bạn có thể cập nhật sau
    cardHeader.appendChild(headerContent);

    // Tạo phần tử action buttons
    const actionButtons = document.createElement('div');
    actionButtons.innerHTML = `
        <a href="#" data-bs-toggle="modal" data-bs-target="#addModule" data-bs-toggle="tooltip" title="Add Module" class="mx-2"><img src="/images/add.svg" alt="" style="width: 1rem; height: 1rem;" class="mb-1"></a>
        <a href="#" data-bs-toggle="tooltip" title="Delete Parent Module" class="mx-2 my-auto"><i class="bi bi-trash text-danger"></i></a>
        <button type="button" class="btn-close" disabled aria-label="Close"></button>
    `;

    cardHeader.appendChild(actionButtons);

    // Tạo phần tử card body
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    const bodyContent = document.createElement('div');
    bodyContent.className = 'container bg-white rounded border p-2';
    bodyContent.textContent = 'Drag and Drop any modules to make as Sub Modules';
    cardBody.appendChild(bodyContent);

    // Gộp các phần tử vào card
    card.appendChild(cardHeader);
    card.appendChild(cardBody);
    cardContainer.appendChild(card);

    // Thêm card vào nơi bạn muốn hiển thị
    document.getElementById('modules-container').appendChild(cardContainer);
}


// Tạo danh sách module
// document.addEventListener('DOMContentLoaded', function(even) {
 

//     // Danh sách các modules
//     // const modules = ['Contact', 'Blog', 'Pricing', 'Home page', 'Header section', 'Footer section'];
//     const modules = JSON.parse(document.getElementById('module-list').getAttribute('data-modules'));    

//     modules.forEach(module => {
//         // Tạo phần tử <a> cho module
//         var moduleLink = document.createElement('a');
        
//         const moduleId = module.Name.toLowerCase().replace(/\s/g, '-'); // Unique ID for module link
//         moduleLink.href = '#';
//         moduleLink.id = `module-link-${moduleId}`; // Unique ID for module link
//         moduleLink.className = 'list-group-item list-group-item-action rounded border my-2 py-3';
        
    
//         // Tạo phần tử <div> cho checkbox và label
//         const div = document.createElement('div');
//         div.className = 'form-check';
    
//         // Tạo phần tử <input> cho checkbox
//         const input = document.createElement('input');
//         input.className = 'form-check-input module-checkbox';
//         input.type = 'checkbox';
//         input.value = '';
//         input.id = `module-item-${moduleId}`;
    
//         // Tạo phần tử <label> cho label của checkbox
//         const label = document.createElement('label');
//         label.className = 'form-check-label';
//         label.htmlFor = `module-item-${moduleId}`;
//         label.textContent = module.Name;
        
    
//         // Thêm input và label vào div
//         div.appendChild(input);
//         div.appendChild(label);
    
//         // Thêm div vào phần tử <a>
//         moduleLink.appendChild(div); 

//         moduleLink.onclick = function() {
//             createModuleCard(module.Name); // Gọi hàm createModuleCard khi thẻ <a> được nhấn
//         };
    
    
//         // Thêm phần tử <a> vào danh sách module
//         document.getElementById('module-list').appendChild(moduleLink);
//     });
    

    
// });


{
    function toggleCheckAll(source) {
        var id = source.getAttribute('data-id');
        console.log(id)
  
        var checkboxes = document.querySelectorAll(`.module-checkbox-${id}`);
        checkboxes.forEach(function(checkbox) {
            if (checkbox !== source) {
                checkbox.checked = source.checked;
            }
        });
      }
}

//Kéo thả modules trong danh sách

// {
//     $(function() {
//         // Kích hoạt tính năng kéo và thả
//         $("#module-list").sortable({
//             // Chọn các item có thể kéo và thả
//             items: ".list-group-item",
//             // Cài đặt lại chiều dọc
//             axis: "y",
//             // Xử lý sự kiện khi hoàn thành kéo và thả
//             stop: function(event, ui) {
//                 // Cập nhật vị trí mới của các item
//                 updateModuleOrder();
//             }
//         });

//         // Hàm cập nhật vị trí mới của các module
//         function updateModuleOrder() {
//             var moduleOrder = [];
//             // Lặp qua mỗi item và lấy id của nó
//             $("#module-list .list-group-item").each(function(index) {
//                 moduleOrder.push($(this).attr('id'));
//             });
//             // In ra để kiểm tra
//             console.log(moduleOrder);
//             // Gửi moduleOrder đến máy chủ hoặc xử lý nó ở đây
//         }
//     });
// }