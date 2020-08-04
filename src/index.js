import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Routing from './Routing';
import Client from './Client';

const App = () => {
  return (
    <>
      <Router>
        <Route exact path={"/"} component={Routing} />
        <Route path={"/client"} component={Client} />
      </Router>
    </>
  )
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
