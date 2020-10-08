import React, { Component } from 'react';
import Signup from './Signup';
import VisualSupport from './Broadcast';
import Client from './Client';
import Login from './Login';

class Routing extends Component {
  state = {
    step: 1,
    email: ''
  }

  nextStep = () => {
    const {step} = this.state;
    this.setState({
      step: step + 1,
      email: ''
    });
  }

  prevStep = () => {
    const {step} = this.state;
    this.setState({
      step: step - 1
    });
  }

  getUser = (email) => {
    this.setState({
      email: email
    });
  }

  render() {
    const {step} = this.state;

    switch(step) {
      case 1:
        return (
          <Signup nextStep={this.nextStep} />
        )
        case 2:
          return (
           <Login nextStep={this.nextStep} prevStep={this.prevStep} getUser={this.getUser} />
          ) 
        case 3:
          return (
            <Client nextStep={this.nextStep} email={this.state.email} />
          )
        case 4:
          return (
            <VisualSupport nextStep={this.nextStep} />
          )
    }
  }
}

export default Routing;
