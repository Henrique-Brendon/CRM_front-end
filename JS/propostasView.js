let currentPage = 0;
const pageSize = 10;

async function fetchPropostas(page = 0) {
    try {
        const response = await fetch(`http://localhost:8081/proposta/paginas?page=${page}&size=${pageSize}&sort=id,desc`);
        const propostas = await response.json();

        const propostasBody = document.getElementById('propostasBody');
        propostasBody.innerHTML = '';

        propostas.forEach(proposta => {
            const tr = document.createElement('tr');

            // Definir cor da fonte para estadoProposta
            let estadoCor = '';
            switch (proposta.estadoProposta) {
                case 'PAGO':
                    estadoCor = 'color: rgba(0, 128, 0, 0.6);'; // verde com opacidade
                    break;
                case 'NÃO_PAGO':
                    estadoCor = 'color: rgba(255, 215, 0, 0.6);'; // amarelo claro com opacidade
                    break;
                case 'EM_AGUARDO':
                    estadoCor = 'color: rgba(255, 140, 0, 0.6);'; // laranja forte com opacidade
                    break;
                default:
                    estadoCor = 'color: rgba(128, 128, 128, 0.5);'; // cinza
            }

            tr.innerHTML = `
                <td>${proposta.dataDeProposta}</td>
                <td><span style="color: green;">${proposta.valor}</span></td>
                <td><span style="color: green;">${proposta.parcelas}</span></td>
                <td>${proposta.nomeVendedor}</td>
                <td>${proposta.nomeCliente}</td>
                <td>${proposta.cpfCliente}</td>
                <td><span style="${estadoCor} font-weight: bold;">${proposta.estadoProposta}</span></td>
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
        console.error('Erro ao buscar propostas:', error);
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

document.addEventListener('DOMContentLoaded', function () {
  const btnNovoCliente = document.querySelector('.container-propostas button');
  const painel = document.getElementById('novoClientePanel');
  const btnFechar = document.getElementById('fecharPanel');

  btnNovoCliente.addEventListener('click', () => {
    painel.classList.add('open');
  });

  btnFechar.addEventListener('click', () => {
    painel.classList.remove('open');
  });
});


let enderecoBuscado = {}; // Objeto global para armazenar endereço

function formatarDataParaBR(dataISO) {
  if (!dataISO) return "";
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

async function buscarEndereco() {
  const cep = document.getElementById("cep").value.replace(/\D/g, '');

  if (!cep) return;

  try {
    const response = await fetch(`http://localhost:8081/cep/localizarEndereco?cep=${cep}`);
    if (!response.ok) throw new Error("Endereço não encontrado.");

    const data = await response.json();

    document.getElementById("estado").value = data.estado;
    document.getElementById("cidade").value = data.cidade;
    document.getElementById("bairro").value = data.bairro;
    document.getElementById("endereco").value = data.endereco;

    // Guarda os dados para uso posterior
    enderecoBuscado = {
      estado: data.estado,
      cidade: data.cidade,
      bairro: data.bairro,
      endereco: data.endereco
    };

  } catch (error) {
    alert("Erro ao buscar endereço: " + error.message);
  }
}

// Seleção de vendedor
document.getElementById('btnSelecionarVendedor').addEventListener('click', function () {
  document.getElementById('vendedorOpcoes').classList.toggle('hidden');
});

document.querySelectorAll('#vendedorOpcoes button').forEach(button => {
  button.addEventListener('click', function () {
    const id = this.getAttribute('data-id');
    const nome = this.getAttribute('data-nome');

    document.getElementById('vendedorSelecionado').value = id;
    document.getElementById('vendedorSelecionadoLabel').textContent = `Vendedor selecionado: ${nome}`;
    document.getElementById('vendedorOpcoes').classList.add('hidden');
  });
});

// Envio da proposta
document.querySelector('.formulario-cliente').addEventListener('submit', function (event) {
  event.preventDefault();

  const proposta = {
    nomeCliente: document.getElementById('nome').value,
    dataNascimentoCliente: formatarDataParaBR(document.getElementById('dataNascimento').value),
    emailCliente: document.getElementById('email').value,
    rgCliente: document.getElementById('rg').value,
    cpfCliente: document.getElementById('cpf').value,
    cepCliente: document.getElementById('cep').value,
    estadoCliente: enderecoBuscado.estado || document.getElementById('estado').value,
    cidadeCliente: enderecoBuscado.cidade || document.getElementById('cidade').value,
    bairroCliente: enderecoBuscado.bairro || document.getElementById('bairro').value,
    enderecoCliente: enderecoBuscado.endereco || document.getElementById('endereco').value,
    numCasaCliente: document.getElementById('numero').value,
    dataDeProposta: formatarDataParaBR(document.getElementById('dataProposta').value),
    valor: document.getElementById('valor').value,
    parcelas: document.getElementById('parcelas').value,
    estadoProposta: document.getElementById('estadoProposta').value
  };

  const vendedorId = document.getElementById('vendedorSelecionado').value;

  fetch(`http://localhost:8080/proposta/novaProposta/${vendedorId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(proposta)
  })
    .then(response => {
      if (!response.ok) throw new Error("Erro ao salvar proposta");
      return response.json();
    })
    .then(data => {
      console.log("Proposta salva com sucesso:", data);
      alert("Proposta enviada com sucesso!");
    })
    .catch(error => {
      console.error("Erro:", error.message);
      alert("Erro ao enviar proposta.");
    });
});
