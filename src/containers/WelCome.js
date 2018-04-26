import React from 'react';
import styled from 'styled-components';
import { full } from '../assets/style/const';
import indexImg from '../assets/img/index.png';
import { Link, Route, Switch, Redirect } from 'react-router-dom';
import Login from '../containers/Login';
import Register from '../containers/Register';
import fetch from '../fetch';
import { connect } from 'react-redux';
import { setUserValue } from '../store/reducers/user';

const Wrapper = styled.div`
  ${full('fixed')};
  background-image: url(${indexImg});
  background-size: contain;
  background-repeat: no-repeat;
`;
const LinkWrapper = styled.div`
  position: relative;
  top: 85%;
  margin: 0 0.6rem;
  display: flex;
  align-items: center;
  > a {
    flex: 1;
    margin: 0 0.3rem;
    display: inline-block;
    height: 3rem;
    line-height: 3rem;
    border-radius: 2px;
    color: white;
    text-align: center;
    text-decoration: none;
    &:first-child {
      background-color: #ccc;
    }
    &:last-child {
      background-color: #108ee9;
    }
    > span {
      font-size: 1.4rem;
      letter-spacing: 2px;
    }
  }
`;

const RouteWrapper = styled.div``;
class WelCome extends React.Component {
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      init: false
    };
  }
  async componentDidMount() {
    const { dispatch } = this.props;
    const response = await fetch.get('/userAuth');
    if (response.code !== 2) {
      dispatch(
        setUserValue({
          key: 'info',
          value: response.info
        })
      );
      setTimeout(() => {
        dispatch(
          setUserValue({
            key: 'isLogin',
            value: true
          })
        );
        window.socket.emit('login', response.uId);
      }, 0);
    } else {
      this.setState({
        init: true
      });
    }
  }

  render() {
    const {} = this.props;
    const { init } = this.state;
    return (
      <Wrapper>
        {init ? (
          <LinkWrapper>
            <Link to={'/login'}>
              <span>登录</span>
            </Link>
            <Link to={'/register'}>
              <span>新用户</span>
            </Link>
          </LinkWrapper>
        ) : null}
        <RouteWrapper>
          <Switch>
            <Route path={'/login'} component={Login} />
            <Route path={'/register'} component={Register} />
            <Redirect from={'/:path'} to={'/'} />
          </Switch>
        </RouteWrapper>
      </Wrapper>
    );
  }
}

export default connect()(WelCome);
