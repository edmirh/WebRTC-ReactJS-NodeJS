import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faEnvelope, faPhone, faExclamationTriangle, faCheck } from '@fortawesome/free-solid-svg-icons'

import './SMSForm.css';

import style from './styles.module.css'

class Signup extends Component {
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
        name: '',
        email: '',
        phone: ''
      },
      created: false,
      submitting: false,
      signupMessage: '',
      error: false
    };
    this.onHandleChange = this.onHandleChange.bind(this);
    this.signUp = this.signUp.bind(this);
  }

  onHandleChange(event) {
    const name = event.target.getAttribute('name');
    this.setState({
      message: { ...this.state.message, [name]: event.target.value }
    });
  }

  signUp(event) {
    event.preventDefault();
    this.setState({submitting: true});
    fetch('/auth/signup', {
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
          submitting: false,
          created: true,
          signupMessage: data.message,
          message: {
            name: '',
            email: '',
            phone: ''
          }
        });
      }
      else {
        this.setState({
          error: true,
          created: false,
          submitting: false,
          signupMessage: data.message
        })
      }
    });
  }


  render() {
    if(this.state.created) {
      setTimeout(() => {
        this.props.nextStep();
      }, 3000);
    }
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
                    <label className={this.state.message.name.length >= 5 ? style.labelstyleoff : style.labelstyleon } >Your name: </label>
                    <FontAwesomeIcon icon={faUser} className={style.faicons} color={this.state.message.name.length >= 5 ? 'gray' : '#5c5CA1' } size="lg" />
                    <input
                    className={this.state.message.name.length >= 5  ? style.inputnameoff : style.inputnameon }
                      type="text"
                      name="name"
                      id="name"
                      value={this.state.message.name}
                      onChange={this.onHandleChange}
                    />
                  </div>
                </div>
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
                  <label htmlFor="to" className={this.state.message.phone.length >= 10 ? style.labelstyleoff : style.labelstyleon }>Phone:</label>
                  <FontAwesomeIcon icon={faPhone} className={style.faicons} transform={{ rotate: 90 }} color={this.state.message.phone.length >= 10  ? 'gray' : '#5c5CA1' } size="lg" />
                  <input
                    className={this.state.message.phone.length >= 10  ? style.inputphoneoff : style.inputphoneon }
                    type="tel"
                    name="phone"
                    id="phone"
                    value={this.state.message.phone}
                    onChange={this.onHandleChange}
                  />
                  </div>
                </div>
              </form>
            </div>
            <div className={this.state.error ? style.errorMessage : style.divOff}>{this.state.error ? <FontAwesomeIcon icon={faExclamationTriangle} className={style.errorIcon} color="white" size="xs" /> : null} <span className={style.textSuccess}>{this.state.signupMessage ? this.state.signupMessage : null}</span></div>
            <div className={this.state.created ? style.successMessage : style.divOff}>{this.state.created ? <FontAwesomeIcon icon={faCheck} className={style.errorIcon} color="white" size="xs" /> : null} <span className={style.textSuccess}>{this.state.signupMessage ? this.state.signupMessage : null}</span></div>
            <button onClick={this.signUp} disabled={this.state.submitting} className={style.buttonsignup}>Sign Up Now</button>
            or
            <button onClick={this.continue} className={style.buttonlogin}>Login</button>
          </div>

        </div>
      </div>
    );
  }
}

export default Signup;
