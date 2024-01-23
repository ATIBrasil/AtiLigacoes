export function criarNumeracaoPaginas(
  chamadasParaExibir,
  numeracaoPaginasContainer,
  totalChamadas,
  paginaAtual,
  itensPorPagina
) {
  if (!numeracaoPaginasContainer) {
    return;
  }

  numeracaoPaginasContainer.innerHTML = "";

  const numeroDePaginas = Math.ceil(totalChamadas / itensPorPagina);
  const maxPaginasExibidas = 10;
  const paginaAntesDoPonto = 5;
  const paginaDepoisDoPonto = numeroDePaginas - 4;

  const criarBotao = (label, numeroPagina) => {
    const button = document.createElement("button");
    button.textContent = label;
    button.addEventListener("click", () => {
      paginaAtual = numeroPagina;
      renderizarTabela(chamadasParaExibir);
      atualizarBotoesPaginacao(paginaAtual, numeroDePaginas);
    });
    return button;
  };

  const inicioButton = criarBotao("Início", 1);
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
    const button = criarBotao(i < 10 ? `0${i}` : `${i}`, i);
    numeracaoPaginasContainer.appendChild(button);
  }

  const finalButton = criarBotao("Final", numeroDePaginas);
  numeracaoPaginasContainer.appendChild(finalButton);

  const infoContainer = document.createElement("infoContainer");
  if (infoContainer) {
    const startIndex = (paginaAtual - 1) * itensPorPagina;
    const endIndex = startIndex + itensPorPagina;
    infoContainer.innerHTML = `Items per page: ${itensPorPagina} - ${startIndex + 1} – ${Math.min(
      endIndex,
      totalChamadas
    )} of ${totalChamadas}`;
  }

  atualizarBotoesPaginacao(paginaAtual, numeroDePaginas);
}

export function atualizarBotoesPaginacao(
  paginaAtual,
  numeroDePaginas,
  containerBotoes
) {
  if (containerBotoes) {
    containerBotoes.innerHTML = "";

    if (paginaAtual > 1) {
      const btnAnterior = document.createElement("button");
      btnAnterior.textContent = "Anterior";
      btnAnterior.addEventListener("click", () => {
        callService.paginaAnterior();
        filtroAtual();
      });
      containerBotoes.appendChild(btnAnterior);
    }

    if (paginaAtual < numeroDePaginas) {
      const btnProxima = document.createElement("button");
      btnProxima.textContent = "Próxima";
      btnProxima.addEventListener("click", () => {
        callService.proximaPagina();
        filtroAtual();
      });
      containerBotoes.appendChild(btnProxima);
    }
  }
}