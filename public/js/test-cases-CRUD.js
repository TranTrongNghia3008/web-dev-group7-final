function showEditTestCaseModal(btn) {
    const testCase = {
        id: btn.getAttribute('data-id'),
        title: btn.getAttribute('data-title'),
        priority: btn.getAttribute('data-priority'),
        precondition: btn.getAttribute('data-precondition'),
        description: btn.getAttribute('data-description'),
        type: btn.getAttribute('data-type'),
        moduleId: btn.getAttribute('data-module-id'),
        testPlanId: btn.getAttribute('data-testplan-id')
    };
    
    document.querySelector("#idEdit").value = testCase.id;
    document.querySelector("#nameTestCaseEdit").value = testCase.title;
    document.querySelector("#priorityTestCaseEdit").value = testCase.priority;
    document.querySelector("#preconditionTestCaseEdit").value = testCase.precondition;
    document.querySelector("#descriptionTestCaseEdit").value = testCase.description;
    document.querySelector("#typeTestCaseEdit").value = testCase.description;
    document.querySelector("#nameModuleEdit").value = testCase.moduleId;

    const projectId = btn.dataset.projectIdEdit;

    const testPlanId = testCase.testPlanId;
    fetch(`/project/${projectId}/test-plan/${testPlanId}/name`)
        .then(response => response.json())
        .then(data => {
            if (data.TestPlanName) {
                document.querySelector("#nameTestPlanEdit").value = data.TestPlanName;
            } else {
                // Handle case where test plan name is not found
                document.querySelector("#nameTestPlanEdit").value = "Test plan not found";
            }
        })
        .catch(error => {
            console.error('Error fetching test plan name:', error);
            document.querySelector("#nameTestPlanEdit").value = "Error fetching test plan name";
        });

    const moduleId = testCase.moduleId;
    fetch(`/project/${projectId}/module/${moduleId}/name`)
        .then(response => response.json())
        .then(data => {
            if (data.ModuleName) {
                document.querySelector("#nameModuleEdit").value = data.ModuleName;
            } else {
                // Handle case where module name is not found
                document.querySelector("#nameModuleEdit").value = "Module not found";
            }
        })
        .catch(error => {
            console.error('Error fetching module name:', error);
            document.querySelector("#nameModuleEdit").value = "Error fetching module name";
        });
}

async function addTestCase(e) {
    e.preventDefault();
  
    const formData = new FormData(document.getElementById("addTestCaseForm"));
    let data = Object.fromEntries(formData.entries());

    let tags = [];
    document.querySelectorAll('.tag-text').forEach(tag => {
        if (tag.textContent.trim() !== '') { // Chỉ thêm tag không rỗng vào mảng
            tags.push(tag.textContent);
        }
    });

    try {
        let res = await fetch(`/project/${data.projectId}/test-case`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
    
        if (res.status == 200) {
            let responseData = await res.json();

            let tagIds = await Promise.all(tags.map(async tagText => {
                let resTag = await fetch(`/project/${data.projectId}/tag`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ Name: tagText, TestCaseID: responseData.TestCaseID })
                });
                let tagData = await resTag.json();

                return tagData._id; // Trả về _id của tag đã lưu
            }));
            location.reload();
        } else {
            let resText = await res.text();
            throw new Error(resText);
        }
        } catch (error) {
        e.target.querySelector("#errorMessageEdit").innerText = "Can not add test case!";
        console.log(error);
        }
  }

document.querySelector("#addTestCase").addEventListener("shown.bs.modal", () => {
    document.querySelector("#nameModule").focus();
  });
  
async function editTestCase(e) {
    e.preventDefault();
  
    const formData = new FormData(document.getElementById("editTestCaseForm"));
    let data = Object.fromEntries(formData.entries());

    let tags = [];
    document.querySelectorAll('.tag-text').forEach(tag => {
        if (tag.textContent.trim() !== '') { // Chỉ thêm tag không rỗng vào mảng
            tags.push(tag.textContent);
        }
    });
    console.log(tags)

    try {
        let res = await fetch(`/project/${data.projectIdEdit}/test-case`, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
    
        if (res.status == 200) {
            let responseData = await res.json();

            let tagIds = await Promise.all(tags.map(async tagText => {
                let resTag = await fetch(`/project/${data.projectIdEdit}/tag`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ Name: tagText, TestCaseID: data.idEdit })
                });
                let tagData = await resTag.json();

                return tagData._id; // Trả về _id của tag đã lưu
            }));
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
   
document.querySelector("#editTestCase").addEventListener("shown.bs.modal", () => {
    document.querySelector("#nameModule").focus();
  });
//   để nó focus khi mở modal

async function deleteTestCase(id, pid) {
    try {
        let res = await fetch(`/project/${pid}/test-case/${id}`, {
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

        toastBody.innerHTML = "Can not delete test case!";
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
                deleteTestCase(id, pid);
            },
            onCancel: () => {
                console.log("Deletion canceled.");
            },
        };

        const { el, content, options: confirmedOptions } = bs5dialog.confirm(
            "Do you really want to delete this test case?",
            options
        );
    });
});
  