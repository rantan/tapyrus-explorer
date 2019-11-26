import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './index.css';

const blockHash = '3272350d554f75cb407813ee1ebe8c96fea5dc6c82623b20876d97ea27b18f61';
class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      blockHash: 'hash',
      ntx: 'ntx',
      height: 'height',
      timestamp: 'time',
      proof: 'nonce',
      sizeBytes: 'size',
      version: 'version',
      merkleRoot: 'merkleRoot',
      immutableMerkleRoot: 'immutable',
      previousBlock: 'previousblockhash',
      nextBlock: 'nextblockhash',
    };
  }

  componentDidMount() {
    this.getBlockInfo();
  }

  async getBlockInfo() {
    const result = await axios.get(`${'http://localhost:3001/blocks'}/${blockHash}`);
    this.setState({
      blockHash: result.data.blockHash,
      ntx: result.data.ntx,
      height: result.data.height,
      timestamp: result.data.timestamp,
      proof: result.data.proof,
      sizeBytes: result.data.sizeBytes,
      version: result.data.version,
      merkleRoot: result.data.merkleRoot,
      immutableMerkleRoot: 'immutable',
      previousBlock: result.data.previousBlock,
      nextBlock: result.data.nextBlock,
    });
  }

  render() {
    return (
      <div className="App">
        <p>
            BLOCKHASH :
          {this.state.blockHash}
            NTX :
          {this.state.ntx}
            HEIGHT :
          {this.state.height}
            TIME :
          {this.state.timestamp}
            PROOF :
          {this.state.proof}
            SIZE :
          {this.state.sizeBytes}
            VERSION :
          {this.state.version}
            MERKLEROOT :
          {this.state.merkleRoot}
            IMMUTABLEMERKLEROOT :
          {this.state.immutableMerkleRoot}
            PREVIOUSBLOCK :
          {this.state.previousBlock}
            NEXT BLOCK :
          {this.state.nextBlock}
        </p>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
