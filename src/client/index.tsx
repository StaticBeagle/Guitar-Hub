import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./components/app";
import './styles/app';
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter} from "react-router-dom";

ReactDOM.render(
  <BrowserRouter>
    <Auth0Provider
      domain={process.env.REACT_APP_DOMAIN || ""}
      clientId={process.env.REACT_APP_CLIENT_ID || ""}
      redirectUri={window.location.origin}
    >
      <App />
    </Auth0Provider>
  </BrowserRouter>,
  document.getElementById('application-host'));
