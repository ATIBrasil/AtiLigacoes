import { fazerLogin } from "./login";
import { LoadingDonwload } from './loading';


export let paginaAtual = 1;
export const itensPorPagina = 10;
export let numeracaoPaginasContainer;
export let totalChamadas;


numeracaoPaginasContainer = document.getElementById("numeracaoPaginas");

export async function obterChamadas(callback, userIDFiltro, iniDTFiltro) {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      await fazerLogin();
    }

    const url = `https://apigravadorvmc.voicemanager.cloud/api/getcalls`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "If-None-Match": 'W/"31100-Jl07+AniNyw0VMeYw47PwrR0k4A"',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Erro na requisição: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();

    totalChamadas = data.length;

    if (callback && typeof callback === "function") {
      callback(data, token, userIDFiltro, iniDTFiltro, numeracaoPaginasContainer);
    }

    return data;
  } catch (error) {
    console.error("Erro ao obter chamadas:", error.message || error);
    throw error;
  }
}

export function renderizarTabela(dados, token, userIDFiltro, iniDTFiltro) {
  const tabelaChamadas = document.querySelector(".recent-orders table tbody");

  if (!tabelaChamadas) {
    console.error("Elemento da tabela não encontrado.");
    return;
  }

  while (tabelaChamadas.firstChild) {
    tabelaChamadas.removeChild(tabelaChamadas.firstChild);
  }

  const startIndex = (paginaAtual - 1) * itensPorPagina;
  const endIndex = startIndex + itensPorPagina;
  const chamadasParaExibir = dados.slice(startIndex, endIndex);

  chamadasParaExibir.forEach((chamada) => {
    const userIDPrefixo = chamada.userID.substring(0, 4);

    if (
      (!userIDFiltro || userIDPrefixo.includes(userIDFiltro)) &&
      (!iniDTFiltro || chamada.iniDT.trim() === iniDTFiltro.trim())
    ) {
      const tr = createTableRow(chamada, token);
      tabelaChamadas.appendChild(tr);
    }
  });

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
    <td><button class="download" onclick="baixarChamada('${
      chamada.pathFile
    }', '${token}', '${chamada.grupo}', '${chamada.userID}', '${
    chamada.iniDT
  }', '${chamada.iniHR}')">Download</button></td>
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

function baixarChamada(pathFile, token, grupo, userID, iniDT, iniHR) {
  const nomeArquivo = `${userID.substring(
    0,
    4
  )}_${grupo}_${iniDT}_${iniHR.substring(0, 5)}.wav`;
  LoadingDonwload();
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
