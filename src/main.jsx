import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./styles/index.css";
import App from "./App.jsx";
import store from "./app/store.js";
import { installSessionExpiryInterceptor } from "./features/auth/sessionExpiry.js";

installSessionExpiryInterceptor();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
