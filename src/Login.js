import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey, faEnvelope, faExclamationTriangle, faCheck  } from '@fortawesome/free-solid-svg-icons'

import './SMSForm.css';

import style from './styles.module.css'

class Login extends Component {
  continue = e => {
    e.preventDefault();
    this.props.nextStep();
  }
  previous = e => {
    e.preventDefault();
    this.props.prevStep();
  }
  constructor(props) {
    super(props);
    this.state = {
      message: {
        email: '',
        password: ''
      },
      loginMessage: '',
      loggedin: false,
      submitting: false,
      error: false
    };
    this.onHandleChange = this.onHandleChange.bind(this);
    this.login = this.login.bind(this);
    this.loggedIn = this.loggedIn.bind(this);
    this.sendUser = this.sendUser.bind(this);
  }

  loggedIn() {
    this.props.nextStep();
    this.sendUser();
  }

  sendUser() {
    this.props.getUser(this.state.message.email);
  }

  onHandleChange(event) {
    const name = event.target.getAttribute('name');
    this.setState({
      message: { ...this.state.message, [name]: event.target.value }
    });
  }

  login(event) {
    event.preventDefault();
    this.setState({submitting: true});
    fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.message)
    })
    .then(res => res.json())
    .then(data => {
    if(data.success) {
      this.setState({
          error: false,
          loginMessage: data.message
        }, () => this.loggedIn())
      }
      else {
        this.setState({
          error: true,
          loginMessage: data.message,
          submitting: false
        })
      }
    });
  }

  render() {
    const {step} = this.props;
    return (
      <div className={style.main}>
        <div className={this.state.submitting ? style.loader : style.divOff}></div>
        <div className={style.row}>
          <div className={style.col}>
            <img className={style.image} src="col-bg.webp" width="100%" height="100%"/>
          </div>
          <div className={style.colform}>
            <h2 style={{ textAlign: 'left' }}>Welcome to VisualSupport!</h2>
            <div className={style.form}>
              <form className={this.state.error ? 'error sms-form' : 'sms-form'}>
              <div>
                <div className={style.forminput}>
                  <label className={this.state.message.email.length >= 6 ? style.labelstyleoff : style.labelstyleon } >Email address:</label>
                  <FontAwesomeIcon icon={faEnvelope} className={style.faicons} color={this.state.message.email.length >= 6 ? 'gray' : '#5c5CA1' } size="lg" />
                  <input
                  className={this.state.message.email.length >= 6  ? style.inputemailoff : style.inputemailon }
                    type="email"
                    name="email"
                    id="email"
                    value={this.state.message.email}
                    onChange={this.onHandleChange}
                  />
                  </div>
                </div>
                <div>
                <div className={style.forminput}>
                  <label htmlFor="to" className={this.state.message.password.length >= 6 ? style.labelstyleoff : style.labelstyleon }>Password:</label>
                  <FontAwesomeIcon icon={faKey} className={style.faicons} transform={{ rotate: 90 }} color={this.state.message.password.length >= 6  ? 'gray' : '#5c5CA1' } size="lg" />
                  <input
                    className={this.state.message.password.length >= 6  ? style.inputphoneoff : style.inputphoneon }
                    type="password"
                    name="password"
                    id="password"
                    value={this.state.message.password}
                    onChange={this.onHandleChange}
                  />
                  </div>
                </div>
              </form>
            </div>
            <div className={this.state.error ? style.errorMessage : style.divOff}>{this.state.error ? <FontAwesomeIcon icon={faExclamationTriangle} className={style.errorIcon} color="white" size="xs" /> : null} <span className={style.textSuccess}>{this.state.loginMessage ? this.state.loginMessage : null}</span></div>
            <div className={this.state.loggedin ? style.successMessage : style.divOff}>{this.state.loggedin ? <FontAwesomeIcon icon={faCheck} className={style.errorIcon} color="white" size="xs" /> : null} <span className={style.textSuccess}>{this.state.loginMessage ? this.state.loginMessage : null}</span></div>
            <button onClick={this.login} disabled={this.state.submitting} className={style.buttonsignup}>Login Now</button>
            or
            <button onClick={this.previous} className={style.buttonlogin}>Sign Up</button>
          </div>

        </div>
      </div>
    );
  }

}

export default Login;
