import axios from "axios";
import history from "./history";
import { Toast } from "antd-mobile";
import store from "./store";
import { setUserValue } from "./store/reducers/user";
const fetch = axios.create({
  baseURL: "/api/v1"
});

fetch.interceptors.request.use(config => {
  const token = localStorage.getItem("qq-token");
  if (!!token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

fetch.interceptors.response.use(response => {
  if (response.status >= 200 && response.status < 300) {
    const { data } = response;
    if (data.code === 2) {
      // Toast.info(data.message, 0.5);
      const {user} =store.getState()
      if (!!user.isLogin) {
        store.dispatch(
          setUserValue({
            key: "isLogin",
            value: false
          })
        );
        store.dispatch(
          setUserValue({
            key: "info",
            value: {}
          })
        );
        history.replace("/");
      }
    }
    return data;
  } else {
    return response;
  }
});

export default fetch;
