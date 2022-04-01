export const calculaBPM = (medicoes) => {
  const intervaloMedicoes = medicoes.map((medicao) => parseInt(medicao.valor, 10));

  const intervalosValidos = intervaloMedicoes.filter((medicao) => medicao > -1);

  const percentualValido = (intervalosValidos.length / intervaloMedicoes.length) * 100;

  if (percentualValido >= 50) {
    const mediaMedicao = Math.trunc(
      intervalosValidos.reduce((medicaoAnterior, medicaoAtual) => medicaoAnterior + medicaoAtual) /
        intervalosValidos.length,
    );

    return mediaMedicao;
  }

  return -1;
};
