// login.js

(function () {
    async function fazerLogin(callback) {
      try {
        // Tente obter o token do localStorage
        const existingToken = localStorage.getItem("token");
  
        if (existingToken) {
          // Redireciona para a página de dashboard se o token existir
          console.log("Token existente. Redirecionando para ./dashboard.html");
          window.location.href = "./dashboard.html";
          return;
        }
  
        // Obtenha os valores dos campos de login e senha do formulário
        const loginElement = document.getElementById("login");
        const senhaElement = document.getElementById("senha");
  
        const login = loginElement.value;
        const senha = senhaElement.value;
  
        // Faça o login e obtenha um novo token
        const response = await fetch(
          "https://apigravadorvmc.voicemanager.cloud/api/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ login, senha }),
          }
        );
  
        if (!response.ok) {
          console.error("Erro durante o login. Status:", response.status);
  
          if (response.status === 401 || response.status === 403) {
            // Redireciona para a página inicial (index.html) em caso de erro no login
            console.log("Erro no login. Redirecionando para ./index.html");
            window.location.href = "./index.html";
          } else {
            // Redireciona para a página inicial (index.html) para outros códigos de erro
            console.log("Erro desconhecido. Redirecionando para ./index.html");
            window.location.href = "./index.html";
          }
  
          return;
        }
  
        const data = await response.json();
  
        // Adiciona o novo token ao localStorage
        localStorage.setItem("token", data.token);
  
        // Chama o callback, passando o token como argumento
        console.log("Login bem-sucedido. Redirecionando para ./dashboard.html");
        window.location.href = "./dashboard.html";
        callback(null, data.token);
      } catch (error) {
        console.error("Erro ao fazer login:", error);
        // Chama o callback com o erro
        callback(error, null);
      }
    }
  
    // Adicione um listener de evento ao botão de login
    document.getElementById("btnLogin").addEventListener("click", function () {
      fazerLogin(function (error, token) {
        if (error) {
          // Trate o erro aqui, se necessário
          console.error("Erro durante o login:", error);
        } else {
          // O login foi bem-sucedido, faça algo aqui se necessário
          console.log("Token recebido:", token);
        }
      });
    });
  
    // Verifique se já existe um token no localStorage ao carregar a página
    document.addEventListener("DOMContentLoaded", function () {
      const existingToken = localStorage.getItem("token");
  
      if (existingToken) {
        console.log(
          "Token existente ao carregar a página. Redirecionando para ./dashboard.html"
        );
        window.location.href = "./dashboard.html";
      }
    });
  })();
  