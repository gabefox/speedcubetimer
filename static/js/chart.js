let solveChart = null;

function initializeChart() {
    const ctx = document.getElementById('solveChart').getContext('2d');
    
    solveChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Solve Times',
                data: [],
                borderColor: '#00ff9d',
                backgroundColor: 'rgba(0, 255, 157, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#b3b3b3'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#b3b3b3'
                    }
                }
            },
            animation: {
                duration: 750
            }
        }
    });
}

function updateChart(times) {
    if (!solveChart) {
        initializeChart();
    }

    const labels = times.map((_, index) => `Solve ${index + 1}`);
    
    solveChart.data.labels = labels;
    solveChart.data.datasets[0].data = times;
    solveChart.update();
}

// Initialize chart with any existing times
document.addEventListener('DOMContentLoaded', () => {
    const existingTimes = JSON.parse(localStorage.getItem('solveTimes') || '[]');
    if (existingTimes.length > 0) {
        updateChart(existingTimes);
    } else {
        initializeChart();
    }
});
