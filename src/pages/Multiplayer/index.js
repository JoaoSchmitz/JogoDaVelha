import React, { useState } from "react";
import "./style.css";
import Button from "../../components/Button";

export const Multiplayer = () => {
  const quadroVazio = Array(9).fill("");
  const jogador1 = "X";
  const jogador2 = "O";

  const [quadro, setQuadro] = useState(quadroVazio);
  const [jogadorAtual, setJogadorAtual] = useState(jogador1);
  const [vencedor, setVencedor] = useState(null);

  // Realiza as jogadas
  const handleCelulaClick = (index) => {
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
    quadro[index] = jogadorAtual;

    // Muda o turno e checa se teve um vencedor ou aconteceu um empate
    setJogadorAtual(jogadorAtual === jogador1 ? jogador2 : jogador1);
    checarEmpate();
    checarVencedor();
  };

  // Verifica se tem um vencedor
  const checarVencedor = () => {
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
      if (celulas.every((celula) => celula === jogador1)) {
        let pontuacao = parseInt(localStorage.getItem("jogador1"));
        setVencedor(jogador1);
        localStorage.setItem("jogador1", pontuacao + 1);
      }
      // Verifica se o jogador2 venceu
      if (celulas.every((celula) => celula === jogador2)) {
        let pontuacao = parseInt(localStorage.getItem("jogador2"));
        setVencedor(jogador2);
        localStorage.setItem("jogador2", pontuacao + 1);
      }
    });
  };

  // Pega a pontuação dos jogadores do localStorage
  const pontuacaoJogador1 = parseInt(localStorage.getItem("jogador1"));
  const pontuacaoJogador2 = parseInt(localStorage.getItem("jogador2"));

  // Verifica se houve um empate
  const checarEmpate = () => {
    if (quadro.every((item) => item !== "")) {
      setVencedor("E");
    }
  };

  // Limpa o quadro do jogo e começa novamente
  const resetarJogo = () => {
    setJogadorAtual(jogador1);
    setQuadro(quadroVazio);
    setVencedor(null);
  };

  // Limpa o placar do jogo
  const resetarPlacar = () => {
    setQuadro(quadroVazio);
    setJogadorAtual(jogador1);
    setVencedor(null);
    localStorage.setItem("jogador1", 0);
    localStorage.setItem("jogador2", 0);
  };

  return (
    <>
      <section className="container">
        <section className="main">
          <header className="board_cabecalho">
            <Button caminho="/" texto="Voltar" />
            <h1 className="titulo">Jogo da Velha</h1>
            {vencedor ? (
              <div style={{ width: "12vw" }} />
            ) : (
              <div onClick={resetarPlacar}>
                <Button caminho="/multiplayer" texto="Reiniciar Placar" />
              </div>
            )}
          </header>

          <div className="corpo">
            <div className="placar">
              <h3 className="placar-jogador">
                Pontuação Jogador X:
                <p
                  className="placar-pontos"
                  style={{ color: "var(--X-color)" }}
                >
                  {pontuacaoJogador1}
                </p>
              </h3>
            </div>

            <div className={`quadro ${vencedor ? "game-over" : ""}`}>
              {quadro.map((item, index) => (
                <div
                  key={index}
                  className={`celula ${item}`}
                  onClick={() => handleCelulaClick(index)}
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="placar">
              <h3 className="placar-jogador">
                Pontuação Jogador O:
                <p
                  className="placar-pontos"
                  style={{ color: "var(--O-color)" }}
                >
                  {pontuacaoJogador2}
                </p>
              </h3>
            </div>
          </div>

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
    </>
  );
};
