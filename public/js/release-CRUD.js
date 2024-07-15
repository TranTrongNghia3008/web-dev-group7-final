function showEditReleaseModal(btn) {
    document.querySelector("#idEdit").value = btn.dataset.id;
    document.querySelector("#nameEdit").value = btn.dataset.name;
    document.querySelector("#startDateEdit").value = btn.dataset.startDate;
    document.querySelector("#endDateEdit").value = btn.dataset.endDate;
    document.querySelector("#descriptionEdit").value = btn.dataset.description;
    // Add any additional fields here if necessary
}

async function addRelease(e) {
    e.preventDefault();

    const formData = new FormData(document.getElementById("addReleaseForm"));
    let data = Object.fromEntries(formData.entries());

    const startDate = data.startDate;
    const endDate = data.endDate;
    const errorMessageElement = document.getElementById("errorMessageEdit");

    // Clear previous error messages
    errorMessageElement.innerText = "";

    // Check start date and end date
    if ((startDate && !endDate) || (!startDate && endDate)) {
        errorMessageElement.innerText = "Please enter both start and end dates.";
        return;
    }

    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
        errorMessageElement.innerText = "Start date must be earlier than end date.";
        return;
    }

    try {
        let res = await fetch(`/project/${data.projectId}/release`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        if (res.status == 200) {
            location.reload();
        } else {
            let resText = await res.text();
            throw new Error(resText);
        }
    } catch (error) {
        e.target.querySelector("#errorMessageEdit").innerText = "Cannot add release!";
        console.log(error);
    }
}

document.querySelector("#addRelease").addEventListener("shown.bs.modal", () => {
    document.querySelector("#name").focus();
});

document.querySelector("#editRelease").addEventListener("shown.bs.modal", () => {
    document.querySelector("#nameEdit").focus();
});

async function editRelease(e) {
    e.preventDefault();

    const formData = new FormData(document.getElementById("editReleaseForm"));
    let data = Object.fromEntries(formData.entries());

    try {
        let res = await fetch(`/project/${data.projectId}/release`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        if (res.status == 200) {
            location.reload();
        } else {
            let resText = await res.text();
            throw new Error(resText);
        }
    } catch (error) {
        e.target.querySelector("#errorMessageEdit").innerText = "Cannot update release!";
        console.log(error);
    }
}

async function deleteRelease(id, pid) {
    try {
        let res = await fetch(`/project/${pid}/release/${id}`, {
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

        toastBody.innerHTML = "Cannot delete release!";
        toastBody.classList.add("text-danger");
        toast.show();

        console.log(error);
    }
}

document.querySelectorAll(".delete-btn").forEach((deleteBtn) => {
    deleteBtn.addEventListener("click",(e) => {
        e.preventDefault(); // Prevent default action of <a> tag

        let id = e.currentTarget.dataset.id;
        let pid = e.currentTarget.dataset.projectId;

        const options = {
            title: "Are you sure?",
            type: "danger",
            btnOkText: "Yes",
            btnCancelText: "No",
            onConfirm: () => {
                console.log(id);
                deleteRelease(id, pid);
            },
            onCancel: () => {
                console.log("Deletion canceled.");
            },
        };

        const { el, content, options: confirmedOptions } = bs5dialog.confirm(
            "Do you really want to delete this release?",
            options
        );
    });
});



function showOpenReleases(projectID) {
    // Call controller with page=1 and statusFilter=open
    window.location.href = `/project/${projectID}/release?page=1&statusFilter=open`;
}

function showUpcomingReleases(projectID) {
    // Call controller with page=1 and statusFilter=upcoming
    window.location.href = `/project/${projectID}/release?page=1&statusFilter=upcoming`;
}

function showCompletedReleases(projectID) {
    // Call controller with page=1 and statusFilter=completed
    window.location.href = `/project/${projectID}/release?page=1&statusFilter=completed`;
}   