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

  async getBlockInfo() {
    const result = await axios.get(`${'http://localhost:3001/list'}/${linesPerPage}`);
    this.setState({
      data: result.data,
    });
  }

  onClick(){
    window.alert("東京の私立大学の文系学部に通う21歳の男");
  }

  render() {
    const list = [];
    if (this.state.data.length !== 0) {
      for (let i = 0; i < linesPerPage; i += 1) {
        list.push(
          <tr>
            <td>{this.state.data[i].hash}</td>
            <td>{this.state.data[i].height}</td>
            <td>{this.state.data[i].time}</td>
            <td>{this.state.data[i].size}</td>
          </tr>,
        );
      }
    }
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
          <button onClick={this.onClick}>First</button>
          <button onClick={this.onClick}>&lt;</button>
          <button onClick={this.onClick}>{this.state.data.length}</button>
          <button onClick={this.onClick}>&gt;</button>
          <button onClick={this.onClick}>Last</button>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
