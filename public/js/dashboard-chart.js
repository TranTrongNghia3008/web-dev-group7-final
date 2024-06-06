// Dữ liệu cho biểu đồ
document.addEventListener('DOMContentLoaded', (event) => {
    // Lấy dữ liệu từ thuộc tính data-* của thẻ canvas
    const labels = JSON.parse(document.getElementById('myChart').getAttribute('data-labels'));
    const data = JSON.parse(document.getElementById('myChart').getAttribute('data-data'));

    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Activity Number',
                backgroundColor: 'red',
                borderColor: 'black',
                data: data
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
});


// Hàm chuyển đổi hiển thị giữa biểu đồ và danh sách
function switchDisplay(type) {
    var graphButton = document.querySelector('.btn-graph');
    var listButton = document.querySelector('.btn-list');
    var graphContainer = document.getElementById('myChart');
    var listContainer = document.getElementById('listContainer');

    if (type === 'graph') {
        graphButton.classList.remove('btn-outline-danger');
        graphButton.classList.add('btn-danger');
        listButton.classList.remove('btn-danger');
        listButton.classList.add('btn-outline-danger');
        graphContainer.style.display = 'block';
        listContainer.style.display = 'none';
    } else if (type === 'list') {
        graphButton.classList.remove('btn-danger');
        graphButton.classList.add('btn-outline-danger');
        listButton.classList.remove('btn-outline-danger');
        listButton.classList.add('btn-danger');
        graphContainer.style.display = 'none';
        listContainer.style.display = 'block';
    }
}