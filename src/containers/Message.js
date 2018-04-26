import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import _ from "lodash";
import Scroll from "../components/Scroll";
import { Badge, SwipeAction, List } from "antd-mobile";
import { full } from "../assets/style/const";
import { parseTime } from "../assets/utils";
import Search from "../components/Search";

const Wrapper = styled.div`
  ${full("absolute")};
  overflow: hidden;
  background-color: #fafafa;
`;

const UlWrapper = styled.ul`
  padding: 0;
  margin: 0;
  > li {
    list-style: none;
    .am-list-line {
      padding: unset;
      .am-list-content {
        height: 4rem;
        padding: 0rem 0.8rem;
        border-bottom: 1px solid #eee;
        display: flex;
        align-items: center;
        > img {
          display: inline-block;
          border-radius: 50%;
          height: 2.8rem !important;
          width: 2.8rem !important;
        }
        > div:last-child {
          padding-left: 0.4rem;
          height: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex: 1;
          > div {
            display: 100%;
            display: flex;
            flex-direction: column;
          }
          > div:first-child {
            > span {
              display: inline-block;
            }
            > span:first-child {
              font-size: 1.2rem;
            }
            > span:last-child {
              font-size: 1rem;
              color: #666;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          > div:last-child {
            > span:first-child {
              font-size: 1rem;
              color: #666;
            }
            > span:last-child {
              .am-badge-text {
                height: 14px;
                line-height: 14px;
                padding: unset;
                min-width: unset;
                margin-top: 1px;
                width: 1.2rem;
                transform: unset;
                margin-left: auto;
              }
            }
          }
        }
      }
    }
  }
`;

class Message extends React.Component {
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {};
  }
  enterPath = path => {
    const { history } = this.props;
    history.push(path);
  };
  render() {
    const { layoutMessage } = this.props;
    const {} = this.state;
    return (
      <Wrapper>
        <Scroll>
          <Search />
          <UlWrapper>
            {_.map(layoutMessage, (v, i) => (
              <li key={i}>
                <SwipeAction
                  style={{ backgroundColor: "gray" }}
                  autoClose
                  right={[
                    {
                      text: "置顶",
                      onPress: () => console.log("toped"),
                      style: {
                        backgroundColor: "#ddd",
                        color: "white",
                        padding: "0 1rem"
                      }
                    },
                    {
                      text: "删除",
                      onPress: () => console.log("delete"),
                      style: {
                        backgroundColor: "red",
                        color: "white",
                        padding: "0 1rem"
                      }
                    }
                  ]}
                  onOpen={() => {}}
                  onClose={() => {}}
                >
                  <List.Item
                    onClick={this.enterPath.bind(
                      null,
                      `/chat_${v.type === "private" ? "one" : "group"}/${v.id}`
                    )}
                  >
                    <img alt={v.name} src={`/api/v1/static${v.face}`} />
                    <div>
                      <div>
                        <span>{v.name}</span>
                        <span>{v.content}</span>
                      </div>
                      <div>
                        <span>{parseTime(v.time)}</span>
                        <Badge
                          style={{
                            visibility: v.unread !== "0" ? "unset" : "hidden"
                          }}
                          text={v.unread}
                        />
                      </div>
                    </div>
                  </List.Item>
                </SwipeAction>
              </li>
            ))}
          </UlWrapper>
        </Scroll>
      </Wrapper>
    );
  }
}

const mstp = ({ message }) => {
  return _.assign({}, message);
};
export default connect(mstp)(Message);
