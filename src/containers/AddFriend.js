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
          font-size: 1.4rem;
        }
        > p:last-child {
          min-height: 1rem;
          display: inline-block;
          color: #eee;
          transform: scale(0.88);
        }

        > p:nth-child(2) {
          > span {
            padding: 2.4px 4.8px;
            border-radius: 4px;
            border: 1px solid;
            transform: scale(0.66);
            display: inline-block;
          }
          > span:last-child {
            border-color: blueviolet;
          }
          > span:nth-child(2) {
            border-color: bisque;
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
class AddFriend extends React.Component {
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      friends: [],
      index: 1,
      selectIndex: -1,
      note: ""
    };
  }
  componentDidMount() {
    this.getFriends();
  }
  getFriends = async () => {
    const { info } = this.props;
    const response = await fetch.post("/get_friends", {
      uId: info.uId
    });
    if (response.code == "1") {
      this.setState({
        friends: response.result
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
    const { friends, selectIndex, note } = this.state;
    const response = await fetch.post("/add_friend", {
      id: info.uId,
      note: !note ? friends[selectIndex].name : note,
      name: info.udNickname,
      fId: friends[selectIndex].id
    });
    if (response.code == 1) {
      dispatch(getContacts(info.uId));
      Toast.success("添加成功~", 0.6);
      history.replace("/contacts");
    }
  };
  render() {
    const { history } = this.props;
    const { friends, selectIndex, note } = this.state;
    const friend = selectIndex === -1 ? {} : friends[selectIndex];
    return (
      <Wrapper>
        {selectIndex === -1 ? (
          <Top>
            <div onClick={history.goBack}>
              <span />
            </div>
            <div>
              <span>新朋友</span>
            </div>
            <div />
          </Top>
        ) : (
          <Top>
            <div onClick={this.selectIndex.bind(null, -1)}>
              <span />
            </div>
            <div>
              <span>添加朋友</span>
            </div>
            <div onClick={this.sendRequest}>
              <span>发送</span>
            </div>
          </Top>
        )}
        <Middle>
          {!!friends.length ? (
            <React.Fragment>
              {selectIndex === -1 ? (
                <ListWrappper>
                  <Scroll>
                    <List>
                      {friends.map((v, i) => (
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
                              <span
                                style={{
                                  borderColor: v.sex == "男" ? "aqua" : "coral"
                                }}
                              >
                                {v.age}
                              </span>
                              <span>{v.xz}</span>
                              <span>{v.place}</span>
                            </p>
                            <p>
                              <span>{v.qm}</span>
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
                    <img alt="" src={`/api/v1/static${friend.face}`} />
                    <div>
                      <p>
                        <span>{friend.name}</span>
                      </p>
                      <p>
                        <span>{friend.sex}</span>
                        <span>{`${friend.age}岁`}</span>
                        <span>{friend.place}</span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <List>
                      <InputItem
                        clear
                        autoFocus
                        value={note}
                        onChange={v => {
                          this.setState({
                            note: v
                          });
                        }}
                      >
                        备注
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

export default connect(mstp)(AddFriend);
