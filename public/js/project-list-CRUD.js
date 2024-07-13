function showEditProjectModal(btn)
{
    document.querySelector("#projectNameEdit").value = btn.dataset.projectName;
    document.querySelector("#projectIdEdit").value = btn.dataset.projectId;
}

async function editProject(e) {
    e.preventDefault();
    console.log("Here");
    const formData = new FormData(document.getElementById("editProjectForm"));
    let data = Object.fromEntries(formData.entries());
    console.log(data)
  
    try {
        let res = await fetch(`/project/${data.projectId}`, {
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
        console.log(error);
    }
  }
  
  async function deleteProject(id) {
    try {
        let res = await fetch(`/project/${id}`, {
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
  
        toastBody.innerHTML = "Can not delete project!";
        toastBody.classList.add("text-danger");
        toast.show();
  
        console.log(error);
    }
}


  document.querySelectorAll(".delete-btn").forEach((deleteBtn) => {
    deleteBtn.addEventListener("click",(e) => {
        e.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>
  
        let id = e.currentTarget.dataset.projectId;
        const options = {
            title: "Are you sure?",
            type: "danger",
            btnOkText: "Yes",
            btnCancelText: "No",
            onConfirm: () => {
                console.log(id);
                deleteProject(id);
            },
            onCancel: () => {
                console.log("Deletion canceled.");
            },
        };
  
        const { el, content, options: confirmedOptions } = bs5dialog.confirm(
            "Do you really want to delete this project? All sub-resources will be deleted as well.",
            options
        );
    });
  });
  