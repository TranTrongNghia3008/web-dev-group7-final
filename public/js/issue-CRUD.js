document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addIssueForm');
    const modal = document.getElementById('addIssue');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const projectId = modal.getAttribute('data-projectid');

        try {
            const response = await fetch(`/project/${projectId}/issue/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Issue added successfully:', result);
                location.reload();
            } else {
                const errorText = await response.text();
                throw new Error(errorText);
            }
        } catch (error) {
            console.error('Error adding issue:', error);
            alert('Failed to add issue. Please try again.');
        }
    });
});


document.addEventListener('DOMContentLoaded', function () {
    var editIssueModal = document.getElementById('editIssue');
    var form = document.getElementById('editIssueForm');

    editIssueModal.addEventListener('show.bs.modal', function (event) {
        var button = event.relatedTarget;
        var title = button.getAttribute('data-title');
        var description = button.getAttribute('data-description');
        var category = button.getAttribute('data-category');
        var status = button.getAttribute('data-status');
        var priority = button.getAttribute('data-priority');
        var issueType = button.getAttribute('data-issue-type');
        var severity = button.getAttribute('data-severity');
        var environment = button.getAttribute('data-environment');
        var assignedTo = button.getAttribute('data-assign-to');
        var testRun = button.getAttribute('data-test-run');
        var stepsToReproduce = button.getAttribute('data-steps-to-reproduce');
        var startDay = button.getAttribute('data-start-day');
        var endDay = button.getAttribute('data-end-day')

        var startDayFormat = startDay ? new Date(startDay).toISOString().split('T')[0] : null;
        var endDayFormat = endDay ? new Date(endDay).toISOString().split('T')[0] : null;

        var modal = this;
        modal.querySelector('textarea[name="issue-title"]').value = title;
        modal.querySelector('textarea[name="issue-description"]').value = description;
        modal.querySelector('input[name="category"]').value = category;
        modal.querySelector('input[name="status"]').value = status;
        modal.querySelector('input[name="priority"]').value = priority;
        modal.querySelector('input[name="issue-type"]').value = issueType;
        modal.querySelector('input[name="severity"]').value = severity;
        modal.querySelector('input[name="environment"]').value = environment;
        modal.querySelector('input[name="start-day"]').value = startDayFormat;
        modal.querySelector('input[name="end-day"]').value = endDayFormat;
        modal.querySelector('input[name="assigned-to"]').value = assignedTo;
        modal.querySelector('input[name="testRun"]').value = testRun;
        modal.querySelector('textarea[name="steps-to-reproduce"]').value = stepsToReproduce;
    });

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        var formData = new FormData(form);
        var data = {};
        formData.forEach((value, key) => data[key] = value);
        var projectId = formData.get('projectID');

        try {
            const response = await fetch(`/project/${projectId}/issue`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Failed to update test run');
            }

            location.reload();
        } catch (error) {
            console.error('Error updating test run:', error);
            alert('Failed to update test run.');
        }
    });
});

async function deleteIssue(id, pid) {
    try {
        let res = await fetch(`/project/${pid}/issue/${id}`, {
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

        toastBody.innerHTML = "Can not delete issue!";
        toastBody.classList.add("text-danger");
        toast.show();

        console.log(error);
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const deleteButtons = document.querySelectorAll('.delete-issue');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();

            const issueId = this.getAttribute('data-id');
            const projectId = this.getAttribute('data-projectID');

            const options = {
                title: "Are you sure?",
                type: "danger",
                btnOkText: "Yes",
                btnCancelText: "No",
                onConfirm: () => {
                    // console.log(id);
                    deleteIssue(issueId, projectId);
                },
                onCancel: () => {
                    console.log("Deletion canceled.");
                },
            };
    
            const { el, content, options: confirmedOptions } = bs5dialog.confirm(
                "Do you really want to delete this issue?",
                options
            );
        });
    });
});

