const http = require('http');
const fs = require('fs');

const hostname = '10.36.100.5';
const port = 3000;

function formatarDataHora(data) {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  const horas = String(data.getHours()).padStart(2, '0');
  const minutos = String(data.getMinutes()).padStart(2, '0');
  const segundos = String(data.getSeconds()).padStart(2, '0');

  return `${horas}:${minutos}-${dia}-${mes}-${ano}`;
}

const server = http.createServer((req, res) => {
  const clienteIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (req.method === 'POST' && req.url === '/salvar-log') {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });

    req.on('end', () => {
      try {
        const { senha, mensagem } = JSON.parse(data);

        const agora = new Date();
        const horarioFormatado = formatarDataHora(agora);
        const filePath = `C:\\Users\\voip\\Downloads\\servidorlog\\${senha}-${clienteIP}-log.txt`;
        const conteudoArquivo = `Senha: ${senha}\nHorário: ${horarioFormatado}\nIP: ${clienteIP}\nMensagem: ${mensagem}\n\n`;

        fs.appendFile(filePath, conteudoArquivo, (err) => {
          if (err) {
            console.error('Erro ao salvar o arquivo:', err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Erro interno no servidor');
            return;
          }

          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end(conteudoArquivo);
        });
      } catch (error) {
        console.error('Erro ao processar requisição POST:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Erro interno no servidor');
      }
    });
  } else if (req.url.startsWith('/salvar-log')) {
    const params = new URLSearchParams(req.url.split('?')[1]);
    const senha = params.get('senha');
    const horarioParam = params.get('horario');

    if (!senha || !horarioParam) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Senha e/ou hora não fornecidas na URL');
      return;
    }

    const horario = new Date(horarioParam);
    if (isNaN(horario)) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Formato de hora inválido na URL');
      return;
    }

    const horarioFormatado = formatarDataHora(horario);
    const filePath = `C:\\Users\\voip\\Downloads\\servidorlog\\${senha}-log.txt`;

    fs.readFile(filePath, (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          const conteudoInicial = `Senha: ${senha}\nHorário: ${horarioFormatado}\nIP: ${clienteIP}\n`;
          fs.writeFile(filePath, conteudoInicial, (err) => {
            if (err) {
              console.error('Erro ao salvar o arquivo:', err);
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end('Erro interno no servidor');
              return;
            }

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(conteudoInicial);
          });
        } else {
          console.error('Erro ao ler o arquivo:', err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Erro interno no servidor');
        }
      } else {
        const novaEntrada = `\nSenha: ${senha}\nHorário: ${horarioFormatado}\nIP: ${clienteIP}\n`;
        fs.appendFile(filePath, novaEntrada, (err) => {
          if (err) {
            console.error('Erro ao adicionar entrada ao arquivo:', err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Erro interno no servidor');
            return;
          }

          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end(data + novaEntrada);
        });
      }
    });
  }
});

server.listen(port, hostname, () => {
  console.log(`Servidor rodando em https://${hostname}:${port}/`);
});
