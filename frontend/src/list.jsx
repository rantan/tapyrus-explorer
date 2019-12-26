import React from 'react';
import axios from 'axios';
import './index.css';
import {
  Link,
  Route,
  Switch,
} from 'react-router-dom';
import queryString from 'querystring';
import detail from './detail';

function GetParams() {
  const { location } = window;
  const queryParams = queryString.parse(location.search.slice(1));
  return (
    queryParams.page
  );
}

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      data: [],
      page: 1,
    };
  }

  componentDidMount() {
    this.getBlockInfo();
  }

  async getBlockInfo() {
    const result = await axios.get(`${'http://localhost:3001/api/list'}`, {
      params: {
        page: GetParams(),
        column: 10,
      },
    });
    this.setState({
      data: result.data,
      page: GetParams(),
    });
  }

  render() {
    const { data } = this.state;
    const { page } = this.state;

    if (page !== GetParams()) {
      this.getBlockInfo();
    }

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
            <Route path="/block" component={detail} />
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

        <div align="left">
          <button type="button">
            <Link to={`/list?page=${Number(page) - 1}`}>Prev
            </Link>
          </button>
          <button type="button">
            <Link to={`/list?page=${Number(page) + 1}`}>Next
            </Link>
          </button>
        </div>

        <table>
          <tbody>
            <td>BLOCKHASH</td>
            <td>HEIGHT</td>
            <td>TIME</td>
            <td>SIZE</td>
            {list}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
