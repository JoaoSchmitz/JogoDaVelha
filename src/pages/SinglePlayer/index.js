import React, { useState, useEffect, useCallback } from "react";
import "../Multiplayer/style.css";
import Button from "../../components/Button";

export const SinglePlayer = () => {
  const quadroVazio = Array(9).fill("");
  const jogador1 = "X";
  const jogador2 = "O";

  const [quadro, setQuadro] = useState(quadroVazio);
  const [jogadorAtual, setJogadorAtual] = useState(jogador2);
  const [vencedor, setVencedor] = useState(null);

   // Realiza as jogadas
  const handleCelulaClick = useCallback(
    (index) => {
      // Verifica se há um vencedor
      if (vencedor) {
        console.log("Jogo finalizado.");
        return null;
      }

      // Verifica se o local escolhido está vazio
      if (quadro[index] !== "") {
        return null;
      }

      // Realiza a jogada
      const novoQuadro = [...quadro];
      novoQuadro[index] = jogadorAtual;

      // Muda o turno
      setQuadro(novoQuadro);
      setJogadorAtual(jogadorAtual === jogador1 ? jogador2 : jogador1);
    },
    [jogadorAtual, quadro, vencedor]
  );

  // Verifica se tem um vencedor
  const checarVencedor = useCallback(() => {
    let venceu = 0;

    // Lista todas as possibilidades de vencer
    const possibilidadesDeVencer = [
      [quadro[0], quadro[1], quadro[2]],
      [quadro[3], quadro[4], quadro[5]],
      [quadro[6], quadro[7], quadro[8]],

      [quadro[0], quadro[3], quadro[6]],
      [quadro[1], quadro[4], quadro[7]],
      [quadro[2], quadro[5], quadro[8]],

      [quadro[0], quadro[4], quadro[8]],
      [quadro[2], quadro[4], quadro[6]],
    ];

    // Para cada possibilidade de vencer, verifica se ela ocorreu
    possibilidadesDeVencer.forEach((celulas) => {
      // Verifica se o jogador1 venceu
      if (celulas.every((celula) => celula === "X")) {
        let pontuacao = parseInt(localStorage.getItem("jogador1"));
        setVencedor("X");
        localStorage.setItem("jogador1", pontuacao + 1);
        venceu = 1;
      }
      // Verifica se o jogador2 venceu
      if (celulas.every((celula) => celula === "O")) {
        let pontuacao = parseInt(localStorage.getItem("jogador2"));
        setVencedor("O");
        localStorage.setItem("jogador2", pontuacao + 1);
        venceu = 1;
      }
    });

    // Retorna 1 se houve um vencedor, 0 se não
    if (venceu === 1) {
      return 1;
    } else {
      return 0;
    }
  }, [quadro]);

  // Verifica se houve um empate
  const checarEmpate = useCallback(() => {
    if (quadro.every((item) => item !== "")) {
      setVencedor("E");
    }
  }, [quadro]);

  // Pega a pontuação dos jogadores do localStorage
  const pontuacaoJogador1 = parseInt(localStorage.getItem("jogador1"));
  const pontuacaoJogador2 = parseInt(localStorage.getItem("jogador2"));

  // Limpa o quadro do jogo e começa novamente
  const resetarJogo = useCallback(() => {
    setQuadro(quadroVazio);
    setJogadorAtual(jogador2);
    // Verifica se houve vencedor, para evitar erros no placar
    if (vencedor === jogador1)
      localStorage.setItem(
        "jogador1",
        parseInt(localStorage.getItem("jogador1") - 1)
      );
    if (vencedor === jogador2)
      localStorage.setItem(
        "jogador2",
        parseInt(localStorage.getItem("jogador2") - 1)
      );
    setVencedor(null);
  }, [quadroVazio, vencedor]);

  // Limpa o placar do jogo
  const resetarPlacar = () => {
    setQuadro(quadroVazio);
    setJogadorAtual(jogador2);
    setVencedor(null);
    localStorage.setItem("jogador1", 0);
    localStorage.setItem("jogador2", 0);
  };

  // Realiza a função:
  // - sempre que algum item do array de dependências é alterado
  // - ao carregar a página
  useEffect(() => {
    checarEmpate();
    const venceu = checarVencedor();
    // Verifica se é a vez do computador e se não há um vencedor
    if (jogadorAtual === jogador2 && !venceu) {
      // Verifica quais espaços do quadro de jogo estão vazios
      const celulasVazias = quadro
        .map((celula, index) => (celula === "" ? index : null))
        .filter((celula) => celula !== null);

      // Se houver espaçoes vazios no quadro de jogo, o bot joga em um espaço vazio aleatório
      if (celulasVazias.length > 0 && !vencedor) {
        const randomIndex = Math.floor(Math.random() * celulasVazias.length);
        const botMove = celulasVazias[randomIndex];

        // Faz o bot jogar após um período de tempo, para simular o tempo de  decisão
        setTimeout(() => {
          handleCelulaClick(botMove);
        }, 1000);
      }
    }
  }, [
    jogadorAtual,
    resetarJogo,
    checarVencedor,
    checarEmpate,
    handleCelulaClick,
    quadro,
    vencedor,
  ]);

  return (
    <section className="container">
      <section className="main">
        <header className="board_cabecalho">
          <Button caminho="/" texto="Voltar" />
          <h1 className="titulo">Jogo da Velha</h1>
          {vencedor ? (
            <div style={{ width: "12vw" }} />
          ) : (
            <div onClick={resetarPlacar}>
              <Button caminho="/singleplayer" texto="Reiniciar Placar" />
            </div>
          )}
        </header>

        <div className="corpo">
          <div className="placar">
            <h3 className="placar-jogador">
              Pontuação Jogador X:
              <p className="placar-pontos" style={{ color: "var(--X-color)" }}>
                {pontuacaoJogador1}
              </p>
            </h3>
          </div>

          <div className={`quadro ${vencedor ? "game-over" : ""}`}>
            {quadro.map((item, index) => (
              <div
                key={index}
                className={`celula ${item}`}
                onClick={() => {
                  if (jogadorAtual === jogador1) handleCelulaClick(index);
                }}
              >
                {item}
              </div>
            ))}
          </div>

          <div className="placar">
            <h3 className="placar-jogador">
              Pontuação Jogador O:
              <p className="placar-pontos" style={{ color: "var(--O-color)" }}>
                {pontuacaoJogador2}
              </p>
            </h3>
          </div>
        </div>

        {jogadorAtual === jogador2 && !vencedor ? (
          <footer>
            <h2 class="mensagem-bot">
              <div class="loading" />
            </h2>
          </footer>
        ) : (
          <></>
        )}

        {vencedor && (
          <footer>
            {vencedor === "E" ? (
              <h2 class="mensagem-vencedor">
                <span className={vencedor}>Empatou!</span>
              </h2>
            ) : (
              <h2 class="mensagem-vencedor">
                <span className={vencedor}>{vencedor}</span> venceu!
              </h2>
            )}
            <button onClick={resetarJogo}>Recomeçar jogo!</button>
          </footer>
        )}
      </section>
    </section>
  );
};
