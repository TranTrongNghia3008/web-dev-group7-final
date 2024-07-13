document.addEventListener('DOMContentLoaded', function() {
    const addTestRunForm = document.getElementById('addTestRunForm');
    // const addModal = new bootstrap.Modal(document.getElementById('addTestRun'));

    // Xử lý submit form
    addTestRunForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = {
            name: this.elements['test-run-name'].value,
            version: this.elements['version'].value,
            browser: this.elements['browser'].value,
            assignToName: this.elements['assign-to'].value,
            testcase: this.elements['testcase'].value,
            description: this.elements['description'].value,
            createdBy: this.elements['userId'].value
        };

        const projectId = this.elements['projectID'].value;

        try {
            const response = await fetch(`/project/${projectId}/test-run/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            // Đóng modal và tải lại trang sau khi thêm thành công
            // addModal.hide();
            window.location.reload();
        } catch (error) {
            // console.error('Error adding test run:', error);
            alert(`Failed to add test run: ${error.message}`);
        }
    });
});


document.addEventListener('DOMContentLoaded', function () {
    var editTestRunModal = document.getElementById('editTestRun');
    editTestRunModal.addEventListener('show.bs.modal', function (event) {
        // Button that triggered the modal
        var button = event.relatedTarget;
        // Extract info from data-* attributes
        var testRunId = button.getAttribute('data-id');
        var name = button.getAttribute('data-name');
        var version = button.getAttribute('data-version');
        var browser = button.getAttribute('data-browser');
        var assignTo = button.getAttribute('data-assign-to');
        var testcase = button.getAttribute('data-testcase');
        var description = button.getAttribute('data-description');
        var status = button.getAttribute('data-status');
        var createdBy = button.getAttribute('data-createdby');
        console.log(testRunId)

        // Update the modal's form fields
        var modal = this;
     
        modal.querySelector('input[name="test-run-id"]').value = testRunId;
        modal.querySelector('input[name="test-run-name"]').value = name;
        modal.querySelector('input[name="version"]').value = version;
        modal.querySelector('input[name="browser"]').value = browser;
        modal.querySelector('input[name="assign-to"]').value = assignTo;
        modal.querySelector('input[name="testcase"]').value = testcase;
        modal.querySelector('textarea[name="description"]').value = description;
        modal.querySelector('input[name="status"]').value = status;
        modal.querySelector('input[name="created-by"]').value = createdBy;
        
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const editTestRunForms = document.querySelectorAll('.editTestRunForm');

    editTestRunForms.forEach(form => {
        // Xử lý submit form
        form.addEventListener('submit', async function(event) {
            event.preventDefault();

            const formData = {
                name: this.elements['test-run-name'].value,
                version: this.elements['version'].value,
                browser: this.elements['browser'].value,
                assignToName: this.elements['assign-to'].value,
                testcase: this.elements['testcase'].value,
                description: this.elements['description'].value,
                status: this.elements['status'].value,
                createdBy: this.elements['createdBy'].value
            };
            console.log(formData)

            const projectId = this.elements['projectID'].value;
            const testRunId = this.elements['test-run-id'].value;

            try {
                const response = await fetch(`/project/${projectId}/test-run/${testRunId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message);
                }

                location.reload();
            } catch (error) {
                console.error('Error updating test run:', error);
                alert(`Failed to update test run: ${error.message}`);
            }
        });
    });
});



// document.addEventListener('DOMContentLoaded', function() {
//     const editTestRunForm = document.getElementById('editTestRunForm');

//     // Xử lý submit form
//     editTestRunForm.addEventListener('submit', async function(event) {
//         event.preventDefault();

//         const formData = {
//             name: this.elements['test-run-name'].value,
//             version: this.elements['version'].value,
//             browser: this.elements['browser'].value,
//             assignToName: this.elements['assign-to'].value,
//             testcase: this.elements['testcase'].value,
//             description: this.elements['description'].value,
//             status: this.elements['status'].value,
//             createdBy: this.elements['createdBy'].value
//         };

//         const projectId = this.elements['projectID'].value;
//         const testRunId = this.elements['test-run-id'].value;
//         console.log(projectId, testRunId)

//         try {
//             const response = await fetch(`/project/${projectId}/test-run/${testRunId}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(formData)
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message);
//             }

//             location.reload();
//         } catch (error) {
//             console.error('Error updating test run:', error);
//             alert(`Failed to update test run: ${error.message}`);
//         }
//     });

// });





async function deleteTestRun(id, pid) {
    try {
        let res = await fetch(`/project/${pid}/test-run/${id}`, {
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

        toastBody.innerHTML = "Can not delete test run!";
        toastBody.classList.add("text-danger");
        toast.show();

        console.log(error);
    }
}

document.querySelectorAll(".delete-test-run").forEach((deleteBtn) => {
    deleteBtn.addEventListener("click",(e) => {
        e.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>

        let id = e.currentTarget.dataset.id;
        let pid = e.currentTarget.dataset.projectId;

        const options = {
            title: "Are you sure?",
            type: "danger",
            btnOkText: "Yes",
            btnCancelText: "No",
            onConfirm: () => {
                console.log(id);
                deleteTestRun(id, pid);
            },
            onCancel: () => {
                console.log("Deletion canceled.");
            },
        };

        const { el, content, options: confirmedOptions } = bs5dialog.confirm(
            "Do you really want to delete this test run?",
            options
        );
    });
});
  
