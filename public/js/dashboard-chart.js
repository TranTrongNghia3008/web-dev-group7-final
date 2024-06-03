// Dữ liệu cho biểu đồ
var data = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Day 9', 'Day 10'],
    datasets: [{
        label: 'Activity Number',
        backgroundColor: 'red',
        borderColor: 'black',
        data: [15, 10, 20, 18, 25, 22, 30, 12, 20, 0]
    }]
};

// Tạo biểu đồ
var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: data,
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