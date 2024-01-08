import "./ranking.js";

// Função para verificar se o token está presente
function verificarToken() {
  const token = localStorage.getItem('token');
  return !!token; // Retorna true se o token estiver presente, false caso contrário
}

// Função para redirecionar para a página de login
function redirecionarParaLogin() {
  window.location.href = './login.html';  // Substitua pelo caminho completo
}

// Função para carregar o conteúdo da página
function carregarPagina(conteudo) {
  const conteudoDiv = document.getElementById('conteudo');
  conteudoDiv.innerHTML = conteudo;
}

// Função para carregar a página de login
function carregarPaginaLogin() {
  carregarPagina('<h1>Página de Login</h1>');
}

// Função para carregar a página de dashboard
function carregarPaginaDashboard() {
  carregarPagina('<h1>Página de Dashboard</h1>');
}

// Configuração das rotas
routie({
  '/': () => rotearPagina(carregarPaginaLogin),
  '/login': () => rotearPagina(carregarPaginaLogin),
  '/dashboard': () => rotearPaginaProtegida(carregarPaginaDashboard),
  '/historico': () => rotearPaginaProtegida(() => carregarPagina('<h1>Página de Histórico</h1>')),
  // Adicione mais rotas conforme necessário
});

// Função para redirecionar para página protegida ou de login
function rotearPaginaProtegida(callback) {
  if (verificarToken()) {
    callback();
  } else {
    redirecionarParaLogin();
  }
}

// Função para carregar a página atual quando a página carrega
function carregarPaginaAtual() {
  routie(window.location.hash.replace('#', '') || '/');
}

// Inicializa a página atual
window.addEventListener('DOMContentLoaded', carregarPaginaAtual);

// Adicione este evento para garantir que o roteamento funcione mesmo quando a rota é alterada manualmente pelo usuário
window.addEventListener('hashchange', carregarPaginaAtual);


obterChamadas(1, 10);

const sideMenu = document.querySelector('aside');
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');

const darkMode = document.querySelector('.dark-mode');

menuBtn.addEventListener('click', () => {
    sideMenu.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    sideMenu.style.display = 'none';
});

darkMode.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode-variables');
    darkMode.querySelector('span:nth-child(1)').classList.toggle('active');
    darkMode.querySelector('span:nth-child(2)').classList.toggle('active');
})


Orders.forEach(order => {
    const tr = document.createElement('tr');
    const trContent = `
        <td>${order.productName}</td>
        <td>${order.productNumber}</td>
        <td>${order.paymentStatus}</td>
        <td class="${order.status === 'Declined' ? 'danger' : order.status === 'Pending' ? 'warning' : 'primary'}">${order.status}</td>
        <td class="primary">Details</td>
    `;
    tr.innerHTML = trContent;
    document.querySelector('table tbody').appendChild(tr);
});