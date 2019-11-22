import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import './index.css';

let blockHash = "3272350d554f75cb407813ee1ebe8c96fea5dc6c82623b20876d97ea27b18f61";
class App extends React.Component{
  constructor(props,context){
    super(props,context)
    this.state = {
      blockHash             :  "hash",
      ntx                   :  "ntx",
      height                :  "height",
      timestamp             :  "time",
      proof                 :  "nonce",
      sizeBytes             :  "size",
      version               :  "version",
      merkleRoot            :  "merkleRoot",
      immutableMerkleRoot   :  "immutable",
      previousBlock         :  "previousblockhash",
      nextBlock             :  "nextblockhash",
    }
  }

  getBlockInfo(){
    let result = axios.get(`${"http://localhost:3001/blocks"}/${blockHash}`).then(res=>{
      this.setState({
        blockHash             :  res.data.blockHash,
        ntx                   :  res.data.ntx,
        height                :  res.data.height,
        timestamp             :  res.data.timestamp,
        proof                 :  res.data.proof,
        sizeBytes             :  res.data.sizeBytes,
        version               :  res.data.version,
        merkleRoot            :  res.data.merkleRoot,
        immutableMerkleRoot   :  "immutable",
        previousBlock         :  res.data.previousBlock,
        nextBlock             :  res.data.nextBlock,
      });
    })
  }

  render(){
    return(
      <div className="App">
        <div onLoad = {this.getBlockInfo()}>
          <p> BLOCKHASH : {this.state.blockHash}
              NTX : {this.state.ntx}
              HEIGHT : {this.state.height}
              TIME : {this.state.timestamp}
              PROOF : {this.state.proof}
              SIZE : {this.state.sizeBytes}
              VERSION : {this.state.version}
              MERKLEROOT : {this.state.merkleRoot}
              IMMUTABLEMERKLEROOT : {this.state.immutableMerkleRoot}
              PREVIOUSBLOCK : {this.state.previousBlock}
              NEXT BLOCK : {this.state.nextBlock}</p>
        </div>
    </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);