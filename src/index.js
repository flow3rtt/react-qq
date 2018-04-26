import React from "react";
import ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import { Provider } from "react-redux";
import { Router, Route } from "react-router-dom";
import store from "./store";
import fastClick from "fastclick";
import App from "./containers/App";
import history from "./history";
import "normalize.css/normalize.css";
import "./assets/style/index.css";
import io from "socket.io-client";




if ("addEventListener" in document) {
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      fastClick.attach(document.body);
      window.socket = io.connect("http://118.24.39.247:8082");
    },
    false
  );
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path={"/"} component={App} />
    </Router>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
