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
  // const [modal, setModal] = useState(true);

  const handleCelulaClick = (index) => {
    if (vencedor) {
      console.log("Jogo finalizado.");
      return null;
    }

    if (quadro[index] !== "") {
      return null;
    }

    quadro[index] = jogadorAtual;

    setJogadorAtual(jogadorAtual === jogador1 ? jogador2 : jogador1);
    checarEmpate();
    checarVencedor();
  };

  const checarVencedor = () => {
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
      if (celulas.every((celula) => celula === jogador1)) {
        let pontuacao = parseInt(localStorage.getItem("jogador1"));
        setVencedor(jogador1);
        localStorage.setItem("jogador1", pontuacao + 1);
      }
      if (celulas.every((celula) => celula === jogador2)) {
        let pontuacao = parseInt(localStorage.getItem("jogador2"));
        setVencedor(jogador2);
        localStorage.setItem("jogador2", pontuacao + 1);
      }
    });
  };

  const pontuacaoJogador1 = parseInt(localStorage.getItem("jogador1"));
  const pontuacaoJogador2 = parseInt(localStorage.getItem("jogador2"));

  const checarEmpate = () => {
    if (quadro.every((item) => item !== "")) {
      setVencedor("E");
    }
  };

  const resetarJogo = () => {
    setJogadorAtual(jogador1);
    setQuadro(quadroVazio);
    setVencedor(null);
  };

  const resetarPlacar = () => {
    setQuadro(quadroVazio);
    setJogadorAtual(jogador1);
    setVencedor(null);
    localStorage.setItem("jogador1", 0);
    localStorage.setItem("jogador2", 0);
  };

  return (
    <>
      {/* {modal ? (
        <>
          <div className="modalBg" onClick={() => setModal(!modal)} />
          <div className="modalContent">
            <form>
              <input
                type="text"
                className="playerX"
                value={nomeX}
                onChange={(event) => {
                  setNomeX(event.target.value);
                }}
                placeholder="Player: X"
              ></input>
              <input
                type="text"
                className="playerO"
                value={nomeY}
                onChange={(event) => {
                  setNomeY(event.target.value);
                }}
                placeholder="Player: O"
              ></input>
              <button type="submit">Confirmar</button>
            </form>
          </div>
        </>
      ) : (
        <></>
      )} */}
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
