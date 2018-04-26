import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import WelCome from "./WelCome";
import Layout from "./Layout";
const Wrapper = styled.div``;
class App extends React.Component {
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { isLogin, ...rest } = this.props;
    const {} = this.state;
    const Component = !isLogin ? WelCome : Layout;
    return (
      <Wrapper>
        <Component {...rest} />
      </Wrapper>
    );
  }
}

const mstp = ({ user }) => ({
  isLogin: user.isLogin
});

export default connect(mstp)(App);
