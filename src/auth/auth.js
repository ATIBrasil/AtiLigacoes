var senhasValidas = ["#Diretoria@2024", "ati@2024!!", "Rh@2023!!"];

function realizarLogin() {
  var senhaDigitada = document.getElementById("senha").value;

  if (senhasValidas.includes(senhaDigitada)) {
    // Senha válida, armazene no localStorage
    localStorage.setItem("senhaAutenticacao", senhaDigitada);

    // Obtenha o protocolo atual da página
    var protocoloAtual = window.location.protocol;

    // Obtenha a data e o horário atual
    var dataAtual = new Date();
    var horarioAtual = dataAtual.toISOString();

    // Construa a URL da API com o mesmo protocolo da página
    var apiUrl =  protocoloAtual + "//10.36.100.5:3000/salvar-log" +
      "?senha=" + encodeURIComponent(senhaDigitada) +
      "&horario=" + encodeURIComponent(horarioAtual);

    // Envie uma requisição para a API usando fetch
   // fetch(apiUrl)
     // .then(response => response.json())
    //  .then(data => {
        // Trate a resposta da API conforme necessário
     //   console.log(data);

        // Redirecione para a página de destino após a resposta da API
        window.location.href = "dashboard.html";
    //  });
  } else {
    // Senha incorreta, exiba uma mensagem de erro
    alert("Senha incorreta. Tente novamente.");
  }
}

function verificarAutenticacao() {
  var senhaArmazenada = localStorage.getItem("senhaAutenticacao");

  if (!senhaArmazenada) {
    // Senha não armazenada, redireciona para a página de login
    if (window.location.href.indexOf("login.html") === -1) {
      window.location.href = "login.html";
    }
  } else {
    // Senha armazenada, redireciona para a página de destino (dashboard ou outra)
    if (window.location.href.indexOf("dashboard.html") === -1) {
      window.location.href = "dashboard.html";  // Troque para a página desejada
    }
  }
}
