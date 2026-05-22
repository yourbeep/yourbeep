import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import AppRouter from "@app/router/AppRouter";
import { store } from "@store";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppRouter />
        <Toaster position="bottom-right" richColors closeButton />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
