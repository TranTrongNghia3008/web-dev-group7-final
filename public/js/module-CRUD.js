// const { BIGINT } = require("sequelize");

document.addEventListener('DOMContentLoaded', function () {
  var addModuleModal = document.getElementById('addModule');
  addModuleModal.addEventListener('show.bs.modal', function (event) {
      // Button that triggered the modal
      var button = event.relatedTarget;
      // Extract info from data-* attributes
      var parentModuleName = button.getAttribute('data-parentmodule');
      
      if (parentModuleName) {
          // Update the modal's form fields
          var modal = this;
          var select = modal.querySelector('select[name="parentModule"]');
          var options = select.options;

          // Iterate through options and find the one with the matching name
          for (var i = 0; i < options.length; i++) {
              if (options[i].text === parentModuleName) {
                  options[i].selected = true;
                  break;
              }
          }
      }
  });
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('moduleForm');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
  
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      const modal = document.getElementById('addModule');
      const projectId = modal.getAttribute('data-projectid');
  
      try {
        const response = await fetch(`/project/${projectId}/module`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
  
        if (!response.ok) {
            throw new Error('Failed to add module');
        }

      // Đóng modal và tải lại trang sau khi thêm thành công
      // modal.hide();
      window.location.reload();
      } catch (error) {
        console.error('Error saving module:', error);
        alert('Failed to save module. Please try again.');
      }
    });
  });

  async function deleteModule(id, pid) {
    try {
        let res = await fetch(`/project/${pid}/module/${id}`, {
            method: "DELETE",
        });

        if (res.status == 200) {
            // location.reload();
          document.querySelectorAll(`a[data-id="${id}"]`).forEach(element => {
            element.style.display = 'none';
          });
          document.querySelectorAll(`div[data-id="${id}"]`).forEach(element => {
            element.style.display = 'none';
          });
        } else {
            let resText = await res.text();
            throw new Error(resText);
        }
    } catch (error) {
        let toast = new bootstrap.Toast(document.querySelector(".toast"), {});
        let toastBody = document.querySelector(".toast .toast-body");

        toastBody.innerHTML = "Can not delete module!";
        toastBody.classList.add("text-danger");
        toast.show();

        console.log(error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
  const modulesContainer = document.getElementById('modules-container');

  modulesContainer.addEventListener('click', async function(event) {
      if (event.target.closest('.delete-parent-module')) {
          event.preventDefault();
          const deleteLink = event.target.closest('.delete-parent-module');
          const moduleId = deleteLink.getAttribute('data-id');
          const projectId = deleteLink.getAttribute('data-projectid');

          const options = {
            title: "Are you sure?",
            type: "danger",
            btnOkText: "Yes",
            btnCancelText: "No",
            onConfirm: () => {
                console.log(moduleId);
                deleteModule(moduleId, projectId);
            },
            onCancel: () => {
                console.log("Deletion canceled.");
            },
        };

        const { el, content, options: confirmedOptions } = bs5dialog.confirm(
          "Do you really want to delete this module?",
          options
      );

          
    
      }
  });
});

document.addEventListener('DOMContentLoaded', function () {
  
  var editModuleModal = document.getElementById('editModuleModal');
  editModuleModal.addEventListener('show.bs.modal', function (event) {
      // Button that triggered the modal
      var button = event.relatedTarget;
      // Extract info from data-* attributes
    
      var name = button.getAttribute('data-name');
      var id = button.getAttribute('data-id');
      

      // Update the modal's form fields
      var modal = this;
   
      modal.querySelector('input[name="moduleName"]').value = name;
      modal.querySelector('input[name="moduleId"]').value = id;

  });
});

document.addEventListener('DOMContentLoaded', function() {
  const editModuleForm = document.getElementById('editModuleForm');

  // Xử lý submit form
  editModuleForm.addEventListener('submit', async function(event) {
      event.preventDefault();

      const formData = {
          name: this.elements['moduleName'].value,
      };

      const projectId = this.elements['projectId'].value;
      const moduleId = this.elements['moduleId'].value;
      console.log(projectId)

      try {
          const response = await fetch(`/project/${projectId}/module/${moduleId}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(formData)
          });

          if (!response.ok) {
              throw new Error('Failed to update Module');
          }

          location.reload();
      } catch (error) {
          console.error('Error updating Module:', error);
          alert('Failed to update Module.');
      }
  });
});


