// Declare as variáveis de filtro no escopo global
let filtroUserID = "";
let filtroData = "";
let dataLimite;
let chamadasFiltradas;

// Função para obter chamadas usando o token de login
function obterChamadas(token) {
  fetch("https://apigravadorvmc.voicemanager.cloud/api/getcallsfilter", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data)) {
        exibirChamadasNaUI(data, token);

        // Agora que você obteve as chamadas, você pode habilitar o botão para baixar todas
        document.getElementById("botaoDownloadTodas").disabled = false;
      } else {
        console.error(
          "Dados de chamadas ausentes ou no formato incorreto:",
          data
        );
      }
    })
    .catch((error) => {
      console.error("Erro ao obter chamadas:", error);
    });
}

// Função para fazer login e obter token
 function fazerLogin() {
  var login = "ati.gravador";
  var password = "SLFDjmgfih@#erjkdfDSFds1233";

  fetch("https://apigravadorvmc.voicemanager.cloud/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ login: login, password: password }),
  })
    .then((response) => response.json())
    .then((data) => {
      obterChamadas(data.token);

      // Adicione um ouvinte de evento de clique ao botão
      document
        .getElementById("botaoDownloadTodas")
        .addEventListener("click", function () {
          // Supondo que você já tenha obtido o filtroUserID e filtroData
          const filtroUserID = "exemploUserID";
          const filtroData = "exemploData";

          // Chama a função para baixar todas as chamadas, passando o filtroUserID, filtroData e o token
          baixarTodasChamadas(this, data.token, filtroUserID, filtroData);
        });
    })
    .catch((error) => {
      console.error("Erro ao fazer login:", error);
    });
}

// Função para exibir chamadas na interface do usuário
function exibirChamadasNaUI(chamadas, token) {
  const tabelaChamadas = document.querySelector(".recent-orders table tbody");
  const limiteExibicaoInicial = 10;
  let limiteExibicaoAtual = limiteExibicaoInicial;

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
      <td><a href="#" onclick="baixarChamada('${
        chamada.pathFile
      }', '${token}')">Download</a></td>
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

  function limparTabela() {
    tabelaChamadas.innerHTML = ""; // Limpa a tabela removendo todos os elementos filhos
  }

  function adicionarBotoesExibicao(chamadas) {
    if (chamadas.length > limiteExibicaoAtual) {
      const exibirMaisButton = createButton("Mostrar Mais");
      exibirMaisButton.addEventListener("click", function () {
        limiteExibicaoAtual += limiteExibicaoInicial;
        atualizarTabela(chamadas);
      });

      tabelaChamadas.appendChild(
        createRowWithColspan(createCell(exibirMaisButton), 7)
      );
    }
  }

  function createButton(text) {
    const button = document.createElement("button");
    button.textContent = text;
    return button;
  }

  function createRowWithColspan(cell, colspan) {
    const tr = document.createElement("tr");
    cell.colSpan = colspan;
    tr.appendChild(cell);
    return tr;
  }

  function createCell(element) {
    const td = document.createElement("td");
    td.appendChild(element);
    return td;
  }

  function formatarData(data) {
    // Converte o formato da data da API para "YYYY-MM-DD"
    const partes = data.split("/");
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  }

  function filtrarChamadas() {
    filtroUserID = inputDestinatario.value.toLowerCase();
    filtroData = inputData.value;

    limiteExibicaoAtual = limiteExibicaoInicial;

    // Armazenar chamadas filtradas fora da função
    chamadasFiltradas = chamadas.filter(
      (chamada) =>
        new Date(formatarData(chamada.iniDT)) > dataLimite &&
        chamada.userID.toLowerCase().includes(filtroUserID) &&
        (filtroData ? formatarData(chamada.iniDT).startsWith(filtroData) : true)
    );

    atualizarTabela(chamadasFiltradas);
  }

  function atualizarTabela(chamadas) {
    limparTabela();

    dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - 30);

    const chamadasFiltradas = chamadas.filter(
      (chamada) =>
        new Date(formatarData(chamada.iniDT)) > dataLimite &&
        chamada.userID.toLowerCase().includes(filtroUserID) &&
        (filtroData ? formatarData(chamada.iniDT).startsWith(filtroData) : true)
    );

    chamadasFiltradas
      .slice(0, limiteExibicaoAtual)
      .forEach((chamada) =>
        tabelaChamadas.appendChild(createTableRow(chamada, token))
      );

    adicionarBotoesExibicao(chamadas);
    
    console.log("teste:", chamadas);

    const botaoDownloadTodas = document.getElementById("botaoDownloadTodas");
    
