import _ from "lodash";
import { handleActions, createActions } from "redux-actions";
import fetch from "../../fetch";

const initState = {
  layoutMessage: [],
  messageMap: {
    group: {},
    private: {}
  }
};

export const { setMessageValue } = createActions({}, "SET_MESSAGE_VALUE");

const reducer = handleActions(
  {
    [setMessageValue](state, { payload }) {
      if (Array.isArray(payload)) {
        const t = _.cloneDeep(state);
        payload.forEach(v => {
          const { key, value } = v;
          _.set(t, key, value);
        });
        return _.assign({}, t);
      } else {
        const t = _.cloneDeep(state);
        const { key, value } = payload;
        _.set(t, key, value);
        return _.assign({}, t);
      }
    }
  },
  initState
);
export const getLayoutMessage = uId => {
  return async (dispatch, getState) => {
    const response = await fetch.post("/message/layout", { uId });
    if (response.code === 1) {
      const { private: p, group: t } = response;
      const { layoutMessage } = getState()["message"];
      const result = _.concat([], layoutMessage, p, t);
      result.sort((a, b) => Date.parse(b.time) - Date.parse(a.time));
      dispatch(
        setMessageValue({
          key: `layoutMessage`,
          value: result
        })
      );
    }
  };
};

export const removUnreadMessage = (id, key) => {
  return async (dispatch, getState) => {
    const { layoutMessage } = getState()["message"];
    const { info } = getState()["user"];
    if (key === "private") {
      const response = await fetch.post("/message/remove_unread", {
        tuId: info.uId,
        fuId: id
      });
      if (response.code != 1) {
        return;
      }
    }
    const payload = _.cloneDeep(layoutMessage);
    const result = payload.filter(v => v.type === key && v.id == id);
    const t = payload.filter(v => !(v.type === key && v.id == id));
    result.forEach(element => {
      element.unread = "0";
    });
    dispatch(
      setMessageValue({
        key: `layoutMessage`,
        value: t.concat(result)
      })
    );
  };
};
export const getMessage = (id, key) => {
  return async (dispatch, getState) => {
    const { messageMap: t } = getState()["message"];
    const { info } = getState()["user"];
    const messageMap = _.cloneDeep(t);
    const { code, ...rest } = await fetch.post("/message/get", {
      tuId: id,
      fuId: info.uId,
      type: key
    });
    if (code != 1) {
      return;
    }
    if (!messageMap[key][id]) {
      _.assign(messageMap, {
        [key]: {
          [id]: rest
        }
      });
    } else {
      messageMap[key][id].contents = rest.contents;
    }
    dispatch(
      setMessageValue({
        key: `messageMap`,
        value: messageMap
      })
    );
  };
};

export const addLocalMessage = payload => {
  return async (dispatch, getState) => {
    const { id, text, type, face, note, uName } = payload;
    const { messageMap: t, layoutMessage: tt } = getState()["message"];
    const messageMap = _.cloneDeep(t);
    let layoutMessage = _.cloneDeep(tt);
    if (!messageMap[type][id]) {
      return;
    }
    messageMap[type][id].contents.push({
      value: text,
      time: new Date(),
      type: "right",
      face: face || "",
      name: uName || ""
    });
    const ltt = layoutMessage.filter(v => v.id == id && v.type == type);
    const tttt = layoutMessage.filter(v => !(v.id == id && v.type == type));
    if (ltt.length !== 0) {
      ltt.forEach(v => {
        v.content = text;
        v.time = new Date();
      });
      layoutMessage = tttt.concat(ltt);
    } else {
      layoutMessage.push({
        type,
        id,
        face,
        unread: "0",
        content: text,
        time: new Date(),
        name: note
      });
    }

    dispatch(
      setMessageValue([
        {
          key: `layoutMessage`,
          value: layoutMessage
        },
        {
          key: `messageMap`,
          value: messageMap
        }
      ])
    );
  };
};

export const updateMessage = (payload, type) => {
  return (dispatch, getState) => {
    let {
      id,
      toId,
      content,
      time,
      fNote,
      face,
      fFace,
      name,
      uName
    } = payload;
    const { messageMap: t, layoutMessage: lt } = getState()["message"];
    const messageMap = _.cloneDeep(t);
    let layoutMessage = _.cloneDeep(lt);
    if(type === "private"){
      toId = id;
    }
    if (!!messageMap[type][toId]) {
      messageMap[type][toId].contents.push({
        value: content,
        time,
        type: "left",
        face: face || {},
        name: uName || ""
      });
    }
    const ltt = layoutMessage.filter(v => v.id == toId && v.type == type);
    const tt = layoutMessage.filter(v => !(v.id == toId && v.type == type));
    if (ltt.length !== 0) {
      ltt.forEach(v => {
        v.unread = +v.unread + 1 + "";
        v.content = content;
        v.time = time;
      });
      layoutMessage = tt.concat(ltt);
    } else {
      if (type === "private") {
        layoutMessage.push({
          type,
          id,
          face,
          unread: "1",
          content,
          time,
          name: fNote
        });
      } else {
        layoutMessage.push({
          type,
          id: toId,
          face: fFace,
          content,
          time,
          name,
          unread: "1"
        });
      }
    }
    dispatch(
      setMessageValue([
        {
          key: `layoutMessage`,
          value: layoutMessage
        },
        {
          key: `messageMap`,
          value: messageMap
        }
      ])
    );
  };
};

export default reducer;
