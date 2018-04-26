import React from "react";
import styled from "styled-components";
import { Route, Switch, Redirect, NavLink } from "react-router-dom";
import Message from "./Message";
import Contacts from "./Contacts";
import Dynamic from "./Dynamic";
import ChatOne from "./ChatOne";
import ChatGroup from "./ChatGroup";
import AddFriend from "./AddFriend";
import AddGroup from "./AddGroup";
import CG from "./CG";
import { full, flexCenter } from "../assets/style/const";
import { getLayoutMessage, updateMessage } from "../store/reducers/message";
import { getContacts } from "../store/reducers/contacts";
import { createSelector } from "reselect";
import { connect } from "react-redux";
import { Badge } from "antd-mobile";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  ${full("fixed")};
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
  > div:nth-of-type(2) {
    letter-spacing: 2px;
  }
  > div:first-child {
    > img {
      width: 2.4rem;
      height: 2.4rem;
      border-radius: 50%;
      cursor: pointer;
      display: block;
    }
  }
`;

const Middle = styled.div`
  flex: 1;
  position: relative;
`;

const Bottom = styled.div`
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: white;
  border-top: 1px solid #eee;
  > a {
    ${flexCenter()};
    flex-direction: column;
    height: 100%;
    padding: 0 1rem;
    &.active {
      > span {
        color: #9cf;
      }
    }
    .am-badge-text {
      top: -2px;
      height: 14px;
      line-height: 14px;
      min-width: unset;
      padding: 0 4.2px;
      transform: translateX(-40%);
    }
    .am-badge-dot {
      top: 0px;
    }
    > span:first-child {
      > img {
        display: inline-block;
        max-width: 2rem;
      }
    }
    > span:last-child {
      color: #666;
      padding-top: 1px;
      font-size: 1rem;
    }
  }
`;

class Layout extends React.Component {
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.getLayoutMessage();
    this.getContacts();
    this.listenSocket();
  }
  getLayoutMessage = async () => {
    const { info, dispatch } = this.props;
    dispatch(getLayoutMessage(info.uId));
  };
  getContacts = async () => {
    const { info, dispatch } = this.props;
    dispatch(getContacts(info.uId));
  };
  listenSocket = async () => {
    const { dispatch } = this.props;
    window.socket.on("receivePrivateMessage", payload => {
      dispatch(updateMessage(payload, "private"));
    });
    window.socket.on("receiveGroupMessage", payload => {
      dispatch(updateMessage(payload, "group"));
    });
  };
  render() {
    const { location, info, unreadCount } = this.props;
    const { pathname } = location;
    const {} = this.state;
    let title = "";
    let rightTitle = "";
    let path = pathname.split("/")[1];
    switch (path) {
      case "message":
        title = "消息";
        rightTitle = "+";
        break;
      case "contacts":
        title = "联系人";
        rightTitle = "添加";
        break;
      case "dynamic":
        title = "动态";
        rightTitle = "更多";
        break;
      default:
        break;
    }
    return (
      <Wrapper>
        <Top>
          <div>
            <img alt="头像" src={`/api/v1/static${info.udFace}`} />
          </div>
          <div>
            <span>{title}</span>
          </div>
          <div
            style={
              title === "消息"
                ? {
                    fontSize: "2.4rem"
                  }
                : {}
            }
          >
            <span>{rightTitle}</span>
          </div>
        </Top>
        <Middle>
          <Switch>
            <Route path={"/message"} component={Message} />
            <Route path={"/contacts"} component={Contacts} />
            <Route path={"/dynamic"} component={Dynamic} />
            <Route path={"/chat_one/:toUid"} component={ChatOne} />
            <Route path={"/chat_group/:toGid"} component={ChatGroup} />
            <Route path={"/add_friend"} component={AddFriend} />
            <Route path={"/add_group"} component={AddGroup} />
            <Route path={"/cg"} component={CG} />
            <Redirect to={"/message"} />
          </Switch>
        </Middle>
        <Bottom>
          <NavLink replace to={"/message"}>
            <Badge text={unreadCount}>
              <img
                alt={"消息"}
                src={require(`../assets/img/message${
                  title === "消息" ? "_selected" : ""
                }.png`)}
              />
            </Badge>
            <span>消息</span>
          </NavLink>
          <NavLink replace to={"/contacts"}>
            <Badge>
              <img
                alt={"联系人"}
                src={require(`../assets/img/contacts${
                  title === "联系人" ? "_selected" : ""
                }.png`)}
              />
            </Badge>
            <span>联系人</span>
          </NavLink>
          <NavLink replace to={"/dynamic"}>
            <Badge dot>
              <img
                alt={"动态"}
                src={require(`../assets/img/dynamic${
                  title === "动态" ? "_selected" : ""
                }.png`)}
              />
            </Badge>
            <span>动态</span>
          </NavLink>
        </Bottom>
      </Wrapper>
    );
  }
}

const layoutMessageSelector = message => message.layoutMessage;

const getUnreadMessageCount = createSelector([layoutMessageSelector], p => {
  let c = 0;
  p.forEach(v => {
    c += +v.unread;
  });
  return c;
});

const mstp = ({ user, message }) => {
  return {
    info: user.info,
    unreadCount: getUnreadMessageCount(message)
  };
};
export default connect(mstp)(Layout);
