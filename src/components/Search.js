import React from "react";
import styled from "styled-components";
import searchImg from "../assets/img/okh.png";
import { flexCenter } from "../assets/style/const";
const Wrapper = styled.div`
  cursor: pointer;
  padding: 0.5rem 0.6rem;
  ${flexCenter()};
  > div {
    height: 2rem;
    line-height: 2rem;
    color: #666;
    background-color: #f7f6f6;
    text-align: center;
    border-radius: 2px;
    width: 100%;
    > img {
      height: 1.2rem;
      width: 1.2rem;
      vertical-align: middle;
    }
    > span {
      padding-left: 0.2rem;
    }
  }
`;
class Search extends React.Component {
  static defaultProps = {
    placeholder: "搜索"
  };
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { placeholder } = this.props;
    const {} = this.state;
    return (
      <Wrapper>
        <div>
          <img src={searchImg} alt={placeholder} />
          <span>{placeholder}</span>
        </div>
      </Wrapper>
    );
  }
}
export default Search;
