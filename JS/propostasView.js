let currentPage = 0;
const pageSize = 10;

async function fetchPropostas(page = 0) {
    try {
        const response = await fetch(`http://localhost:8080/proposta/paginas?page=${page}&size=${pageSize}&sort=id,desc`);
        const propostas = await response.json();

        const propostasBody = document.getElementById('propostasBody');
        propostasBody.innerHTML = '';

        propostas.forEach(proposta => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${proposta.dataDeProposta}</td>
                <td>${proposta.valor}</td>
                <td>${proposta.parcelas}</td>
                <td>${proposta.nomeVendedor}</td>
                <td>${proposta.nomeCliente}</td>
                <td>${proposta.cpfCliente}</td>
                <td>${proposta.estadoProposta}</td>
            `;
            propostasBody.appendChild(tr);
        });

        document.getElementById('currentPage').textContent = page + 1;
        document.getElementById('paginationInfo').textContent = `Página ${page + 1}`;

        const loading = document.getElementById('loading');
        if (loading) loading.style.display = 'none';

        const table = document.getElementById('propostasTable');
        if (table) table.style.display = 'table';

        document.getElementById('prevPage').disabled = page === 0;
        document.getElementById('nextPage').disabled = propostas.length < pageSize;

        currentPage = page;

    } catch (error) {
        console.error('Erro ao buscar propostas:');
    }
}

document.getElementById('nextPage').addEventListener('click', () => {
    fetchPropostas(currentPage + 1);
});

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 0) {
        fetchPropostas(currentPage - 1);
    }
});


window.onload = () => fetchPropostas();
