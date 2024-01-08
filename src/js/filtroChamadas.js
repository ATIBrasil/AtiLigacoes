// Defina as variáveis no escopo global
let inputDestinatario;
let chamadas = [];
let filtroUserID = "";
let filtroData = "";
let dataLimite;
let chamadasFiltradas;

// Função para formatar a data
function formatarData(data) {
    if (data) {
        const dataArray = data.split('/');
        const dataFormatada = `${dataArray[2]}-${dataArray[1]}-${dataArray[0]}`;
        return dataFormatada;
    } else {
        return null;
    }
}

// Função para limpar a tabela
function limparTabela() {
    const tabelaChamadas = document.querySelector('.recent-orders table tbody');
    
    if (tabelaChamadas) {
        tabelaChamadas.innerHTML = '';
    } else {
        console.warn('Tabela não encontrada para limpeza.');
    }
}

// Função para atualizar a tabela com chamadas filtradas
function atualizarTabela(chamadasFiltradas) {
    const tabelaChamadas = document.querySelector('.recent-orders table tbody');

    chamadasFiltradas.forEach(chamada => {
        const tr = document.createElement('tr');
        const tdID = document.createElement('td');
        tdID.textContent = chamada.id; // Substitua pelo nome da propriedade correta
        // Adicione outras colunas conforme necessário

        tr.appendChild(tdID);
        // Adicione outras células conforme necessário

        tabelaChamadas.appendChild(tr);
    });
}

// Função para buscar chamadas na API
async function buscarChamadasAPI(dataSelecionada) {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Token não encontrado. Redirecionando para a página de login.');
            return;
        }

        // Inicializa a data limite
        dataLimite = new Date();

        // Cria a URL com base nos filtros
        const url = `https://apigravadorvmc.voicemanager.cloud/api/getcallsfilter?page=1&limit=10&iniDT=${formatarData(dataSelecionada)}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + token,
            },
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
        }

        const chamadasAPI = await response.json();

      
       
            // Armazenar chamadas filtradas fora da função
      
        chamadasFiltradas = chamadasAPI.filter(
            chamada =>
                new Date(formatarData(chamada.iniDT)) > dataLimite &&
                chamada.userID.toLowerCase().includes(filtroUserID) &&
                (filtroData ? formatarData(chamada.iniDT).startsWith(filtroData) : true)
        );

        // Atualiza a variável global chamadas com as chamadas filtradas
        chamadas = chamadasFiltradas;
         
        // Atualiza a tabela com as chamadas filtradas
        atualizarTabela(chamadasFiltradas);
        console.log(chamadasFiltradas)
    } catch (error) {
        console.error('Erro ao buscar chamadas na API:', error.message || error);
    }
}

// Função para filtrar chamadas
export function filtrarChamadas() {
    const inputData = document.querySelector('.btn-pesquisa .date');
    inputDestinatario = document.querySelector('.btn-pesquisa .search-txt');

    if (!inputDestinatario || !inputData) {
        console.error('Elementos HTML não encontrados.');
        return;
    }

    const filtroUserID = inputDestinatario.value.toLowerCase();
    const filtroData = inputData.value;

    // Lógica para filtrar chamadas com base nos critérios
    chamadasFiltradas = chamadas.filter(chamada =>
        new Date(formatarData(chamada.iniDT)) > dataLimite &&
        chamada.userID.toLowerCase().includes(filtroUserID) &&
        (filtroData ? formatarData(chamada.iniDT).startsWith(filtroData) : true)
    );
    
    // Limpar a tabela antes de renderizar os dados filtrados
    limparTabela();

    // Atualizar a tabela com as chamadas filtradas
    atualizarTabela(chamadasFiltradas);

    // Exibir o resultado no console
    console.log("Chamadas Filtradas:", chamadasFiltradas);
}

document.addEventListener('DOMContentLoaded', () => {
    const inputData = document.querySelector('.btn-pesquisa .date');
    inputDestinatario = document.querySelector('.btn-pesquisa .search-txt');

    if (!inputData || !inputDestinatario) {
        console.error('Elementos HTML não encontrados.');
        return;
    }

    const botaoFiltrar = document.querySelector('.btn-pesquisa .botaoFiltrar');
    if (botaoFiltrar) {
        botaoFiltrar.addEventListener('click', () => {
            console.log('Botão de Filtrar Clicado');
            const dataSelecionada = inputData.value;

            // Chame a função para buscar chamadas na API
            buscarChamadasAPI(dataSelecionada);
        });
    }
});

// Função para configurar o botão de filtrar
export function configurarBotaoFiltrar() {
    const inputData = document.querySelector('.btn-pesquisa .date');
    inputDestinatario = document.querySelector('.btn-pesquisa .search-txt');

    if (!inputData || !inputDestinatario) {
        console.error('Elementos HTML não encontrados.');
        return;
    }

    const botaoFiltrar = document.querySelector('.btn-pesquisa .botaoFiltrar');
    if (botaoFiltrar) {
        botaoFiltrar.addEventListener('click', () => {
            console.log('Botão de Filtrar Clicado');
            const dataSelecionada = inputData.value;

            // Chame a função para buscar chamadas na API
            buscarChamadasAPI(dataSelecionada);
        });
    }
}

// Inicialize o botão de filtrar
configurarBotaoFiltrar();