import React, { Component } from 'react';
import SMSForm from './SMSForm';
import VisualSupport from './Broadcast';
import Client from './Client';

class Routing extends Component {
  state = {
    step: 1
  }

  nextStep = () => {
    const {step} = this.state;
    this.setState({
      step: step + 1
    });
  }

  render() {
    const {step} = this.state;

    switch(step) {
      case 1:
        return (
          <SMSForm nextStep={this.nextStep}/>
        )

        case 2:
          return (
            <VisualSupport nextStep={this.nextStep}/>
          )
        case 3:
          return (
            <Client nextStep={this.nextStep}/>
          )
    }
  }
}

export default Routing;
