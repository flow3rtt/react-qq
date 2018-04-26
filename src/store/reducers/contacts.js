import _ from "lodash";
import { handleActions, createActions } from "redux-actions";
import fetch from "../../fetch";

const initState = {
  friends: [],
  groups: [],
};

export const { setContactsValue } = createActions({}, "SET_CONTACTS_VALUE");

const reducer = handleActions(
  {
    [setContactsValue](state, { payload }) {
      const t = _.cloneDeep(state);
      for (let { key, value } of payload) {
        _.set(t, key, value);
      }
      return _.assign({}, t);
    }
  },
  initState
);
export const getContacts = uId => {
  return async (dispatch, getState) => {
    const response = await fetch.post("/contacts", { uId });
    let payload = [];
    if (response.code === 1) {
      if(!_.isEmpty(response.friends)){
        payload.push({
          key: "friends",
          value: response.friends
        });
      }
      if(!_.isEmpty(response.groups)){
        payload.push({
          key: "groups",
          value: response.groups
        });
      }
      dispatch(setContactsValue(payload));
    }
  };
};

export default reducer;
