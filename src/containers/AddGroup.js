import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import fetch from "../fetch";
import { full } from "../assets/style/const";
import flcImg from "../assets/img/flc.png";
import Scroll from "../components/Scroll";
import { List, InputItem, Toast } from "antd-mobile";
import { getContacts } from "../store/reducers/contacts";

const Wrapper = styled.div`
  ${full("fixed")};
  overflow: hidden;
  background-color: #fafafa;
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
const Middle = styled.div`
  flex: 1;
  overflow: hidden;
`;

const ListWrappper = styled.div`
  .am-list-line {
    padding: 0;
    .am-list-content {
      display: flex;
      height: 4rem;
      align-items: center;
      font-size: 0;
      > img {
        height: 3.8rem;
        width: 3.8rem;
        border-radius: 50%;
        padding: 0 0.6rem;
      }
      > div:last-child {
        display: flex;
        flex-direction: column;
        > p {
          margin: 0;
          font-size: 1rem;
          line-height: 0.88;
        }
        > p:first-child {
          font-size: 1.2rem;
        }
        > p:last-child {
          min-height: 1rem;
          display: inline-block;
          color: #eee;
          transform: scale(0.88);
        }

        > p:nth-child(2) {
          > span {
            padding: 2.4px 8px;
            border-radius: 4px;
            border: 1px solid red;
            transform: scale(0.66);
            display: inline-block;
          }
        }
      }
    }
  }
`;

const SingerWrappper = styled.div`
  > div:first-child {
    display: flex;
    align-items: center;
    margin: 1.4rem 0.6rem;
    > img {
      height: 3.8rem;
      width: 3.8rem;
      border-radius: 50%;
      padding: 0 0.6rem;
    }
    > div:last-child {
      display: flex;
      flex-direction: column;
      > p {
        margin: 0;
        font-size: 1rem;
      }
      > p:first-child {
        font-size: 1.4rem;
      }
      > p:last-child {
        > span {
          padding-right: 2px;
        }
      }
    }
  }
  > div:last-child {
    .am-input-label {
      text-align: end;
    }
  }
`;
class AddGroup extends React.Component {
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      index: 1,
      selectIndex: -1,
      name: ""
    };
  }
  componentDidMount() {
    this.getGroups();
  }
  getGroups = async () => {
    const { info } = this.props;
    const response = await fetch.post("/get_groups", {
      uId: info.uId
    });
    if (response.code == "1") {
      this.setState({
        groups: response.result
      });
    }
  };
  selectIndex = i => {
    this.setState({
      selectIndex: i
    });
  };
  sendRequest = async () => {
    const { info, dispatch, history } = this.props;
    const { groups, selectIndex, name } = this.state;
    const response = await fetch.post("/add_group", {
      id: info.uId,
      name: !name ? info.udNickname : name,
      gId: groups[selectIndex].id
    });
    if (response.code == 1) {
      dispatch(getContacts(info.uId));
      Toast.success("加入成功~", 0.6);
      history.replace("/contacts");
    }
  };
  render() {
    const { history } = this.props;
    const { groups, selectIndex, name } = this.state;
    const group = selectIndex === -1 ? {} : groups[selectIndex];
    return (
      <Wrapper>
        {selectIndex === -1 ? (
          <Top>
            <div onClick={history.goBack}>
              <span />
            </div>
            <div>
              <span>推荐群</span>
            </div>
            <div onClick={()=>{
              history.replace('/cg')
            }}>
              <span>创建</span>
            </div>
          </Top>
        ) : (
          <Top>
            <div onClick={this.selectIndex.bind(null, -1)}>
              <span />
            </div>
            <div>
              <span>加入群</span>
            </div>
            <div onClick={this.sendRequest}>
              <span>发送</span>
            </div>
          </Top>
        )}
        <Middle>
          {!!groups.length ? (
            <React.Fragment>
              {selectIndex === -1 ? (
                <ListWrappper>
                  <Scroll>
                    <List>
                      {groups.map((v, i) => (
                        <List.Item
                          key={i}
                          onClick={this.selectIndex.bind(null, i)}
                        >
                          <img alt="" src={`/api/v1/static${v.face}`} />
                          <div>
                            <p>
                              <span>{v.name}</span>
                            </p>
                            <p>
                              <span>{v.count}</span>
                            </p>
                            <p>
                              <span>{v.intro}</span>
                            </p>
                          </div>
                        </List.Item>
                      ))}
                    </List>
                  </Scroll>
                </ListWrappper>
              ) : (
                <SingerWrappper>
                  <div>
                    <img alt="" src={`/api/v1/static${group.face}`} />
                    <div>
                      <p>
                        <span>{group.name}</span>
                      </p>
                      <p>
                        <span>{group.intro}</span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <List>
                      <InputItem
                        clear
                        autoFocus
                        value={name}
                        onChange={v => {
                          this.setState({
                            name: v
                          });
                        }}
                      >
                        群昵称
                      </InputItem>
                    </List>
                  </div>
                </SingerWrappper>
              )}
            </React.Fragment>
          ) : null}
        </Middle>
      </Wrapper>
    );
  }
}

const mstp = ({ user }) => ({
  info: user.info
});

export default connect(mstp)(AddGroup);
