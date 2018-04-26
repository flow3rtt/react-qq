import React from "react";
import styled from "styled-components";
import { full } from "../assets/style/const";
import { Button } from "antd-mobile";
import flcImg from "../assets/img/flc.png";
import Scroll from "../components/Scroll";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import {
  removUnreadMessage,
  getMessage,
  addLocalMessage
} from "../store/reducers/message";
import history from "../history";
import _ from "lodash";
const icons = [
  "ptt",
  "image",
  "ptv",
  "camera",
  "hongbao",
  "flash",
  "emotion",
  "plus"
].map(v => require(`../assets/img/skin_aio_panel_${v}_nor.png`));

const Wrapper = styled.div`
  ${full("fixed")};
  overflow: hidden;
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
  z-index: 999;
`;
const Top = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  height: 3.4rem;
  align-items: center;
  background-color: #1e90ff;
  color: white;
  font-size: 1.2rem;
  > div:nth-of-type(1) {
    background: url(${flcImg}) no-repeat left center;
    background-size: 1.8rem 1.8rem;
    > span {
      margin-left: 1.2rem;
      display: inline-block;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      // // width: 1.4rem;
      // // height: 1.4rem;
      // line-height: 1.4rem;
      text-align: center;
      font-size: 1rem;
    }
  }
  > div:nth-of-type(2) {
    display: flex;
    flex-direction: column;
    align-items: center;
    > span:first-child {
      letter-spacing: 2px;
      font-size: 1.2rem;
      overflow: hidden;
      max-width: 200px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    > span:last-child {
      font-size: 1rem;
      transform: scale(0.8);
    }
  }
  > div:nth-of-type(3) {
    > img {
      width: 1.8rem;
      height: 1.8rem;
    }
    > img:last-child {
      padding-left: 0.4rem;
    }
  }
`;
const Middle = styled.div`
  flex: 1;
  overflow: hidden;
`;

const MessageWrapper = styled.ul`
  width: 100%;
  padding: 0;
  margin: 0;
  > li {
    list-style: none;
    padding: 0.4rem 0.8rem;
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    > img {
      border-radius: 50%;
      width: 3rem;
      height: 3rem;
    }
    > p {
      margin: 0;
      max-width: 56%;
      display: inline-block;
      border-radius: 0.8rem;
      padding: 0.8rem 0.4rem;
      margin: 0 0.4rem;
      background: #fff;
      color: #000;
      word-break: break-all;
    }
    &.right {
      justify-content: flex-end;
      > p {
        background: #1e90ff;
        color: #fff;
      }
    }
  }
`;
const Bottom = styled.div`
  margin: 6px 2px;
  margin-bottom: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  > div:first-child {
    height: 30px;
    display: flex;
    align-items: center;
    > textarea {
      flex: 1;
      margin-left: 6px;
      border-radius: 2px;
      padding: 0.4rem;
      outline: none;
      border: none;
      overflow-y: hidden;
      font-size: 1.2rem;
      box-sizing: border-box;
      height: 86%;
      resize: none;
    }
    .am-button {
      margin: 0 6px;
      transform: scale(0.88);
    }
  }
  > div:last-child {
    display: flex;
    justify-content: space-around;
    margin-top: 4px;
    img {
      width: 2.4rem;
      height: 2.4rem;
    }
  }
`;

class ChatOne extends React.Component {
  static defaultProps = {
    note: "",
    statusText: ""
  };
  constructor(props) {
    super(props);
    this.state = {
      text: ""
    };
  }
  textChange = e => {
    this.setState({
      text: e.target.value
    });
  };
  componentDidMount() {
    const { match, dispatch, contents } = this.props;
    const { toUid } = match.params;
    if (!toUid) {
      return;
    }
    dispatch(removUnreadMessage(toUid, "private"));
    if (!contents) {
      dispatch(getMessage(toUid, "private"));
    }
    this.scrollToBottom();
  }
  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.contents, this.props.contents)) {
      this.scrollToBottom();
    }
  }
  scrollToBottom = () => {
    setTimeout(() => {
      this.scroll &&
        this.scroll.scrollTo(0, this.scroll.scrollObj.maxScrollY, 400);
    }, 20);
  };

  componentWillUnmount() {
    const { match, dispatch } = this.props;
    const { toUid } = match.params;
    dispatch(removUnreadMessage(toUid, "private"));
  }
  sendMessage = () => {
    const { text } = this.state;
    const { info, id, dispatch, face, fNote, note } = this.props;
    if (_.isEmpty(text)) {
      return;
    }
    window.socket.emit("sendPrivateMessage", {
      time: new Date(),
      content: text,
      id: info.uId,
      toId: id,
      face,
      fNote
    });
    dispatch(
      addLocalMessage({
        id,
        text,
        type: "private",
        face,
        note
      })
    );
    this.setState(
      {
        text: ""
      },
      () => {
        this.textarea.focus();
      }
    );
  };
  render() {
    const { note, statusText, history, contents, face, info } = this.props;
    const { text } = this.state;
    return (
      <Wrapper>
        <Top>
          <div onClick={history.goBack}>
            <span />
          </div>
          <div>
            <span>{note}</span>
            <span>{statusText}</span>
          </div>
          <div>
            <img
              src={require("../assets/img/skin_aio_head_twocall.png")}
              alt=""
            />
            <img
              src={require("../assets/img/skin_header_icon_single.png")}
              alt=""
            />
          </div>
        </Top>
        <Middle>
          <Scroll ref={cmp => (this.scroll = cmp)}>
            <MessageWrapper>
              {_.map(contents, (v, i) => (
                <li className={v.type} key={i}>
                  {v.type === "left" ? (
                    <React.Fragment>
                      <img
                        src={`/api/v1/static${
                          v.type === "left" ? face : info.udFace
                        }`}
                        alt=""
                      />
                      <p>{v.value}</p>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <p>{v.value}</p>
                      <img
                        src={`/api/v1/static${
                          v.type === "left" ? face : info.udFace
                        }`}
                        alt=""
                      />
                    </React.Fragment>
                  )}
                </li>
              ))}
            </MessageWrapper>
          </Scroll>
        </Middle>
        <Bottom>
          <div>
            <textarea
              ref={dom => (this.textarea = dom)}
              onChange={this.textChange}
              value={text}
            />
            <Button
              onClick={this.sendMessage}
              disabled={text === ""}
              type="primary"
              inline
              size="small"
            >
              发送
            </Button>
          </div>
          <div>
            {icons.map((v, i) => (
              <div key={i}>
                <img src={v} alt="" />
              </div>
            ))}
          </div>
        </Bottom>
      </Wrapper>
    );
  }
}
const messageMapSelector = message => message.messageMap;

const getMap = createSelector([messageMapSelector], v => {
  const { pathname } = history.location;
  let id = _.last(pathname.toString().split("/"));
  return v["private"][id] || {};
});

const mstp = ({ user, message }) => {
  return {
    ...getMap(message),
    info: user.info
  };
};

export default connect(mstp)(ChatOne);
