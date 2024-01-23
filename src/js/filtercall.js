import { numeracaoPaginasContainer, renderizarTabela } from "./chamadas";
import {
  LoadingATI,
  EsconderLoadingATI,
  LoadingDonwload,
  EsconderLoadingDonwload,
  exibirHTML,
  ocultarHTML,
} from "./loading";

let callService;

class CallService {
  constructor() {
    this._callUrl = "https://apigravadorvmc.voicemanager.cloud/api/getcalls";
    this._callFilterUrl =
      "https://apigravadorvmc.voicemanager.cloud/api/getcallsfilter";
    this.token = localStorage.getItem("token");
    this.paginaAtual = 1;
    this.itensPorPagina = 10;
    this.numeroTotalDePaginas = 1;
    this.dadosFiltrados = []; // Inicializar dadosFiltrados como uma array vazia
  }

  criarBotaoPagina(texto, clickHandler) {
    const botaoPagina = document.createElement("button");
    botaoPagina.textContent = texto;
    botaoPagina.addEventListener("click", clickHandler);
    return botaoPagina;
  }

  criarBotoesPaginacao(containerBotoes) {
    const numeracaoPaginas = document.createElement("span");
    numeracaoPaginas.id = "numeracaoPaginas";

    if (containerBotoes) {
      // Limpar o conteúdo do contêiner de botões
      containerBotoes.innerHTML = "";

      // Criar botão de página anterior
      const btnPaginaAnterior = this.criarBotaoPagina("Anterior", () => this.paginaAnterior());
      btnPaginaAnterior.disabled = this.paginaAtual === 1;
      containerBotoes.appendChild(btnPaginaAnterior);

      // Adicionar o elemento para a numeração das páginas
      containerBotoes.appendChild(numeracaoPaginas);

      // Criar botão de página seguinte
      const btnPaginaSeguinte = this.criarBotaoPagina("Próxima", () => this.proximaPagina());
      btnPaginaSeguinte.disabled = this.paginaAtual === this.numeroTotalDePaginas;
      containerBotoes.appendChild(btnPaginaSeguinte);

      // Atualizar numeração das páginas
      numeracaoPaginas.innerHTML = `Página ${this.paginaAtual} de ${this.numeroTotalDePaginas}`;
    }
  }

  async renderizarDados() {
    const tabelaChamadas = document.querySelector(".recent-orders table tbody");
    const numeracaoPaginas = document.getElementById("numeracaoPaginas");

    tabelaChamadas.classList.add("esconder-tabela");

    try {
      // Certificar-se de que this.dadosFiltrados está definido e é uma array
      if (!Array.isArray(this.dadosFiltrados)) {
        throw new Error("Dados filtrados inválidos.");
      }

      const startIndex = (this.paginaAtual - 1) * this.itensPorPagina;
      const endIndex = startIndex + this.itensPorPagina;
      const dadosPaginados = this.dadosFiltrados.slice(startIndex, endIndex);

      tabelaChamadas.innerHTML = "";
      renderizarTabela(dadosPaginados);

      tabelaChamadas.classList.remove("esconder-tabela");

      // Atualizar o número total de páginas
      this.numeroTotalDePaginas = Math.ceil(this.dadosFiltrados.length / this.itensPorPagina);

      // Exibir numeração das páginas
      if (numeracaoPaginas) {
        numeracaoPaginas.innerHTML = `Página ${this.paginaAtual} de ${this.numeroTotalDePaginas}`;
      }

      // Criar botões de próxima e anterior dinamicamente
      const containerBotoes = document.getElementById("containerBotoesPaginacao");
      this.criarBotoesPaginacao(containerBotoes);
    } catch (error) {
      console.error("Erro ao renderizar dados:", error.message || error);
    }
  }

  proximaPagina() {
    if (this.paginaAtual < this.numeroTotalDePaginas) {
      this.paginaAtual++;
      
      this.renderizarDados();
    }
  }

