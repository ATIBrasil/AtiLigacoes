// loading.js
export function LoadingATI() {
 
  const loadingContainer = document.getElementById("loadingContainer");
  if (loadingContainer) {
    loadingContainer.style.display = "flex";
  }
}
export function EsconderLoadingATI() {
 
  const loadingContainer = document.getElementById("loadingContainer");
  if (loadingContainer) {
    loadingContainer.style.display = "none"; // Oculta o contêiner de carregamento
  }
}

export function LoadingDonwload() {
  const loadingContainer2 = document.getElementById("loading-container2");
  if (loadingContainer2) {
    loadingContainer2.style.display = "flex"; // Mostra o contêiner de carregamento
  }
}

export function EsconderLoadingDonwload() {
  const loadingContainer2 = document.getElementById("loading-container2");
  if (loadingContainer2) {
    loadingContainer2.style.display = "none"; // Oculta o contêiner de carregamento
  }
}

export function exibirHTML() {
  // Adapte isso conforme a estrutura real do seu HTML
  const elementosHTMLParaExibir = document.querySelectorAll('.recent-orders table tbody');
  elementosHTMLParaExibir.forEach(elemento => {
    elemento.style.display = '';
  });
}

export function ocultarHTML() {
  // Adapte isso conforme a estrutura real do seu HTML
  const elementosHTMLParaOcultar = document.querySelectorAll('.recent-orders table tbody');
  elementosHTMLParaOcultar.forEach(elemento => {
    elemento.style.display = 'none';
  });
}

