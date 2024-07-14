function showEditReportModal(btn) {
    //console.log(btn.dataset);

    document.querySelector("#reportIdEdit").value = btn.dataset.reportId;
    document.querySelector("#projectIdEdit").value = btn.dataset.projectId;
    document.querySelector("#titleEdit").value = btn.dataset.title;
    document.querySelector("#isScheduledEdit").checked = (btn.dataset.isScheduled == 'true');
    document.querySelector("#reportTypeEdit").value = btn.dataset.reportType;
    
    // Datetime parsing and timezone conversion
    let localStartDate = null;
    let localEndDate = null;

    if (btn.dataset.startDate) {
        let startDate = new Date(btn.dataset.startDate);
        const localOffset = new Date().getTimezoneOffset();
        localStartDate = new Date(startDate.getTime() - localOffset * 60000).toISOString().slice(0, 16);
    }

    if (btn.dataset.endDate) {
        let endDate = new Date(btn.dataset.endDate);
        const localOffset = new Date().getTimezoneOffset();
        localEndDate = new Date(endDate.getTime() - localOffset * 60000).toISOString().slice(0, 16);
    }
    // Assign datetime to the form, form is datetime-local
    document.querySelector("#startDateEdit").value = localStartDate;
    document.querySelector("#endDateEdit").value = localEndDate;

    
    
}


async function editReport(e) {
    e.preventDefault();
    const formData = new FormData(document.getElementById("editReportForm"));
    let data = Object.fromEntries(formData.entries());
    
    try {
        let res = await fetch(`/project/${data.projectIdEdit}/report`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        if (res.status == 200) {
            let result = await res.json();
            location.reload();
        } else {
            let resText = await res.text();
            throw new Error(resText);
        }
    } catch (error) {
        //e.target.querySelector("#errorMessageEdit").innerText = "Can not update Report!!";
        console.log(error);
    }
}

document.querySelector("#editReportForm").addEventListener("submit", function (e) {
    e.preventDefault();
    let isValid = true;
    // 2.1. Validate if title is not null and valid (not full of spaces)
    let title_div = document.querySelector("#titleEdit");
    let title_val = title_div.value;
    if (!title_val.trim()) {
        isValid = false;
        title_div.classList.remove("is-valid");
        title_div.classList.add("is-invalid");
        return False;
    }
    else {
        title_div.classList.remove("is-invalid");
        title_div.classList.add("is-valid");
    }

    // 2.2. Validate if startDate < endDate
    let startDate_div = document.querySelector("#startDateEdit");
    let endDate_div = document.querySelector("#endDateEdit");
    let startDate_val = startDate_div.value;
    let endDate_val = endDate_div.value;

    let startDate = new Date(startDate_val);
    let endDate = new Date(endDate_val);
    if ((startDate && endDate) && (startDate > endDate)) {
        isValid = false;
        startDate_div.classList.remove("is-valid");
        endDate_div.classList.remove("is-valid");
        startDate_div.classList.add("is-invalid");
        endDate_div.classList.add("is-invalid");
        return False;
    }
    else {
        startDate_div.classList.remove("is-invalid");
        endDate_div.classList.remove("is-invalid");
        startDate_div.classList.add("is-valid");
        endDate_div.classList.add("is-valid");
    }
    if (isValid) {
        editReport(e);
    }
});


async function deleteReport(id, pid) {
    try {
        let res = await fetch(`/project/${pid}/report/${id}`, {
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

        toastBody.innerHTML = "Can not delete report!";
        toastBody.classList.add("text-danger");
        toast.show();

        console.log(error);
    }
}

document.querySelectorAll(".delete-btn").forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", (e) => {
        e.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>

        let id = e.currentTarget.dataset.reportId;
        let pid = e.currentTarget.dataset.projectId;

        const options = {
            title: "Are you sure?",
            type: "danger",
            btnOkText: "Yes",
            btnCancelText: "No",
            onConfirm: () => {
                deleteReport(id, pid);
            },
            onCancel: () => {
                console.log("Deletion canceled.");
            },
        };

        const { el, content, options: confirmedOptions } = bs5dialog.confirm(
            "Do you really want to delete this report?",
            options
        );
    });
});

// Validate report form validation
// Catch the form before submitting
document.querySelector("#addReportForm").addEventListener("submit", function (e) {
    // Part 1: For adding report
    // 1.1. Validate if title is not null and valid (not full of spaces)
    let isValid = true;
    let title_div = document.querySelector("#title");
    let title_val = title_div.value;
    if (!title_val.trim()) {
        isValid = false;
        title_div.classList.remove("is-valid");
        title_div.classList.add("is-invalid");
    }
    else {
        title_div.classList.remove("is-invalid");
        title_div.classList.add("is-valid");
    }

    // 1.2. Validate if startDate < endDate
    let startDate_div = document.querySelector("#startDate");
    let endDate_div = document.querySelector("#endDate");
    let startDate_val = startDate_div.value;
    let endDate_val = endDate_div.value;

    let startDate = new Date(startDate_val);
    let endDate = new Date(endDate_val);
    if ((startDate && endDate) && (startDate > endDate)) {
        isValid = false;
        startDate_div.classList.remove("is-valid");
        endDate_div.classList.remove("is-valid");
        startDate_div.classList.add("is-invalid");
        endDate_div.classList.add("is-invalid");
    }
    else {
        startDate_div.classList.remove("is-invalid");
        endDate_div.classList.remove("is-invalid");
        startDate_div.classList.add("is-valid");
        endDate_div.classList.add("is-valid");
    }
    if (!isValid) {
        e.preventDefault();
    }
});
