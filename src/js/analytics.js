import { obterChamadas, renderizarTabela } from "./chamadas";
import {  EsconderLoadingATI } from "./loading";



document.addEventListener("DOMContentLoaded", async () => {
  try {
   

    const { filteredCalls, totalEntrada, totalSaida } = await processarChamadasDataAnterior();
   
    await atualizarConteudoHTML(totalEntrada, totalSaida);
    await atualizarAnalytics(filteredCalls, totalEntrada, totalSaida);
  } catch (error) {
    console.error("Erro ao obter chamadas da data anterior:", error.message || error);
  } finally {
    EsconderLoadingATI(); // Esconde indicador de carregamento independentemente do sucesso ou falha
  }
});

async function processarChamadasDataAnterior() {
  try {
    const dataFiltro = obterDataAnteriorISOString();

    const chamadas = await obterChamadas(renderizarTabela);
    
    const { totalEntrada, totalSaida } = calcularTotais(chamadas, dataFiltro);

    return { filteredCalls: chamadas, dataFiltro, totalEntrada, totalSaida };

  } catch (error) {
    throw error;
  }
}

function obterDataAnteriorISOString() {
  const hoje = new Date();
  const dataAnterior = new Date(hoje);
  dataAnterior.setDate(dataAnterior.getDate());

  return dataAnterior.toISOString().split('T')[0];
}

function calcularTotais(chamadas, dataFiltro) {
  const totais = {
    totalEntrada: 0,
    totalSaida: 0,
  };

  chamadas.forEach((chamada) => {
    if (chamada.iniDT && formatarData(chamada.iniDT) === dataFiltro) {
      chamada.tipo === 'entrada' ? totais.totalEntrada++ : totais.totalSaida++;
    }
  });

  totais.totalChamadas = totais.totalEntrada + totais.totalSaida;

  return totais;
}

function formatarData(data) {
  return data.split('/').reverse().join('-');
}

function atualizarConteudoHTML(totalEntrada, totalSaida) {
  const totalLigacaoElement = document.querySelector('#totalLigacao h1');
  const realizadasElement = document.querySelector('#realizadas h1');
  const recebidasElement = document.querySelector('#recebidas h1');

  if (totalLigacaoElement && realizadasElement && recebidasElement) {
    totalLigacaoElement.textContent = totalEntrada + totalSaida;
    realizadasElement.textContent = totalSaida;
    recebidasElement.textContent = totalEntrada;
  } else {
    console.error("Elementos HTML não encontrados.");
  }
}

export async function atualizarAnalytics(chamadasFiltradas) {
  // Implementação da função de atualização do analytics
}
