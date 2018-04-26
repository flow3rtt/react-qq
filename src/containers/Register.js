import React, { Fragment } from 'react';
import styled from 'styled-components';
import {
  List,
  InputItem,
  WingBlank,
  Button,
  WhiteSpace,
  Toast
} from 'antd-mobile';
import _ from 'lodash';
import fasImg from '../assets/img/fas.png';
import fzuImg from '../assets/img/fzu.png';
import hoyImg from '../assets/img/fzu.png';
import fetch from '../fetch';
import { full } from '../assets/style/const';

const Wrapper = styled.div`
  ${full('absolute')};
  background-color: white;
`;
const Top = styled.div`
  background: url(${fasImg}) no-repeat left center;
  line-height: 2rem;
  margin: 1.6rem 0 0 0.4rem;
  color: #666;
  padding-left: 1.6rem;
  cursor: pointer;
  display: inline-block;
  background-size: 2.4rem 2.4rem;
  font-size: 1.2rem;
`;
const First = styled.div`
  .am-list-line {
    border-bottom: 1px solid #ddd !important;
  }
  .am-input-label {
    text-align: right !important;
  }
  .am-list-line:first-of-type {
    &::after {
      height: 0 !important;
    }
  }
  p {
    margin-top: 0.8rem;
    > span {
      color: #1e90ff;
      cursor: pointer;
    }
  }
`;
const Second = styled.div`
  .am-wingblank {
    > p:first-of-type {
      margin-top: 0.8rem;
      color: #666;
      > span {
        color: orange;
      }
    }
    > p:last-of-type {
      color: #ccc;
      &.resend {
        color: #1e90ff;
        cursor: pointer;
      }
    }
    > div:last-of-type {
      margin-top: 1.2rem;
      > p {
        background: url(${fzuImg}) no-repeat;
        background-size: 1.4rem 1.4rem;
        padding-left: 1.8rem;
        background-position-y: center;
        line-height: 1.8rem;
        color: #666;
        &:last-child {
          margin-top: 0;
        }
        &:first-child {
          margin-bottom: 0;
        }
        > span {
          color: #1e90ff;
          cursor: pointer;
        }
      }
    }
  }

  ul {
    display: flex;
    padding: 0;
    margin: 0;
    // justify-content:space-around;
    li {
      margin: 0 0.4rem;
      list-style: none;
      padding-bottom: 0.2rem;
      border-bottom: 2px solid #ddd;
      width: 2rem;
      .am-list-item {
        height: 2rem !important;
        min-height: unset !important;
        .am-list-line {
          padding-right: unset !important;
          input {
            text-align: center;
          }
        }
      }
    }
  }
`;
const Third = styled.div`
  .am-list-body {
    border-top: unset !important;
  }
`;
const Fourth = styled.div`
  .am-wingblank {
    h1 {
      background: url(${hoyImg}) no-repeat left center;
      background-size: 3rem 3rem;
      padding-left: 3.2rem;
      margin-bottom: 2rem;
    }
    > div:last-child {
      > p:first-of-type {
        letter-spacing: 1px;
        color: #666;
        font-size: 1.4rem;
        margin-bottom: 0;
      }
      > p:nth-of-type(2) {
        font-size: 2.4rem;
        color: #000;
        margin-top: 1rem;
      }
      > p:last-of-type {
        margin-top: 1rem;
        text-align: center;
      }
    }
  }
`;

class Register extends React.Component {
  constructor(props) {
    super(props);
    let code = {};
    _.times(6, (i) => {
      code[i] = '';
    });
    this.state = {
      page: 1,
      phone: '',
      code,
      nickname: '',
      qq: '',
      password: ''
    };
  }

