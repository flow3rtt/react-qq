import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { List, InputItem, Button, WingBlank,Toast } from "antd-mobile";
import flcImg from "../assets/img/flc.png";
import { full } from "../assets/style/const";
import { getContacts } from "../store/reducers/contacts";
import fetch from "../fetch";

const Wrapper = styled.div`
  ${full("fixed")};
  overflow: hidden;
  background-color: #fafafa;
  z-index: 999;
  display: flex;
  flex-direction: column;
  .am-wingblank {
    flex: 1;
    > div:first-child {
      height: 80%;
      display: flex;
      flex-direction: column;
      align-items: center;
      > div:first-child {
        flex: 2;
        width: 100%;
        text-align: center;
        position: relative;
        > img {
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      > div:last-child {
        flex: 1;
        width: 100%;
      }
    }
  }
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
      text-align: center;
      font-size: 1rem;
    }
  }
  > div:nth-of-type(2) {
    display: flex;
    flex-direction: column;
    align-items: center;
    > span:first-child {
      letter-spacing: 1px;
      font-size: 1.2rem;
      overflow: hidden;
      max-width: 200px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;

class CG extends React.Component {
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      name: ""
    };
  }
  sendRequest =async () => {
    const { info, dispatch, history } = this.props;
    const {  name } = this.state;
    const response = await fetch.post("/cg", {
      id: info.uId,
      name,
      uName:info.udNickname
    });
    if (response.code == 1) {
      dispatch(getContacts(info.uId));
      Toast.success("创建成功~", 0.6);
      history.replace("/contacts");
    }
  };
  render() {
    const { history } = this.props;
    const { name } = this.state;
    return (
      <Wrapper>
        <Top>
          <div onClick={history.goBack}>
            <span />
          </div>
          <div>
            <span>编辑群资料</span>
          </div>
          <div />
        </Top>
        <WingBlank>
          <div>
            <div>
              <img alt="" src={"/api/v1/static/img/gf-default.png"} />
            </div>
            <div>
              <List>
                <InputItem
                  autoFocus
                  value={name}
                  onChange={v =>
                    this.setState({
                      name: v
                    })
                  }
                  placeholder={"填写群名称（2~10个字）"}
                />
              </List>
            </div>
          </div>
          <div>
            <Button
              disabled={name.length < 2}
              onClick={this.sendRequest}
              type={"primary"}
            >
              提交
            </Button>
          </div>
        </WingBlank>
      </Wrapper>
    );
  }
}

const mstp = ({ user }) => ({
  info: user.info
});

export default connect(mstp)(CG);