if (botaoDownloadTodas) {
  botaoDownloadTodas.addEventListener("click", function () {
    // Verifique se há alguma chamada filtrada
    if (chamadasFiltradas.length > 0) {
      // Chame a função baixarTodasChamadas com o array inteiro
      baixarTodasChamadas(chamadasFiltradas, token);
    } else {
      console.log("Nenhuma chamada filtrada disponível para download.");
    }
  });
}
  }

  const tbody = document.createElement("tbody");
  tabelaChamadas.appendChild(tbody);

  const inputDestinatario = document.querySelector(
    ".recent-orders .filter .remetente"
  );
  const inputData = document.querySelector(".recent-orders .filter .date");

  inputDestinatario.addEventListener("input", filtrarChamadas);
  inputData.addEventListener("input", filtrarChamadas);

  // Inicializa a tabela com chamadas dos últimos 30 dias
  atualizarTabela(chamadas);
}

// Função para lidar com o clique no botão de download
function baixarChamada(pathFile, token) {
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
      a.download = pathFile + ".wav";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
    .catch((error) => {
      console.error("Erro ao baixar chamada:", error);
    });
  // chamadasBaixadas.push(pathFile);
}

function formatarData(data) {
  const partes = data.split("/");
  return `${partes[2]}-${partes[1]}-${partes[0]}`;
}
// Função para baixar todas as chamadas filtradas
function baixarTodasChamadas(chamadas, token) {
  const botao = document.getElementById("botaoDownloadTodas");
  botao.disabled = true;

  if (typeof chamadas !== "undefined" && chamadas.length > 0) {
    chamadas.forEach((chamada, index) => {
      // Verifica se a chamada atende aos critérios de filtro e ainda não foi baixada
      if (
        new Date(formatarData(chamada.iniDT)) > dataLimite &&
        chamada.userID.toLowerCase().includes(filtroUserID) &&
        (filtroData
          ? formatarData(chamada.iniDT).startsWith(filtroData)
          : true) &&
        !chamada.downloaded
      ) {
        const pathFile = chamada.pathFile;
        const userIDPrefix = chamada.userID.substring(0, 4);
        const horaDPrefix = chamada.iniHR.substring(0, 5);

        const dataFormatada = formatarData(chamada.iniDT);
        const nomeArquivo = `${chamada.grupo}-${userIDPrefix}-${dataFormatada}-${horaDPrefix}.wav`;

        // Construa o URL completo para o download
        const urlDownload = `https://apigravadorvmc.voicemanager.cloud/api/file/${pathFile}`;

        // Adicione o token de autorização ao cabeçalho da requisição
        const headers = {
          Authorization: "Bearer " + token,
        };

        // Realize o download
        fetch(urlDownload, { headers })
          .then((response) => response.blob())
          .then((blob) => {
            // Crie um link temporário e inicie o download
            const url = window.URL.createObjectURL(
              new Blob([blob], { type: "audio/wav" })
            );
            const a = document.createElement("a");
            a.href = url;
            a.download = nomeArquivo; // Use o nome do arquivo desejado
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Marca a chamada como baixada

            // Habilita o botão após o último download
            if (index === chamadas.length - 1) {
              botao.disabled = false;
            }
          })
          .catch((error) => {
            console.error("Erro ao baixar chamada:", error);
            botao.disabled = false; // Habilita o botão em caso de erro
          });
      }
    });
  } else {
    console.error("Erro: Nenhuma chamada disponível para download.");
    botao.disabled = false;
  }
}

fazerLogin();