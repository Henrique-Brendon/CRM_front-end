let currentClientesPage = 0;
const clientesPageSize = 10;

async function carregarClientes(page = 0) {
    try {
        const response = await fetch(`http://localhost:8080/cliente/paginas?page=${page}&size=${clientesPageSize}&sort=id,desc`);
        const clientes = await response.json();

        const clientesBody = document.getElementById('clientesBody');
        clientesBody.innerHTML = '';

        clientes.forEach(cliente => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${cliente.nome}</td>
                <td>${cliente.dataNascimento}</td>
                <td>${cliente.email}</td>
                <td>${cliente.rg}</td>
                <td>${cliente.cpf}</td>
            `;
            clientesBody.appendChild(tr);
        });

        document.getElementById('currentClientesPage').textContent = page + 1;
        document.getElementById('paginationClientesInfo').textContent = `Página ${page + 1}`;

        const loadingClientes = document.getElementById('loadingClientes');
        if (loadingClientes) loadingClientes.style.display = 'none';

        const tableClientes = document.getElementById('clientesTable');
        if (tableClientes) tableClientes.style.display = 'table';

        document.getElementById('prevClientesPage').disabled = page === 0;
        document.getElementById('nextClientesPage').disabled = clientes.length < clientesPageSize;

        currentClientesPage = page;

    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
    }
}

document.getElementById('nextClientesPage').addEventListener('click', () => {
    carregarClientes(currentClientesPage + 1);
});

document.getElementById('prevClientesPage').addEventListener('click', () => {
    if (currentClientesPage > 0) {
        carregarClientes(currentClientesPage - 1);
    }
});
