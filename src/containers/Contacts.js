import React from "react";
import styled from "styled-components";
import { full } from "../assets/style/const";
import Search from "../components/Search";
import Scroll from "../components/Scroll";
import { Tabs, Accordion, List } from "antd-mobile";
import { connect } from "react-redux";
import cx from "classnames";
import faiImg from "../assets/img/fai.png";
import vipImg from "../assets/img/vip.png";
import svipImg from "../assets/img/svip.png";
import _ from "lodash";
import { parseTime } from "../assets/utils";
const Wrapper = styled.div`
  ${full("absolute")};
  overflow: hidden;
  background-color: #fafafa;
`;
const TopWrapper = styled.div`
  background-color: white;
  > div:last-child {
    > div {
      border-top: 1px solid #eee;
      height: 2.6rem;
      line-height: 2.6rem;
      padding: 0 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      > img {
        display: inline-block;
        width: 1rem;
        height: 1rem;
      }
    }
  }
`;

const tabs = [
  { title: "好友", key: "hy" },
  { title: "群聊", key: "ql" },
  { title: "设备", key: "sb" },
  { title: "通讯录", key: "txl" },
  { title: "公众号", key: "gzh" }
];

const HyWrapper = styled.div`
  .am-accordion {
    &::before {
      display: none !important;
    }
    .am-accordion-header {
      padding-left: 2.4rem !important;
      padding-right: 1.2rem !important;
      height: 2.6rem !important;
      line-height: 2.6rem !important;
      font-size: 14px !important;
      > i {
        left: 0.6rem;
        top: 0.6rem !important;
        height: 14px !important;
        width: 14px !important;
      }
      > div:last-child {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        > span:last-of-type {
          color: #666;
          font-size: 1rem;
        }
      }
      &::after {
        display: none !important;
      }
    }
    .am-accordion-content {
      .am-accordion-content-box {
        border-bottom: none !important;
        .am-list-body {
          border: none !important;
          .am-list-line {
            border-bottom: none !important;
          }
          .am-list-content {
            > div {
              > p:first-child {
                &.vip {
                  > span {
                    color: red;
                    padding-right: 0.2rem;
                  }
                  > img {
                    display: inline;
                    height: 1rem;
                  }
                }
                > img {
                  display: none;
                }
              }
            }
          }
        }
      }
    }
  }
`;
const QlWrapper = styled.div``;
const SbWrapper = styled.div``;
const TxlWrapper = styled.div`
  .am-list-content {
    align-items: center;
    justify-content: space-between;
    height: 3.6rem !important;
    padding-left: 0.8rem !important;
    background-color: white;
    > span {
      font-size: 1.2rem !important;
    }
    > div {
      > span {
        color: #666;
        font-size: 1rem;
      }
    }
  }
`;
const GzhWrapper = styled.div`
  .am-list-content {
    align-items: center;
    justify-content: space-between;
    height: 3.6rem !important;
    padding-left: 0.8rem !important;
    background-color: white;
    > span {
      font-size: 1.2rem !important;
    }
    > div {
      > span {
        color: #666;
        font-size: 1rem;
      }
    }
  }
`;

