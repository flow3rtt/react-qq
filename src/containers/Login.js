import React from "react";
import styled from "styled-components";
import { Button, List, InputItem, WhiteSpace } from "antd-mobile";
import _ from "lodash";
import { Link } from "react-router-dom";
import rqkImg from "../assets/img/rqk.png";
import { Toast } from "antd-mobile";
import fetch from "../fetch";
import { full } from "../assets/style/const";
import { connect } from "react-redux";
import { setUserValue } from "../store/reducers/user";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  ${full("absolute")};
  background-color: white;
`;

const Top = styled.div`
  margin: 20% 0 0 8%;
  font-size: 2rem;
  > span {
    margin-left: 0.2rem;
    position: relative;
    bottom: 0.5rem;
    color: #666;
  }
`;
const Middle = styled.div`
  margin: 10% 8% 0 8%;
  .am-list-line {
    border-bottom: 1px solid #ddd !important;
  }
  .am-list-body {
    border-top: unset;
  }
  a:last-of-type {
    float: right;
    margin-top: 1.2rem;
    color: #1e90ff;
  }
  a:nth-last-of-type(2) {
    float: left;
    margin-top: 1.2rem;
    color: #1e90ff;
  }
  input::placeholder {
    color: #333;
  }
`;
const Bottom = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 6rem;
  text-align: center;
  > p {
    > span {
      color: #1e90ff;
      cursor: pointer;
    }
  }
`;

class Login extends React.Component {
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      val: "",
      password: ""
    };
  }

  inputChange = (key, val) => {
    let payload = _.cloneDeep(this.state);
    _.set(payload, key, val);
    this.setState(payload);
  };

  login = async () => {
    const { dispatch } = this.props;
    const payload = _.cloneDeep(this.state);
    if (payload.val.trim() === "") {
      Toast.info("请输入账号!", 0.5);
      return false;
    }
    if (payload.password.trim() === "") {
      Toast.info("请输入密码!", 0.5);
      return false;
    }
    const response = await fetch.post("/login", payload);
    if (!response.code) {
      Toast.info(response.message, 0.5);
      return false;
    } else {
      Toast.success(response.message, 0.5);
      localStorage.setItem("qq-token", response.token);
      dispatch(setUserValue({
        key:'info',
        value:response.info
      }));
      setTimeout(() => {
        dispatch(setUserValue({
          key:'isLogin',
          value:true
        }));
        window.socket.emit("login", response.uId);
      }, 0);
    }
  };
  render() {
    const {} = this.props;
    const { val, password } = this.state;
    return (
      <Wrapper>
        <Top>
          <img src={rqkImg} alt="qq" />
          <span>QQ</span>
        </Top>
        <Middle>
          <List>
            <InputItem
              autoFocus
              clear
              onChange={this.inputChange.bind(null, "val")}
              value={val}
              placeholder={"QQ号/手机号"}
            />
            <InputItem
              clear
              onChange={this.inputChange.bind(null, "password")}
              value={password}
              placeholder={"密码"}
              type={"password"}
            />
            {_.times(2, i => <WhiteSpace key={i} />)}
            <Button type={"primary"} onClick={this.login}>
              登陆
            </Button>
            <a>
              <span>忘记密码?</span>
            </a>
            <Link to="/register">
              <span>新用户注册</span>
            </Link>
          </List>
        </Middle>
        <Bottom>
          <p>
            登录即代表已阅读并同意<span>服务条款</span>
          </p>
        </Bottom>
      </Wrapper>
    );
  }
}

export default connect()(Login);
