import React from "react";

// Importando as rotas
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Importando as páginas da aplicação
import { Home } from "./pages/Home";
import { SinglePlayer } from "./pages/SinglePlayer";
import { Multiplayer } from "./pages/Multiplayer";
import { SelecaoJogador } from "./pages/SelecaoJogadores";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/singleplayer",
    element: <SinglePlayer />,
  },
  {
    path: "/multiplayer",
    element: <Multiplayer />,
  },
  {
    path: "/selecao",
    element: <SelecaoJogador />,
  },
]);

export const Routes = () => {
  return <RouterProvider router={router} />;
};
