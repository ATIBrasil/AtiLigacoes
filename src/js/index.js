import "./chamadas";
import "./ranking";
import "./analytics";
import "./filtercall";
import "./../auth/auth";


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


// Função para limpar o localStorage
function limparLocalStorage() {
    localStorage.removeItem('token');
    window.location.reload();
    
  }
function sair(){
    localStorage.removeItem('senhaAutenticacao');
    window.location.reload();
}  
document.getElementById('sair').addEventListener('click', sair);
  document.getElementById('botaoLimparCache').addEventListener('click', limparLocalStorage);