  back = () => {
    const { page } = this.state;
    if (page === 1) {
      const { history } = this.props;
      history.go(-1);
    } else if (page !== 4) {
      this.setState((prevState) => ({
        page: prevState.page - 1
      }));
    }
  };
  inputChange = (key, val) => {
    let payload = _.cloneDeep(this.state);
    _.set(payload, key, val);
    this.setState(payload, () => {
      if (key.indexOf('.') !== -1 && !!this.ulDom) {
        let index = +key.split('.')[1];
        let { code } = this.state;
        let result = '';
        _.times(6, (i) => {
          result += '' + code[i + ''];
        });
        if (result.length !== 6 && index <= 4) {
          let dom = this.ulDom.children[index + 1].querySelector('input');
          dom.focus();
        } else if (result.length === 6) {
          this.nextThrid(result);
        }
      }
    });
  };
  nextSecond = async () => {
    const { phone } = this.state;
    let bool = /^1[3|4|5|7|8][0-9]{9}$/.test(phone.replace(/\s/g, ''));
    if (!bool) {
      Toast.info('输入的手机号格式错误.', 1);
      return;
    }
    const response = await fetch.post('/checkPhone', {
      phone: phone.replace(/\s/g, '')
    });
    if (!response.code) {
      Toast.info(response.message, 1);
      return;
    }
    //send message
    this.setState({
      page: 2
    });
  };
  nextThrid = async (result) => {
    if (!result) {
      return;
    }
    const response = await fetch.post('validateCode', {
      code: result
    });
    if (!response.code) {
      Toast.info(response.message, 1);
      return;
    }
    this.setState({
      page: 3
    });
  };
  register = async () => {
    const { phone, nickname, password } = this.state;
    if (!nickname) {
      Toast.info('请输入昵称!', 1);
      return;
    }
    if (!password) {
      Toast.info('请输入密码!', 1);
      return;
    }
    if (password.length < 6) {
      Toast.info('密码必须大于6位!', 1);
      return;
    }
    const payload = { phone: phone.replace(/\s/g, ''), nickname, password };
    const response = await fetch.post('/register', payload);
    if (!response.code) {
      Toast.info(response.message, 1);
      return;
    }
    this.setState(
      {
        qq: response.uQq
      },
      () => {
        this.nextFourth();
      }
    );
  };
  nextFourth = () => {
    this.setState({
      page: 4
    });
  };
  login = () => {
    const { history } = this.props;
    history.replace('/login');
  };
  render() {
    const { page, phone, nickname, qq, password } = this.state;
    let phoneBtnDisabled = true;
    if (phone.replace(/\s/g, '').length === 11) {
      phoneBtnDisabled = false;
    }
    const {} = this.props;
    return (
      <Wrapper>
        <Top
          style={{
            visibility: page === 4 ? 'hidden' : 'unset'
          }}
          onClick={this.back}
        >
          返回
        </Top>
        <Fragment>
          {page === 1 ? (
            <First>
              <WingBlank>
                <h1>输入手机号</h1>
                <p>
                  注册即代表阅读并同意<span>使用条款</span>和<span>
                    隐私政策
                  </span>
                </p>
                <List>
                  <InputItem editable={false} value={'中国大陆'}>
                    国家/地区
                  </InputItem>
                  <InputItem
                    autoFocus
                    value={phone}
                    onChange={this.inputChange.bind(null, 'phone')}
                    type={'phone'}
                    clear
                  >
                    +86
                  </InputItem>
                  {_.times(2, (i) => <WhiteSpace key={i} />)}
                  <Button
                    disabled={phoneBtnDisabled}
                    onClick={this.nextSecond}
                    type={'primary'}
                  >
                    下一步
                  </Button>
                </List>
              </WingBlank>
            </First>
          ) : null}
          {page === 2 ? (
            <Second>
              <WingBlank>
                <h1>输入短信验证码</h1>
                <p>
                  我们已给手机号码<span>+86 {phone.replace(/\s/g, '')}</span>发送了一个6位数验证码(暂时固定为111111).
                </p>
                <ul ref={(dom) => (this.ulDom = dom)}>
                  {_.times(6, (i) => (
                    <li key={i}>
                      <InputItem
                        autoFocus={i === 0}
                        type={'number'}
                        onChange={this.inputChange.bind(null, `code.${i}`)}
                        maxLength={1}
                      />
                    </li>
                  ))}
                </ul>
                <p className={''}>
                  重新发送
                  <span />
                </p>
                <div>
                  <p>将此手机号码和QQ号绑定,提高账号安全性.</p>
                  <p>
                    开启<span>设备锁</span>,保证QQ账号安全
                  </p>
                </div>
              </WingBlank>
            </Second>
          ) : null}
          {page === 3 ? (
            <Third>
              <WingBlank>
                <h1>设置昵称密码</h1>
                <List>
                  <InputItem
                    value={nickname}
                    onChange={this.inputChange.bind(null, 'nickname')}
                    clear
                    placeholder={'昵称'}
                    autoFocus
                  />
                  <InputItem
                    value={password}
                    onChange={this.inputChange.bind(null, 'password')}
                    type={'password'}
                    placeholder={'密码'}
                    clear
                  />
                  {_.times(2, (i) => <WhiteSpace key={i} />)}
                  <Button onClick={this.register} type={'primary'}>
                    注册
                  </Button>
                </List>
              </WingBlank>
            </Third>
          ) : null}
          {page === 4 ? (
            <Fourth>
              <WingBlank>
                <h1>注册成功</h1>
                <div>
                  <p>你的QQ号为:</p>
                  <p>{qq}</p>
                  <Button onClick={this.login} type={'primary'}>
                    登陆
                  </Button>
                  <p>三天内未登陆，该QQ号将被回收</p>
                </div>
              </WingBlank>
            </Fourth>
          ) : null}
        </Fragment>
      </Wrapper>
    );
  }
}

export default Register;
