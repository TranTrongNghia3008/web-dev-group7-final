function showEditTestPlanModal(btn) {
    document.querySelector("#idEdit").value = btn.dataset.id;
    document.querySelector("#nameEdit").value = btn.dataset.planName;
    document.querySelector("#startDateEdit").value = btn.dataset.startDate;
    document.querySelector("#endDateEdit").value = btn.dataset.endDate;
    document.querySelector("#descriptionEdit").value = btn.dataset.description;
  }

  document.querySelector("#addTestPlanForm").addEventListener("submit", function(e) {
    let isValid = true;
    let name_div = document.querySelector("#name");
    let title_val = name_div.value;
    if (!title_val.trim()) {
        isValid = false;
        name_div.classList.remove("is-valid");
        name_div.classList.add("is-invalid");
    }
    else {
        name_div.classList.remove("is-invalid");
        name_div.classList.add("is-valid");
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

  async function addTestPlan(e) {
    e.preventDefault();
  
    const formData = new FormData(document.getElementById("addTestPlanForm"));
    let data = Object.fromEntries(formData.entries());

    try {
      let res = await fetch(`/project/${data.projectId}/test-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });
  
      if (res.status == 200) {
        alert('Success! Data has been added.');
        location.reload();
      } else {
        let resText = await res.text();
        throw new Error(resText);
      }
    } catch (error) {
      console.log(error);
    }
  }

  document.querySelector("#addTestPlan").addEventListener("shown.bs.modal", () => {
    document.querySelector("#name").focus();
  });
  
  async function editTestPlan(e) {
    e.preventDefault();
  
    const formData = new FormData(document.getElementById("editTestPlanForm"));
    let data = Object.fromEntries(formData.entries());

    try {
      let res = await fetch(`/project/${data.projectId}/test-plan`, {
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
      e.target.querySelector("#errorMessageEdit").innerText = "Can not update test plan!";
      console.log(error);
    }
  }

  document.querySelector("#editTestPlan").addEventListener("shown.bs.modal", () => {
    document.querySelector("#nameEdit").focus();
  });
//   để nó focus khi mở modal

async function deleteTestPlan(id, pid) {
    try {
        let res = await fetch(`/project/${pid}/test-plan/${id}`, {
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

        toastBody.innerHTML = "Can not delete test plan!";
        toastBody.classList.add("text-danger");
        toast.show();

        console.log(error);
    }
}


document.querySelectorAll(".delete-btn").forEach((deleteBtn) => {
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
                deleteTestPlan(id, pid);
            },
            onCancel: () => {
                console.log("Deletion canceled.");
            },
        };

        const { el, content, options: confirmedOptions } = bs5dialog.confirm(
            "Do you really want to delete this test plan?",
            options
        );
    });
});
  
function loadTestPlanDetails(btn) {
  document.querySelector("#testPlanIdDetail").innerText = btn.dataset.id;
  document.querySelector("#testPlanNameDetail").innerText = btn.dataset.name;
  document.querySelector("#testPlanDescriptionDetail").innerText = btn.dataset.description;
  document.querySelector("#testPlanStartDateDetail").innerText = btn.dataset.startDate;
  document.querySelector("#testPlanEndDateDetail").innerText = btn.dataset.endDate;
  document.querySelector("#testPlanRequirementIdDetail").innerText = btn.dataset.requirementId;
  document.querySelector("#testPlanCreatedAtDetail").innerText = btn.dataset.createdAt;
  document.querySelector("#testPlanUpdatedAtDetail").innerText = btn.dataset.updatedAt;
  document.querySelector("#testPlanProjectIdDetail").innerText = btn.dataset.projectId;
}
