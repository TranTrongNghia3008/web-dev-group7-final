document.querySelectorAll('.status-item').forEach(function(item) {
    item.addEventListener('click', async function(event) {
      event.preventDefault(); // Ngăn chặn hành động mặc định của link
  
      const status = this.textContent.trim();
  
  
      const testCaseId = this.getAttribute('data-id');
      const projectId = this.getAttribute('data-projectId');
      const color = this.getAttribute('data-color');
      console.log('Test Case:', testCaseId);
      console.log('Project:', projectId);
  
      var selectedStatusButton = document.querySelector(`#dropdownMenuButton[data-id="${testCaseId}"]`);
      var selectedStatus = document.querySelector(`#dropdownMenuButtonText[data-id="${testCaseId}"]`);
      selectedStatusButton.style.borderLeftColor = color;
      selectedStatus.textContent = status;
      
  
      try {
        const response = await fetch(`/project/${projectId}/test-run/result/changeStatus/${testCaseId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status })
        });
  
        if (!response.ok) {
          throw new Error('Failed to update test run');
        }
  
        // location.reload();
      } catch (error) {
        console.error('Error updating test run:', error);
        alert('Failed to update test run.');
      }
    });
  });


document.addEventListener('DOMContentLoaded', function() {
    // Thêm sự kiện change cho tất cả các phần tử select với class assign-select
    document.querySelectorAll('.assign-select').forEach(function(selectElement) {
        selectElement.addEventListener('change', async function(event) {
            const testCaseId = this.getAttribute('data-id');
            const projectId = this.getAttribute('data-projectId');
            const assignTo = this.value;

            try {
                const response = await fetch(`/project/${projectId}/test-run/result/updateAssignTo/${testCaseId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ assignTo })
                });

                if (!response.ok) {
                    throw new Error('Failed to update assignTo');
                }

                console.log('AssignTo updated successfully');
            } catch (error) {
                console.error('Error updating assignTo:', error);
                alert('Failed to update assignTo.');
            }
        });
    });
});