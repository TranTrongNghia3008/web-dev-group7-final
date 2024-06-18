function showEditTestPlanModal(btn) {
    document.querySelector("#idEdit").value = btn.dataset.id;
    document.querySelector("#nameEdit").value = btn.dataset.planName;
    document.querySelector("#startDateEdit").value = btn.dataset.startDate;
    document.querySelector("#endDateEdit").value = btn.dataset.endDate;
    document.querySelector("#descriptionEdit").value = btn.dataset.description;
  }
  
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
  