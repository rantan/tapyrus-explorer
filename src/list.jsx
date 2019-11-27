import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './index.css';

const linesPerPage = 10;

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

  static onClick() {
  }

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
      console.log(`asanoyama: ${JSON.stringify(i)}`);
      // debugger;
      return (
        <tr>
          <td>{hash}</td>
          <td>{height}</td>
          <td>{time}</td>
          <td>{size}</td>
        </tr>
      );
    });
    return (
      <div className="App">
        <h1>LIST</h1>
        <table>
          <tbody>
            <td>BLOCKHASH</td>
            <td>HEIGHT</td>
            <td>TIME</td>
            <td>SiZE</td>
            {list}
          </tbody>
        </table>
        <div align="right">
          <button type="button" onClick={this.onClick}>First</button>
          <button type="button" onClick={this.onClick}>&lt;</button>
          <button type="button" onClick={this.onClick}>page-num</button>
          <button type="button" onClick={this.onClick}>&gt;</button>
          <button type="button" onClick={this.onClick}>Last</button>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
