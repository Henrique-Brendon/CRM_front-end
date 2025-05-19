        const baseURL = 'http://localhost:8080/dashboard';

        async function fetchData(url) {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Erro: ${response.status}`);
                return await response.json();
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        }

        async function renderChartEstado() {
            const data = await fetchData(`${baseURL}/propostas/por-estado`);
            if (!data) return;

            const labels = Object.keys(data);
            const values = Object.values(data);

            const ctx = document.getElementById('chartEstado').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels,
                    datasets: [{
                        label: 'Propostas por Estado',
                        data: values,
                        backgroundColor: '#4CAF50',
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: false },
                        title: { display: false }
                    }
                }
            });
        }

        async function renderChartVendedores() {
            const data = await fetchData(`${baseURL}/ranking-vendedores`);
            if (!data) return;

            const labels = data.map(item => item.nome);
            const values = data.map(item => item.totalVendido);

            const ctx = document.getElementById('chartVendedores').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels,
                    datasets: [{
                        label: 'Total Vendido',
                        data: values,
                        backgroundColor: '#3e95cd',
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    plugins: {
                        legend: { display: false },
                        title: { display: false }
                    }
                }
            });
        }

        async function renderChartFaixaValor() {
            const data = await fetchData(`${baseURL}/propostas/por-faixa-valor`);
            if (!data) return;

            const labels = Object.keys(data);
            const values = Object.values(data);

            const ctx = document.getElementById('chartFaixaValor').getContext('2d');
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels,
                    datasets: [{
                        label: 'Propostas por Faixa de Valor',
                        data: values,
                        backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#FFD700'],
                    }]
                },
                options: {
                    responsive: true
                }
            });
        }

        function loadDashboardCharts() {
            renderChartEstado();
            renderChartVendedores();
            renderChartFaixaValor();
        }

        document.querySelectorAll('.menu-link').forEach(link => {
            link.addEventListener('click', function () {
                const target = this.getAttribute('data-target');
                document.querySelectorAll('.page, .pageProposta').forEach(page => page.style.display = 'none');
                document.getElementById(target).style.display = 'block';
                if (target === 'dashboard') loadDashboardCharts();
            });
        });

        window.addEventListener('DOMContentLoaded', () => {
            const isDashboardVisible = document.getElementById('dashboard').classList.contains('active');
            if (isDashboardVisible) {
                loadDashboardCharts();
            }
        });

            function mostrarSecao(secao) {
        document.getElementById('estado-section').style.display = 'none';
        document.getElementById('vendedores-section').style.display = 'none';
        document.getElementById('faixa-section').style.display = 'none';

        document.querySelectorAll('.dashboard-buttons button').forEach(btn => {
            btn.classList.remove('active');
        });

        if (secao === 'estado') {
            document.getElementById('estado-section').style.display = 'block';
        } else if (secao === 'vendedores') {
            document.getElementById('vendedores-section').style.display = 'block';
        } else if (secao === 'faixa') {
            document.getElementById('faixa-section').style.display = 'block';
        }

        const buttonMap = {
            estado: 0,
            vendedores: 1,
            faixa: 2
        };
        document.querySelectorAll('.dashboard-buttons button')[buttonMap[secao]].classList.add('active');
    }

    mostrarSecao('estado');