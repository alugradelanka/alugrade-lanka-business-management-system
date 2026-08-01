class ChartManager {
    constructor() {
        this.charts = {};
        this.CHART_COLORS = ['#C41230', '#1A1A1A', '#60A5FA', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6'];
        this.defaultFont = 'Inter, sans-serif';
    }

    getDefaultOptions(customOptions = {}) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 600,
                easing: 'easeOutQuart'
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            family: this.defaultFont
                        },
                        usePointStyle: true,
                        boxWidth: 8
                    }
                },
                tooltip: {
                    backgroundColor: '#1A1A1A',
                    titleFont: { family: this.defaultFont, size: 13 },
                    bodyFont: { family: this.defaultFont, size: 12 },
                    padding: 10,
                    cornerRadius: 6,
                    displayColors: true,
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1
                }
            },
            ...customOptions
        };
    }

    getGridOptions() {
        return {
            grid: {
                color: 'rgba(0,0,0,0.05)',
                drawBorder: false,
            },
            ticks: {
                font: {
                    family: this.defaultFont
                },
                color: '#6b7280'
            }
        };
    }

    createBarChart(canvasId, labels, datasets, options = {}) {
        this.destroyChart(canvasId);
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const config = {
            type: 'bar',
            data: { labels, datasets },
            options: this.getDefaultOptions({
                scales: {
                    x: this.getGridOptions(),
                    y: { ...this.getGridOptions(), beginAtZero: true }
                },
                ...options
            })
        };

        this.charts[canvasId] = new Chart(ctx, config);
        return this.charts[canvasId];
    }

    createLineChart(canvasId, labels, datasets, options = {}) {
        this.destroyChart(canvasId);
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        datasets = datasets.map(ds => ({
            ...ds,
            tension: 0.4, // smooth curves
            pointRadius: 4,
            pointHoverRadius: 6
        }));

        const config = {
            type: 'line',
            data: { labels, datasets },
            options: this.getDefaultOptions({
                scales: {
                    x: this.getGridOptions(),
                    y: { ...this.getGridOptions(), beginAtZero: true }
                },
                ...options
            })
        };

        this.charts[canvasId] = new Chart(ctx, config);
        return this.charts[canvasId];
    }

    createAreaChart(canvasId, labels, datasets, options = {}) {
        this.destroyChart(canvasId);
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        datasets = datasets.map(ds => ({
            ...ds,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6
        }));

        const config = {
            type: 'line',
            data: { labels, datasets },
            options: this.getDefaultOptions({
                scales: {
                    x: this.getGridOptions(),
                    y: { ...this.getGridOptions(), beginAtZero: true }
                },
                ...options
            })
        };

        this.charts[canvasId] = new Chart(ctx, config);
        return this.charts[canvasId];
    }

    createDoughnutChart(canvasId, labels, data, colors = null, options = {}) {
        this.destroyChart(canvasId);
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const config = {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: colors || this.CHART_COLORS,
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: this.getDefaultOptions({
                cutout: '70%',
                ...options
            })
        };

        this.charts[canvasId] = new Chart(ctx, config);
        return this.charts[canvasId];
    }

    createPieChart(canvasId, labels, data, colors = null, options = {}) {
        this.destroyChart(canvasId);
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const config = {
            type: 'pie',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: colors || this.CHART_COLORS,
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: this.getDefaultOptions(options)
        };

        this.charts[canvasId] = new Chart(ctx, config);
        return this.charts[canvasId];
    }

    createHorizontalBarChart(canvasId, labels, data, options = {}) {
        this.destroyChart(canvasId);
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const config = {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: this.CHART_COLORS[0],
                    borderRadius: 4
                }]
            },
            options: this.getDefaultOptions({
                indexAxis: 'y',
                scales: {
                    x: { ...this.getGridOptions(), beginAtZero: true },
                    y: this.getGridOptions()
                },
                plugins: {
                    legend: { display: false },
                    ...options.plugins
                },
                ...options
            })
        };

        this.charts[canvasId] = new Chart(ctx, config);
        return this.charts[canvasId];
    }

    updateChart(canvasId, labels, datasetsData) {
        const chart = this.charts[canvasId];
        if (!chart) return;
        
        if (labels) {
            chart.data.labels = labels;
        }
        
        if (datasetsData) {
            chart.data.datasets.forEach((dataset, i) => {
                if (datasetsData[i]) {
                    dataset.data = datasetsData[i].data || datasetsData[i];
                }
            });
        }
        
        chart.update();
    }

    destroyChart(canvasId) {
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
            delete this.charts[canvasId];
        }
    }

    destroyAll() {
        Object.keys(this.charts).forEach(canvasId => {
            this.destroyChart(canvasId);
        });
    }
}

window.ChartManager = ChartManager;

