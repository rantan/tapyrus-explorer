import React, { Component } from 'react';
import './index.css';

import {
  Route,
  Link,
  Switch,
  Redirect,
} from 'react-router-dom';

import detail from './detail.jsx';
import list from './list.jsx';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">HOME</h1>
        </header>
        <div className="App-intro">
          <button type="button">
            <Link to={`/list?page=1`}>list</Link>
          </button>
          <Switch>
            <Route exact path="/list" component={list} />
            <Route path="/block" component={detail} />
            <Redirect to="/list" />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
