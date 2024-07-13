document.addEventListener('DOMContentLoaded', function() {
    const assignUserBtns = document.querySelectorAll('.assignUserBtn');
    

    assignUserBtns.forEach(btn => {
        btn.addEventListener('click', async function(event) {
            event.preventDefault();
            const projectId = this.getAttribute('data-projectId');
            const userId = this.getAttribute('data-userId'); // Assuming you have currentUser available in your template context
            console.log(userId, projectId )

            try {
                const response = await fetch('/project/list/check-role', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId, projectId })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message);
                }

                const modal = $('#assignUserModal');
                modal.find('input[name="projectId"]').val(projectId); // Giả sử bạn có trường input với name là "projectId"

                modal.modal('show'); // Mở modal
            } catch (error) {
                alert(error.message);
            }


        })
        
    });
});

// document.getElementById('assignUserBtn').addEventListener('click', function(event) {
//     event.preventDefault();
//     const projectId = this.getAttribute('data-projectId');
//     const userId = this.getAttribute('data-userId'); // Assuming you have currentUser available in your template context
//     console.log(userId, projectId )

//     fetch('/project/list/check-role', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ userId, projectId })
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log(data.role)
//         if (data.role === 'Admin' || data.role === 'Manager') {
//             assignUserBtn.style.display = 'inline-block'; // Show the button
//             assignUserBtn.addEventListener('click', function(event) {
//                 event.preventDefault();
//                 // Open modal or handle click event
//                 $('#assignUserModal').modal('show');
//             });
//         } else {
//             console.error('User does not have the necessary permissions.');
//         }
//     })
//     .catch(error => console.error('Error:', error));
// });


document.addEventListener('DOMContentLoaded', function () {
    var assignUserModal = document.getElementById('assignUserModal');
    assignUserModal.addEventListener('show.bs.modal', function (event) {
        // Button that triggered the modal
        var button = event.relatedTarget;
        // Extract info from data-* attributes
      
        var projectId = button.getAttribute('data-projectId');
        console.log(projectId)

        // Update the modal's form fields
        var modal = this;
     
        modal.querySelector('input[name="projectId"]').value = projectId;

    });
});

document.addEventListener('DOMContentLoaded', function() {
    const assignUserForm = document.getElementById('assginUserForm');


    // Xử lý submit form
    assignUserForm.addEventListener('submit', async function(event) {
        event.preventDefault();


        const formData = {
            role: this.elements['role'].value,
            assignUser: this.elements['assign-user'].value,
            projectId: this.elements['projectId'].value
        };
        console.log(formData)

        try {
            const response = await fetch('/project/list/assignUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to asigning user');
            }
        
            location.reload();
        } catch (error) {
            console.error('Error assigning user:', error);
        }
    });
});




