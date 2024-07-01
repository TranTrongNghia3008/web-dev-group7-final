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