const TabWrapper = styled.div`
  margin-top: 0.6rem;
  .am-tabs-default-bar-tab{
    border-bottom:none !important;
  }
  .am-tabs-tab-bar-wrap {
    > div:first-child {
      padding-right: 30%;
      > div:first-child {
        > div:not(:last-child) {
          width: unset !important;
          padding: 0.8rem;
          height: 3rem;
          font-size: 14px;
          line-height: 3rem;
          &::after {
            display: none;
          }
        }
        > div:first-child {
          padding-left: 1.6rem;
          &::after {
            display: block;
            width: 100vw;
          }
        }
        > div:last-child {
          display: none;
        }
      }
    }
  }
  .am-list-content {
    display: flex;
    align-items: center;
    height: 3.6rem;
    padding: 0;
    > img {
      margin: 0 0.4rem;
      width: 2.6rem;
      height: 2.6rem;
      border-radius: 50%;
    }
    > div {
      display: flex;
      height: 100%;
      flex-direction: column;
      justify-content: center;
      > p {
        margin: 0;
        font-size: 1rem;
      }
      > p:last-child {
        color:#666;
        font-size:1rem;
        transform: translateY(-0.2rem);
      }
  }
`;
class Contacts extends React.Component {
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      page: 0
    };
  }
  componentDidMount() {}
  componentDidUpdate(prevProps) {
    if (
      !_.isEqual(prevProps.friends, this.props.friends) ||
      !_.isEqual(prevProps.groups, this.props.groups)
    ) {
      setTimeout(() => {
        this.setState(
          {
            page: 1
          },
          () => {
            this.setState(
              {
                page: 0
              },
              () => {}
            ); //解决异步数据tab不更新
          }
        );
      }, 0);
    }
  }

  getOnlineCount = friends => {
    return friends.filter(t => t.status !== "0").length;
  };
  enterPath = path => {
    const { history } = this.props;
    history.push(path);
  };
  tabChange = (_, page) => {
    this.setState({
      page
    });
  };
  renderTab = tab => {
    const { key } = tab;
    const { friends, groups } = this.props;
    let component = null;
    switch (key) {
      case "hy": {
        component = (
          <HyWrapper>
            <Accordion>
              {_.map(friends, (f, key) => (
                <Accordion.Panel
                  header={
                    <div>
                      <span>{key}</span>
                      <span>{`${this.getOnlineCount(f)}/${f.length}`}</span>
                    </div>
                  }
                  key={key}
                >
                  <List>
                    {_.map(f, (v, i) => (
                      <List.Item
                        key={i}
                        onClick={this.enterPath.bind(null, `/chat_one/${v.id}`)}
                      >
                        <img
                          style={{
                            opacity: v.status === "0" ? 0.5 : 1
                          }}
                          alt={v.note}
                          src={`/api/v1/static${v.face}`}
                        />
                        <div>
                          <p
                            className={cx({
                              vip: v.type !== "0" && v.status !== "0"
                            })}
                          >
                            <span>{v.note}</span>
                            <img
                              src={v.type === "1" ? vipImg : svipImg}
                              alt={"vip"}
                            />
                          </p>
                          <p>
                            <span>{`[${v.statusText}] ${v.sign}`}</span>
                          </p>
                        </div>
                      </List.Item>
                    ))}
                  </List>
                </Accordion.Panel>
              ))}
            </Accordion>
          </HyWrapper>
        );
        break;
      }
      case "ql": {
        component = (
          <QlWrapper>
            <List>
              {_.map(groups, (g, i) => (
                <List.Item
                  key={i}
                  onClick={this.enterPath.bind(null, `/chat_group/${g.id}`)}
                >
                  <img alt={g.name} src={`/api/v1/static${g.face}`} />
                  <div>
                    <p>{g.name}</p>
                    <p>{`最近活跃:${parseTime(new Date())}`}</p>
                  </div>
                </List.Item>
              ))}
            </List>
          </QlWrapper>
        );
        break;
      }
      case "sb": {
        component = (
          <SbWrapper>
            <List>
              <List.Item>
                <img src={require("../assets/img/feb.png")} alt="" />
                <div>
                  <p> 我的电脑 </p>
                  <p>[在线] 无需数据线,手机轻松传文件到电脑</p>
                </div>
              </List.Item>
              <List.Item>
                <img src={require("../assets/img/oxy.png")} alt="" />
                <div>
                  <p> 我的打印机 </p>
                  <p>将手机或照片发到电脑连接的打印机里</p>
                </div>
              </List.Item>
              <List.Item>
                <img src={require("../assets/img/nrg.png")} alt="" />
                <div>
                  <p> 发现新设备 </p>
                  <p> 搜索附近的设备,用QQ轻松连接设备</p>
                </div>
              </List.Item>
            </List>
          </SbWrapper>
        );
        break;
      }
      case "txl": {
        component = (
          <TxlWrapper>
            <List>
              <List.Item>
                <span>通讯录</span>
                <div>
                  <span>未开启权限</span>
                </div>
              </List.Item>
            </List>
          </TxlWrapper>
        );
        break;
      }
      case "gzh": {
        component = (
          <GzhWrapper>
            <List>
              <List.Item>
                <span>公众号</span>
                <div>
                  <span>无</span>
                </div>
              </List.Item>
            </List>
          </GzhWrapper>
        );
        break;
      }

      default:
        break;
    }
    return component;
  };
  render() {
    const { page } = this.state;
    return (
      <Wrapper>
        <Scroll>
          <TopWrapper>
            <Search />
            <div>
              <div onClick={this.enterPath.bind(null,`/add_friend`)}>
                <span>新朋友</span>
                <img src={faiImg} alt={""} />
              </div>
              <div onClick={this.enterPath.bind(null,`/add_group`)}>
                <span>群聊</span>
                <img src={faiImg} alt={""} />
              </div>
            </div>
          </TopWrapper>
          <TabWrapper>
            <Tabs
              initialPage={0}
              tabs={tabs}
              page={page}
              onChange={this.tabChange}
            >
              {this.renderTab}
            </Tabs>
          </TabWrapper>
        </Scroll>
      </Wrapper>
    );
  }
}
const mstp = ({ contacts, user }) => {
  return _.assign({}, contacts, { info: user.info });
};
export default connect(mstp)(Contacts);
