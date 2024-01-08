import { obterChamadas, esconderLoading, mostrarLoading } from "./chamadas";

const paginaAtual = 1;
const usuariosPorPagina = 3;
const IMAGEM_PADRAO = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxWcQF3mfUC16jH-Ja4m6PK-L2zVXXwJq7nR3sMKbwXQ&s";

async function encontrarUsuariosPorNumeroDeChamadas() {
  const userListContainer = document.getElementById("userList");

  if (!userListContainer) {
    console.error("Elemento HTML 'userList' não encontrado. Certifique-se de que o ID está correto.");
    return;
  }

  async function obterEOrdenarChamadas() {
    try {
      const chamadas = await obterChamadas();
      const usuariosInfo = {};

      chamadas.forEach(({ userID, dst }) => {
        const userIDPrefixo = userID.substring(0, 4);

        if (!usuariosInfo[userIDPrefixo]) {
          usuariosInfo[userIDPrefixo] = {
            Ramal: userIDPrefixo,
            TotalDeChamadas: 0,
            Interagiu: "",
            NumeroDeInterações: 0,
            dstContagem: {},
            imagem: IMAGEM_PADRAO,
            "Minutos total da interação": "Não disponível",
          };
        }
       
        usuariosInfo[userIDPrefixo].TotalDeChamadas += 1;

        if (!usuariosInfo[userIDPrefixo].dstContagem[dst]) {
          usuariosInfo[userIDPrefixo].dstContagem[dst] = 1;
        } else {
          usuariosInfo[userIDPrefixo].dstContagem[dst] += 1;
        }

        if (usuariosInfo[userIDPrefixo].dstContagem[dst] > usuariosInfo[userIDPrefixo].NumeroDeInterações) {
          usuariosInfo[userIDPrefixo].Interagiu = dst !== undefined ? dst : "";
          usuariosInfo[userIDPrefixo].NumeroDeInterações = usuariosInfo[userIDPrefixo].dstContagem[dst];
        }

        // Adicione o console.log para mostrar as interações
        
      });

      return Object.values(usuariosInfo).sort((a, b) => b.TotalDeChamadas - a.TotalDeChamadas);
      
    } catch (error) {
      throw new Error("Erro ao obter e ordenar chamadas: " + error.message);
    }
  }

  async function obterChamadasUsuario(userID) {
    try {
      const chamadas = await obterChamadas();
      return chamadas.filter((chamada) => chamada.userID.substring(0, 4) === userID);
    } catch (error) {
      throw new Error("Erro ao obter chamadas do usuário: " + error.message);
    }
  }

  async function renderizarUsuarios() {
    try {
      const listaUsuariosOrdenada = await obterEOrdenarChamadas();
      userListContainer.innerHTML = "";

      const startIndex = (paginaAtual - 1) * usuariosPorPagina;
      const endIndex = startIndex + usuariosPorPagina;

      let totalNumeroDeInterações = 0;
      let chamadasUsuarioMaiorInteração = null;

      for (let i = startIndex; i < endIndex && i < listaUsuariosOrdenada.length; i++) {
        const usuario = listaUsuariosOrdenada[i];
        const usuarioContainer = document.createElement("div");
        usuarioContainer.classList.add("usuarioContainer");
       
        const imagemDiv = document.createElement("div");
        const imagemElement = document.createElement("img");
        imagemElement.src = usuario.imagem;
        imagemElement.alt = "Imagem do usuário";
        imagemElement.classList.add("img");
        imagemDiv.appendChild(imagemElement);
        imagemDiv.classList.add("imagemDiv");

        const infoDiv = document.createElement("div");
        infoDiv.classList.add("user-info");

        for (const [campo, valor] of Object.entries(usuario)) {
          if (campo !== "imagem" && campo !== "horasDeInteracao") {
            const campoElement = document.createElement("p");

            if (campo === "dstContagem") {
              // Mantenha comentado se não desejar exibir dstContagem
            } else if (campo === "NumeroDeInterações") {
              campoElement.innerHTML = `<strong>${campo}:</strong> ${valor}`;

              if (valor > totalNumeroDeInterações) {
                totalNumeroDeInterações = valor;
                chamadasUsuarioMaiorInteração = await obterChamadasUsuario(usuario.Ramal);
              }
            } else {
              campoElement.innerHTML = `<strong>${campo}:</strong> ${valor}`;
            }

            infoDiv.appendChild(campoElement);
          }
        }

        usuarioContainer.appendChild(imagemDiv);
        usuarioContainer.appendChild(infoDiv);
        usuarioContainer.classList.add("user-container");
        userListContainer.appendChild(usuarioContainer);
      }
    } catch (error) {
      console.error("Erro ao renderizar usuários:", error.message);
    } finally {
      esconderLoading();
    }
  }

  renderizarUsuarios();
}

mostrarLoading();
encontrarUsuariosPorNumeroDeChamadas();