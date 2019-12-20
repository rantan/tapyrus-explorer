import React from 'react';
import axios from 'axios';
import './index.css';
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
  useLocation,
} from 'react-router-dom';
import queryString from 'querystring';
import detail from './detail';

function GetParams() {
  const location = window.location;
  const queryParams = queryString.parse(location.search.slice(1));
  return (
    queryParams.page
  );
}

class App extends React.Component {
  constructor(props, context) {
    console.log("const");
    super(props, context);
    this.state = {
      data: [],
      page: 1,
    };
  }

  componentDidMount() {console.log("didmount");
    this.getBlockInfo();
  }

  async getBlockInfo() {
    const result = await axios.get(`${'http://localhost:3001/api/list'}`, {
      params: {
        page: GetParams(),
        column: 15,
      },
    });
    this.setState({
      data: result.data,
      page: GetParams(),
    });
  }

  render() {console.log("render");
  // const volvol = this.getBlockInfo();
  // console.dir(volvol);
    const { data } = this.state;
    const { page } = this.state;
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
          {/* <button type="button" onClick={this.getBlockInfo.bind(this)}> */}
          <button type="button">
            <Link to={{
              pathname: '/list',
              search: '?page=1',
            }}
            >Prev
            </Link>
          </button>
          <button type="button">
          {/* <button type="button" onClick={this.getBlockInfo.bind(this)}> */}
            <Link to={{
              pathname: '/list',
              search: '?page=2',//+{page}+1,,
            }}
            >Next 
            </Link>
          </button>
        </div>
      </div>
    );
  }
}

export default App;
