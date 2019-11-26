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
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
