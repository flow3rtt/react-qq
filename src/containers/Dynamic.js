import React from "react";
import styled from "styled-components";
import { full } from "../assets/style/const";
import Search from "../components/Search";
import Scroll from "../components/Scroll";
import { List } from "antd-mobile";
const Wrapper = styled.div`
  ${full("absolute")};
  overflow: hidden;
  background-color: #fafafa;
`;
const RowWrapper = styled.div`
  display: flex;
  height: 9.6rem;
  flex-direction: column;
  background-color: white;
  padding-top: 0.4rem;
  > div:last-child {
    display: flex;
    margin-top: 0.4rem;
    > div {
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: center;
      > img {
        height: 3.2rem;
        width: 3.2rem;
      }
      > span {
        padding-top: 0.4rem;
      }
    }
  }
`;
const ColumnWrapper = styled.div`
  margin-top: 1.2rem;
  .am-list-content {
    display: flex;
    align-items: center;
    padding: 0;
    > img {
      margin: 0 0.4rem;
      width: 2.4rem;
      height: 2.4rem;
      padding:0 .8rem;
    }
    > div {
      display: flex;
      height: 100%;
      align-items:center;
      flex:1;
      justify-content:space-between;
      > span {
        margin: 0;
        font-size: 1.2rem;
      }
      > img {
        color:#666;
        width:1.2rem;
        height:1.2rem;
      }
  }
`;

class Dynamic extends React.Component {
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {} = this.props;
    const {} = this.state;
    return (
      <Wrapper>
        <Scroll>
          <RowWrapper>
            <Search />
            <div>
              <div>
                <img src={require("../assets/img/igs.png")} alt="" />
                <span>好友动态</span>
              </div>
              <div>
                <img src={require("../assets/img/eqc.png")} alt="" />
                <span>附近</span>
              </div>
              <div>
                <img src={require("../assets/img/iei.png")} alt="" />
                <span>兴趣部落</span>
              </div>
            </div>
          </RowWrapper>
          <ColumnWrapper>
            <List>
              <List.Item>
                <img src={require("../assets/img/nhz.png")} alt="" />
                <div>
                  <span>游戏</span>
                  <img src={require("../assets/img/nqj.9.png")} alt="" />
                </div>
              </List.Item>
            </List>
          </ColumnWrapper>
        </Scroll>
      </Wrapper>
    );
  }
}
export default Dynamic;
