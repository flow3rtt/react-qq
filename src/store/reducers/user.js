import _ from "lodash";
import fetch from "../../fetch";

import { handleActions, createActions } from "redux-actions";

const initState = {
  isLogin: false,
  info: {}
};

export const { setUserValue } = createActions({}, "SET_USER_VALUE");

export const logout = uId => {
  return async (dispatch, getState) => {
    const response = await fetch.post("/logout", { uId });
    if (response.code === 1) {
      sessionStorage.removeItem("qq-token");
      dispatch(
        setUserValue({
          key: "isLogin",
          value: false
        })
      );
      dispatch(
        setUserValue({
          key: "info",
          value: {}
        })
      );
    }
  };
};

const reducer = handleActions(
  {
    [setUserValue](state, { payload }) {
      const { key, value } = payload;
      return _.assign({}, state, {
        [key]: value
      });
    }
  },
  initState
);

export default reducer;
