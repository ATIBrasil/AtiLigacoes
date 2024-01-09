// filtroChamadas.js
import { obterChamadas, renderizarTabela, mostrarLoading, esconderLoading  } from './chamadas';

// Importa as funções e variáveis necessárias de chamadas.jsimport { obterChamadas, renderizarTabela, mostrarLoading, esconderLoading, numeracaoPaginasContainer, totalChamadas } from './chamadas';

document.getElementById('botaoFiltrar').addEventListener('click', function () {
    // Captura os valores dos elementos de entrada
    var dataFiltro = document.querySelector('.date').value;
    var ramalFiltro = document.querySelector('.search-txt').value;

    // Mostra o loading enquanto obtém e filtra as chamadas
    mostrarLoading();

    // Obtém as chamadas filtradas
    obterChamadas(function (dados, token) {
        const chamadasFiltradas = filtrarChamadas(dados, dataFiltro, ramalFiltro);
        console.log(chamadasFiltradas)
        // Renderiza a tabela com as chamadas filtradas
        renderizarTabela(chamadasFiltradas, token);

        // Esconde o loading após renderizar a tabela
        esconderLoading();
    });
});

// Função para filtrar chamadas com base na data e no ramal
function filtrarChamadas(dados, dataFiltro, ramalFiltro) {
    // Declara a variável localmente
    let chamadasFiltradas = dados.filter(function (chamada) {
        const userIDPrefixo = chamada.userID.substring(0, 4);
    
        const matchRamal = !ramalFiltro || userIDPrefixo.includes(ramalFiltro);
    
        // Ajusta o formato da data para considerar "dd/mm/yyyy" ou "yyyy-mm-dd"
        const matchData = !dataFiltro ||
            chamada.iniDT.trim() === dataFiltro.trim() ||
            chamada.iniDT.split('/').reverse().join('-') === dataFiltro;
    
        // Remove a segunda verificação desnecessária de matchUserID
        return matchRamal && matchData;
    });
    
    //console.log('Chamadas Filtradas:', chamadasFiltradas);  // Verifique as chamadas filtradas
    
    return chamadasFiltradas;
}

// Modifique a função baixarChamadasFiltradas para aceitar dataFiltro e ramalFiltro como argumentos
function baixarChamadasFiltradas(dados, token, dataFiltro, ramalFiltro) {
    // Obtém as chamadas filtradas
    const chamadasFiltradas = filtrarChamadas(dados, dataFiltro, ramalFiltro);

    // Itera sobre as chamadas filtradas e baixa cada uma delas
    chamadasFiltradas.forEach((chamada) => {
        baixarChamada(chamada.pathFile, token, chamada.grupo, chamada.userID, chamada.iniDT, chamada.iniHR);
    });
}

// Adicione um botão de download total no seu HTML
// e chame a função baixarChamadasFiltradas passando dataFiltro e ramalFiltro
document.getElementById('botaoDownloadTotal').addEventListener('click', function () {
    // Captura os valores dos elementos de entrada
    var dataFiltro = document.querySelector('.date').value;
    var ramalFiltro = document.querySelector('.search-txt').value;

    mostrarLoading(); // Mostre o loading enquanto baixa as chamadas

    // Obtém as chamadas e realiza o download total
    obterChamadas(function (dados, token) {
        baixarChamadasFiltradas(dados, token, dataFiltro, ramalFiltro);
        esconderLoading(); // Esconde o loading após o download total
    });
});