function showEditReportModal(btn) {
    console.log(btn.dataset);

    document.querySelector("#reportIdEdit").value = btn.dataset.reportId;
    document.querySelector("#projectIdEdit").value = btn.dataset.projectId;
    
    document.querySelector("#titleEdit").value = btn.dataset.title;
    document.querySelector("#startDateEdit").value = btn.dataset.startDate;
    document.querySelector("#endDateEdit").value = btn.dataset.endDate;
    document.querySelector("#startTimeEdit").value = btn.dataset.startTime;
    document.querySelector("#endTimeEdit").value = btn.dataset.endTime;
    document.querySelector("#isScheduledEdit").checked = (btn.dataset.isScheduled == 'true');
    // Filling data for select fields
    const reportType = btn.dataset.reportType;
    const resourceType = btn.dataset.resourceType;
    document.querySelector("#reportTypeEdit").value = reportType;
    document.querySelector("#resourceTypeEdit").value = resourceType;
  }


async function editReport(e) {
  e.preventDefault();

  const formData = new FormData(document.getElementById("editReportForm"));
  let data = Object.fromEntries(formData.entries());
  console.log(data)

  try {
      let res = await fetch(`/project/${data.projectId}/report`, {
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
  deleteBtn.addEventListener("click",(e) => {
      e.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>

      let id = e.currentTarget.dataset.reportId;
      let pid = e.currentTarget.dataset.projectId;

      const options = {
          title: "Are you sure?",
          type: "danger",
          btnOkText: "Yes",
          btnCancelText: "No",
          onConfirm: () => {
              console.log(id);
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
