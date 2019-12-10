import React from 'react';
import axios from 'axios';
import './index.css'; 

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

  static onClick() {}

  async getBlockInfo() {

    let url = window.location.href.split("/");  
    let blockHashUrl = url[url.length -1];  

    const result = await axios.get(`${'http://localhost:3001/block'}/${blockHashUrl}`);
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
    const {
      blockHash, ntx, height, timestamp, proof, sizeBytes, version,
      merkleRoot, immutableMerkleRoot, previousBlock, nextBlock,
    } = this.state;
    return (
      <div className="App">
        <p>
          <h2>
BLOCK #
            {height}
            <button type="button" onClick={this.onclick}>Raw Data</button>
          </h2>
          <h5>
BLOCKHASH
            {blockHash}

          </h5>

          <table>
            <tbody>
              <tr>
                <td>
                  {' '}
No. of Transaction :
                  {ntx}
                </td>
              </tr>
              <tr>
                <td>
                  {' '}
HEIGHT :
                  {height}
                </td>
              </tr>
              <tr>
                <td>
TIME :
                  {timestamp}
                </td>
              </tr>
              <tr>
                <td>
PROOF :
                  {proof}
                </td>
              </tr>
              <tr>
                <td>
SIZE :
                  {sizeBytes}
                </td>
              </tr>
              <tr>
                <td>
VERSION :
                  {version}
                </td>
              </tr>
              <tr>
                <td>
MERKLEROOT :
                  {merkleRoot}
                </td>
              </tr>
              <tr>
                <td>
IMMUTABLEMERKLEROOT :
                  {immutableMerkleRoot}
                </td>
              </tr>
              <tr>
                <td>
PREVIOUSBLOCK :
                  {previousBlock}
                </td>
              </tr>
              <tr>
                <td>
NEXT BLOCK :
                  {nextBlock}
                </td>
              </tr>
            </tbody>
          </table>

          <h5>
            <button type="button" onClick={this.onClick}>\/</button>
          View All Transactions
          </h5>
        </p>
      </div>
    );
  }
}

export default App;
