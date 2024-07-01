// function showEditTestCaseModal(btn) {
//     document.querySelector("#idEdit").value = btn.dataset.id;
//     document.querySelector("#nameEdit").value = btn.dataset.planName;
//     document.querySelector("#startDateEdit").value = btn.dataset.startDate;
//     document.querySelector("#endDateEdit").value = btn.dataset.endDate;
//     document.querySelector("#descriptionEdit").value = btn.dataset.description;
//   }

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
  
// async function editTestCase(e) {
//     e.preventDefault();
  
//     const formData = new FormData(document.getElementById("editTestCaseForm"));
//     let data = Object.fromEntries(formData.entries());

//     try {
//       let res = await fetch(`/project/${data.projectId}/test-plan`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data)
//       });
  
//       if (res.status == 200) {
//         location.reload();
//       } else {
//         let resText = await res.text();
//         throw new Error(resText);
//       }
//     } catch (error) {
//       e.target.querySelector("#errorMessageEdit").innerText = "Can not update test plan!";
//       console.log(error);
//     }
//   }

// document.querySelector("#editTestCase").addEventListener("shown.bs.modal", () => {
//     document.querySelector("#nameEdit").focus();
//   });
// //   để nó focus khi mở modal

// async function deleteTestCase(id, pid) {
//     try {
//         let res = await fetch(`/project/${pid}/test-plan/${id}`, {
//             method: "DELETE",
//         });

//         if (res.status == 200) {
//             location.reload();
//         } else {
//             let resText = await res.text();
//             throw new Error(resText);
//         }
//     } catch (error) {
//         let toast = new bootstrap.Toast(document.querySelector(".toast"), {});
//         let toastBody = document.querySelector(".toast .toast-body");

//         toastBody.innerHTML = "Can not delete test plan!";
//         toastBody.classList.add("text-danger");
//         toast.show();

//         console.log(error);
//     }
// }

// document.querySelectorAll(".delete-btn").forEach((deleteBtn) => {
//     deleteBtn.addEventListener("click",(e) => {
//         e.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>

//         let id = e.currentTarget.dataset.id;
//         let pid = e.currentTarget.dataset.projectId;

//         const options = {
//             title: "Are you sure?",
//             type: "danger",
//             btnOkText: "Yes",
//             btnCancelText: "No",
//             onConfirm: () => {
//                 console.log(id);
//                 deleteTestCase(id, pid);
//             },
//             onCancel: () => {
//                 console.log("Deletion canceled.");
//             },
//         };

//         const { el, content, options: confirmedOptions } = bs5dialog.confirm(
//             "Do you really want to delete this test plan?",
//             options
//         );
//     });
// });
  