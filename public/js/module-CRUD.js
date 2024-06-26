document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('moduleForm');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
    //   if (!form.checkValidity()) {
    //     e.stopPropagation();
    //     form.classList.add('was-validated');
    //     return;
    //   }
  
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
            location.reload();
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



// document.querySelectorAll(".delete-").forEach((deleteBtn) => {
//     deleteBtn.addEventListener("click",(e) => {
//         e.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>

//         let id = e.currentTarget.dataset.id;
//         let pid = e.currentTarget.dataset.projectId;

//         const options = {
//             title: "Are you sure?",
//             type: "danger",
//             btnOkText: "Yes",
//             btnCancelText: "No",
//             onConfirm: () => {
//                 console.log(id);
//                 deleteTestRun(id, pid);
//             },
//             onCancel: () => {
//                 console.log("Deletion canceled.");
//             },
//         };

//         const { el, content, options: confirmedOptions } = bs5dialog.confirm(
//             "Do you really want to delete this test run?",
//             options
//         );
//     });
// });