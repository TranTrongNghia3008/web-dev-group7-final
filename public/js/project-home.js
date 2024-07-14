const openReleaseStatus = ['Passed', 'Untested', 'Blocked', 'Retest', 'Failed', 'Not Applicable', 'In Progress', 'Hold'];
  const numOpenReleaseStatus = document.getElementById('chartOpenReleaseStatus').getAttribute('data-numOpenReleaseStatus').split(',');
// const numOpenReleaseStatus = [1,2,3,4,5,6,7,8];
  const barColorsOpenReleaseStatus = [
  "rgb(92, 184, 92)",
  "rgb(70, 191, 189)",
  "rgb(77, 83, 96)",
  "rgb(253, 180, 92)",
  "rgb(247, 70, 74)",
  "rgb(147, 119, 85)",
  "rgb(87, 147, 243)",
  "rgb(23, 162, 184)"

  ];

  new Chart("chartOpenReleaseStatus", {
  type: "doughnut",
  data: {
      labels: openReleaseStatus,
      datasets: [{
      backgroundColor: barColorsOpenReleaseStatus,
      data: numOpenReleaseStatus
      }]
  },
  options: {
      legend: {
          display: false // Ẩn chú thích
      },
      elements: {
          arc: {
              borderWidth: 2, // Độ rộng của viền
              borderColor: '#ffffff', // Màu sắc của viền
              shadowColor: '#000000', // Màu sắc của đổ bóng
              shadowBlur: 20 // Độ mờ của đổ bóng
          }
      }
  }
  });


  function statusCaption(containerClass, ArrStatus, ArrNumStatus) {
    const container = document.querySelector(containerClass);
    if (!container) {
        console.error("Container not found!");
        return;
    }

  


    // Duyệt qua mỗi phần tử trong mảng trạng thái dự án
    ArrStatus.forEach((status, index) => {
        // Tạo phần tử div
        const div = document.createElement('div');
        div.classList.add('col', 'mx-2', 'mb-2');
        const div2 = document.createElement('div');
        
        // Tạo phần tử chứa số lượng
        const countSpan = document.createElement('span');
        countSpan.classList.add('status-num');
        countSpan.textContent = ArrNumStatus[index] + ' ';
        
        // Tạo phần tử chứa hình tròn
        const circleDiv = document.createElement('div');
        circleDiv.classList.add('rounded-circle', 'd-inline-flex', `status-${status.toLowerCase().replace(' ', '-')}`);
        circleDiv.style.width = '7px';
        circleDiv.style.height = '7px';
        
        // Tạo phần tử chứa tên trạng thái
        const statusSpan = document.createElement('span');
        statusSpan.classList.add('status');
        statusSpan.textContent = status;
        
        // Gắn các phần tử vào div
        div2.appendChild(countSpan);
        div2.appendChild(circleDiv);
        div.appendChild(div2);
        div.appendChild(statusSpan);
        
        // Gắn div vào container
        container.appendChild(div);
    });
  }
  statusCaption('.open-release-status-container', openReleaseStatus, numOpenReleaseStatus);




  async function removeAssginUser(id) {
    try {
        let res = await fetch(`/project/removeAssignUser/${id}`, {
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

        toastBody.innerHTML = "Can not remove assgin user!";
        toastBody.classList.add("text-danger");
        toast.show();

        console.log(error);
    }
}

document.querySelectorAll(".remove-assign-user").forEach((deleteBtn) => {
    deleteBtn.addEventListener("click",(e) => {
        e.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>

        let id = e.currentTarget.dataset.id;

        const options = {
            title: "Are you sure?",
            type: "danger",
            btnOkText: "Yes",
            btnCancelText: "No",
            onConfirm: () => {
                console.log(id);
                removeAssginUser(id);
            },
            onCancel: () => {
                console.log("Remove canceled.");
            },
        };

        const { el, content, options: confirmedOptions } = bs5dialog.confirm(
            "Do you really want to remove this assignee?",
            options
        );
    });
});