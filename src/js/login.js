// login.js

export async function fazerLogin(callback) {
    const login = "ati.gravador";
    const password = "SLFDjmgfih@#erjkdfDSFds1233";

    try {
        // Tente obter o token do localStorage
        const existingToken = localStorage.getItem('token');

        if (existingToken) {
            // Redireciona para a página de dashboard se o token existir
            console.log("Token existente. Redirecionando para /dashboard.html");
            window.location.href = '/dashboard.html';
            return;
        }

        // Se não houver token existente, faça o login e obtenha um novo token
        const response = await fetch("https://apigravadorvmc.voicemanager.cloud/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
                "Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
            },
            body: JSON.stringify({ login, password }),
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                // Redireciona para a página inicial (index.html) em caso de erro no login
                console.log("Erro no login. Redirecionando para /index.html");
                window.location.href = '/index.html';
                return;
            } else {
                // Redireciona para a página inicial (index.html) para outros códigos de erro
                console.log("Erro desconhecido. Redirecionando para /index.html");
                window.location.href = '/index.html';
                return;
            }
        }

        const data = await response.json();

        // Adiciona o novo token ao localStorage
        localStorage.setItem('token', data.token);

        // Chama o callback, passando o token como argumento
        console.log("Login bem-sucedido. Redirecionando para /dashboard.html");
        window.location.href = '/dashboard.html';
        callback(null, data.token);
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        // Chama o callback com o erro
        callback(error, null);
    }
}
