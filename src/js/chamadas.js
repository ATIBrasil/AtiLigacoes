// chamadas.js
import { fazerLogin } from './login';

export let paginaAtual = 1;
export const itensPorPagina = 10;
export let numeracaoPaginasContainer;
export let totalChamadas;

const loadingContainer = document.getElementById("loadingContainer");

document.addEventListener('DOMContentLoaded', () => {
    mostrarLoading();
    obterChamadas(renderizarTabela);
});

export async function obterChamadas(callback) {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            await fazerLogin();
        }

        const url = `https://apigravadorvmc.voicemanager.cloud/api/getcalls?page=${paginaAtual}&limit=${itensPorPagina}`;
   
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + token,
            },
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
   
        totalChamadas = data.length;

        if (callback && typeof callback === 'function') {
            esconderLoading();
            callback(data, token);
        }

        return data; // Adicionado o retorno dos dados da API

    } catch (error) {
        esconderLoading();
        console.error("Erro ao obter chamadas:", error.message || error);
        throw error;
    }
}

export function mostrarLoading() {
    loadingContainer.style.display = "block";
}

export function esconderLoading() {
    loadingContainer.style.display = "none";
}

numeracaoPaginasContainer = document.getElementById("numeracaoPaginas");

export function renderizarTabela(dados, token, userIDFiltro, iniDTFiltro) {
    const tabelaChamadas = document.querySelector(".recent-orders table tbody");

    if (!tabelaChamadas) {
        console.error('Elemento da tabela não encontrado.');
        return;
    }

    // Remova os elementos filhos da tabela
    while (tabelaChamadas.firstChild) {
        tabelaChamadas.removeChild(tabelaChamadas.firstChild);
    }

    const startIndex = (paginaAtual - 1) * itensPorPagina;
    const endIndex = startIndex + itensPorPagina;
    const chamadasParaExibir = dados.slice(startIndex, endIndex);

    chamadasParaExibir.forEach(chamada => {
        // Adicionado filtro com base no userID e iniDT
        const userIDPrefixo = chamada.userID.substring(0, 4);

        if ((!userIDFiltro || userIDPrefixo.includes(userIDFiltro)) &&
            (!iniDTFiltro || chamada.iniDT.trim() === iniDTFiltro.trim())) {
            const tr = createTableRow(chamada, token);
            tabelaChamadas.appendChild(tr);
        }
    });

    criarNumeracaoPaginas();
}

function createTableRow(chamada, token) {
    const tr = document.createElement("tr");
    const statusClass = getStatusClass(chamada.status);

    tr.innerHTML = `
        <td>${chamada.grupo}</td>
        <td>${chamada.userID}</td>
        <td>${chamada.dst}</td>
        <td>${chamada.iniHR}</td>
        <td>${chamada.iniDT}</td>
        <td class="${getTipoClass(chamada.tipo)}">${chamada.tipo}</td>
        <td><button class="download" onclick="baixarChamada('${chamada.pathFile}', '${token}', '${chamada.grupo}', '${chamada.userID}', '${chamada.iniDT}', '${chamada.iniHR}')">Download</button></td>
    `;

    tr.classList.add(statusClass);

    return tr;
}

function getStatusClass(status) {
    return status === "Perdida"
        ? "danger"
        : status === "Atendida"
        ? "warning"
        : "primary";
}

function getTipoClass(tipo) {
    return tipo === "saida"
        ? "danger"
        : tipo === "entrada"
        ? "success"
        : "primary";
}

export function criarNumeracaoPaginas() {
    if (!numeracaoPaginasContainer) {
        return;
    }

    numeracaoPaginasContainer.innerHTML = "";

    const numeroDePaginas = Math.ceil(totalChamadas / itensPorPagina);
    const maxPaginasExibidas = 10;
    const paginaAntesDoPonto = 5;
    const paginaDepoisDoPonto = numeroDePaginas - 4;

    const inicioButton = criarBotaoPagina("Início", 1);
    numeracaoPaginasContainer.appendChild(inicioButton);

    let startPage, endPage;

    if (paginaAtual <= paginaAntesDoPonto) {
        startPage = 1;
        endPage = Math.min(maxPaginasExibidas, numeroDePaginas);
    } else if (paginaAtual >= paginaDepoisDoPonto) {
        startPage = Math.max(1, numeroDePaginas - maxPaginasExibidas + 1);
        endPage = numeroDePaginas;
    } else {
        startPage = paginaAtual - Math.floor(maxPaginasExibidas / 2);
        endPage = startPage + maxPaginasExibidas - 1;
    }

    for (let i = startPage; i <= endPage; i++) {
        const button = criarBotaoPagina(i < 10 ? `0${i}` : `${i}`, i);
        numeracaoPaginasContainer.appendChild(button);
    }

    const finalButton = criarBotaoPagina("Final", numeroDePaginas);
    numeracaoPaginasContainer.appendChild(finalButton);

    const infoContainer = document.getElementById("infoContainer");
    if (infoContainer) {
        const startIndex = (paginaAtual - 1) * itensPorPagina;
        const endIndex = startIndex + itensPorPagina;
        infoContainer.innerHTML = `Items per page: ${itensPorPagina} - ${startIndex + 1} – ${Math.min(endIndex, totalChamadas)} of ${totalChamadas}`;
    }
}

function criarBotaoPagina(texto, numero) {
    const button = document.createElement("button");
    button.textContent = texto;
    button.classList.add("pagina-button");
    button.dataset.pagina = numero;

    if (numero === paginaAtual) {
        button.classList.add("pagina-atual");
    }

    button.addEventListener("click", () => mudarPagina(numero));
    return button;
}

function mudarPagina(numero) {
    paginaAtual = numero;
    obterChamadas(renderizarTabela);
}

function baixarChamada(pathFile, token, grupo, userID, iniDT, iniHR) {
    const nomeArquivo = `${grupo}_${userID.substring(0, 4)}_${iniDT}_${iniHR.substring(0, 5)}.wav`;

    const urlDownload = `https://apigravadorvmc.voicemanager.cloud/api/file/${pathFile}`;

    const headers = {
        Authorization: "Bearer " + token,
    };

    fetch(urlDownload, { headers })
        .then((response) => response.blob())
        .then((blob) => {
            const url = window.URL.createObjectURL(
                new Blob([blob], { type: "audio/wav" })
            );
            const a = document.createElement("a");
            a.href = url;
            a.download = nomeArquivo;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        })
        .catch((error) => {
            console.error("Erro ao baixar chamada:", error);
        });
}

window.baixarChamada = baixarChamada;
