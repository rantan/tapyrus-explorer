import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import './index.css';
import { numberLiteralTypeAnnotation } from '@babel/types';

let linesPerPage = 10;

class App extends React.Component{
  constructor(props,context){
    super(props,context)
    this.state = {
      data :  []
    }
  }

  getBlockInfo = () => {
    axios.get(`${"http://localhost:3001/list"}/${linesPerPage}`).then(res=>{
      for(let i=0; i<linesPerPage; i++){
        this.setState({
          data : res.data
        });
      }
    });
  };

  componentDidMount(){
    this.getBlockInfo();
  }

  render(){
    let list = [];
    if(this.state.data.length != 0){
      for(let i=0; i<linesPerPage; i++){
        list.push(
         <tr>
           <td>{this.state.data[i].hash}</td>
           <td>{this.state.data[i].height}</td>
           <td>{this.state.data[i].time}</td>
           <td>{this.state.data[i].size}</td>
        </tr>
        )
      }
    }
  
    return(
      <div className="App">
        <h1>LIST</h1>
        <table><tbody>
        <td>BLOCKHASH</td><td>HEIGHT</td><td>TIME</td><td>SiZE</td>
        {list}
        </tbody></table>
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