  paginaAnterior() {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;      
      this.renderizarDados();
    }
  }

  async getCalls() {
    try {
      const response = await fetch(this._callUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
          `Erro na requisição: ${response.status} - ${response.statusText} - ${errorMessage}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao obter chamadas:", error.message || error);
      throw error;
    } finally {
      EsconderLoadingATI();
    }
  }

  async getCallsFilter(data, userid) {
    try {
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${this.token}`);
      headers.append("Content-Type", "application/json");
      headers.append("Accept", "application/json, text/plain, */*");
      headers.append("data", data || "");
      headers.append("userid", userid || "");

      const response = await fetch(this._callFilterUrl, {
        method: "GET",
        headers: headers,
      });

      if (!response.ok) {
        throw new Error(
          `Erro na requisição: ${response.status} - ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(
        "Erro ao obter chamadas com filtro:",
        error.message || error
      );
      throw error;
    } finally {
      EsconderLoadingATI();
    }
  }
}

function criarBotaoPagina(texto, clickHandler) {
  const botaoPagina = document.createElement("button");
  botaoPagina.textContent = texto;
  botaoPagina.addEventListener("click", clickHandler);
  return botaoPagina;
}

async function filtroAtual() {
  const tabelaChamadas = document.querySelector(".recent-orders table tbody");
  if (tabelaChamadas) {
    tabelaChamadas.classList.add("esconder-tabela");
  }

  LoadingATI();
  // Removendo a declaração local de callService
  callService = new CallService();
  try {
    const data = document.getElementById("calendario").value;
    const userid = document.querySelector(".search-txt").value;

    const filteredCalls = await callService.getCallsFilter(
      data,
      userid.substring(0, 4)
    );

    // Armazene os dados filtrados na instância de CallService
    callService.dadosFiltrados = filteredCalls;

    // Adicione a lógica para exibir/ocultar os botões com base na página atual e no número total de páginas
    const numeracaoPaginas = document.getElementById("numeracaoPaginas");
    const containerBotoes = document.getElementById("containerBotoesPaginacao");
    callService.criarBotoesPaginacao(containerBotoes);
    // Crie os botões de paginação usando document.createElement
    numeracaoPaginas.innerHTML = "";

    for (let i = 1; i <= callService.numeroTotalDePaginas; i++) {
      const button = criarBotaoPagina(i.toString(), () => {
        callService.paginaAtual = i;
        callService.renderizarDados();
      });
      numeracaoPaginas.appendChild(button);
    }

    // Chame a função renderizarDados passando os botões como argumentos
    await callService.renderizarDados();

  } catch (error) {
    console.error("Erro na requisição:", error.message || error);
  } finally {
    EsconderLoadingATI();
    if (tabelaChamadas) {
      tabelaChamadas.classList.remove("esconder-tabela");
    }
  }
}

document.getElementById("botaoFiltrar").addEventListener("click", filtroAtual);

async function baixarChamadasFiltradas(callService, dataFiltro, ramalFiltro) {
  LoadingDonwload();
  try {
    const chamadasFiltradas = await callService.getCallsFilter(
      dataFiltro,
      ramalFiltro.substring(0, 4)
    );

    const downloadPromises = chamadasFiltradas.map(async (chamada) => {
      await baixarChamada(
        chamada.pathFile,
        callService.token,
        chamada.grupo,
        chamada.userID,
        chamada.iniDT,
        chamada.iniHR
      );
    });

    await Promise.all(downloadPromises);
  } catch (error) {
    console.error(
      "Erro no download das chamadas filtradas:",
      error.message || error
    );
  } finally {
    EsconderLoadingDonwload();
  }
}

document
  .getElementById("botaoDownloadTotal")
  .addEventListener("click", async function () {
    try {
      const callService = new CallService();
      const dataFiltro = document.getElementById("calendario").value;
      const ramalFiltro = document.querySelector(".search-txt").value;

      ocultarHTML();
      await baixarChamadasFiltradas(callService, dataFiltro, ramalFiltro);
      exibirHTML();
    } catch (error) {
      console.error("Erro no download total:", error.message || error);
    }
  });
