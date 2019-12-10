import React from 'react';
import axios from 'axios';
import './index.css';
import detail from './detail';
import {
  Link,
  Route,
  Switch
} from 'react-router-dom';


const linesPerPage = 15;

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    this.getBlockInfo();
  }

  static onClick() {}

  async getBlockInfo() {
    const result = await axios.get(`${'http://localhost:3001/list'}/${linesPerPage}`);
    this.setState({
      data: result.data,
    });
  }

  render() {
    const { data } = this.state;
    const list = data.map((i) => {
      const {
        hash, height, time, size,
      } = i;
      return (
        <tr>
          <td><Link to={`/block/${hash}`}>{hash}</Link></td>
          <td><Link to={`/block/${hash}`}>{height}</Link></td>
          <td>{time}</td>
          <td>{size}</td>
          <Switch>
            <Route path="block" component={detail} />
          </Switch>
          
        </tr>
      );
    });


    list.sort(
      (a, b) => (a < b ? 1 : -1),
    );

    return (
      <div className="App">
        <h1>LIST</h1>
        <table>
          <tbody>
            <td>BLOCKHASH</td>
            <td>HEIGHT</td>
            <td>TIME</td>
            <td>SIZE</td>
            {list}
          </tbody>
        </table>
        <div align="right">
          <button type="button" onClick={this.onClick}>First</button>
          <button type="button" onClick={this.onClick}>&lt;</button>
          <button type="button" onClick={this.onClick}>Number</button>
          <button type="button" onClick={this.onClick}>&gt;</button>
          <button type="button" onClick={this.onClick}>Last</button>
        </div>
      </div>
    );
  }
}

export default App;
