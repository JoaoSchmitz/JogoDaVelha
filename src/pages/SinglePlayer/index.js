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

  const handleCelulaClick = useCallback(
    (index) => {
      if (vencedor) {
        console.log("Jogo finalizado.");
        return null;
      }

      if (quadro[index] !== "") {
        return null;
      }

      const novoQuadro = [...quadro];
      novoQuadro[index] = jogadorAtual;

      setQuadro(novoQuadro);
      setJogadorAtual(jogadorAtual === jogador1 ? jogador2 : jogador1);
    },
    [jogadorAtual, quadro, vencedor]
  );

  const checarVencedor = useCallback(() => {
    let venceu = 0;

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

    possibilidadesDeVencer.forEach((celulas) => {
      if (celulas.every((celula) => celula === "X")) {
        let pontuacao = parseInt(localStorage.getItem("jogador1"));
        setVencedor("X");
        localStorage.setItem("jogador1", pontuacao + 1);
        venceu = 1;
      }
      if (celulas.every((celula) => celula === "O")) {
        let pontuacao = parseInt(localStorage.getItem("jogador2"));
        setVencedor("O");
        localStorage.setItem("jogador2", pontuacao + 1);
        venceu = 1;
      }
    });

    if (venceu === 1) {
      return 1;
    } else {
      return 0;
    }
  }, [quadro]);

  const checarEmpate = useCallback(() => {
    if (quadro.every((item) => item !== "")) {
      setVencedor("E");
    }
  }, [quadro]);

  const pontuacaoJogador1 = parseInt(localStorage.getItem("jogador1"));
  const pontuacaoJogador2 = parseInt(localStorage.getItem("jogador2"));

  const resetarJogo = useCallback(() => {
    setQuadro(quadroVazio);
    setJogadorAtual(jogador2);
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

  const resetarPlacar = () => {
    setQuadro(quadroVazio);
    setJogadorAtual(jogador2);
    setVencedor(null);
    localStorage.setItem("jogador1", 0);
    localStorage.setItem("jogador2", 0);
  };

  useEffect(() => {
    checarEmpate();
    const venceu = checarVencedor();
    if (jogadorAtual === jogador2 && !venceu) {
      const celulasVazias = quadro
        .map((celula, index) => (celula === "" ? index : null))
        .filter((celula) => celula !== null);

      if (celulasVazias.length > 0 && !vencedor) {
        const randomIndex = Math.floor(Math.random() * celulasVazias.length);
        const botMove = celulasVazias[randomIndex];

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
