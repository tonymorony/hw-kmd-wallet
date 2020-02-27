import React from 'react';
import Transactions from './Transactions';
import ClaimRewardsButton from './ClaimRewardsButton';
import TxidLink from './TxidLink';
import {TX_FEE, coin} from './constants';
import humanReadableSatoshis from './lib/human-readable-satoshis';
import './Accounts.scss';
import './Account.scss';

class Account extends React.Component {
  state = this.initialState;

  get initialState() {
    return {
      isClaimed: false,
      claimTxid: null,
      address: '',
      // debug options
      showXpub: null,
      isDebug: window.location.href.indexOf('#enable-verify') > -1,
    };
  }

  updateInput(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleRewardClaim = txid => {
    this.setState({
      isClaimed: true,
      claimTxid: txid,
      showXpub: null,
    });
  };

  showXpub(index) {
    this.setState({
      showXpub: index === this.state.showXpub ? null : index,
    });
  }

  render() {
    const {account, tiptime} = this.props;
    const {
      accountIndex,
      utxos,
      history,
      balance,
      rewards,
      claimableAmount,
      serviceFee,
      xpub,
    } = account;

    const isClaimableAmount = (claimableAmount > 0);
    const {isClaimed, claimTxid} = this.state;

    console.warn('utxos', utxos);
    console.warn('history', history);

    return (
      <div className={`Account column is-full ${isClaimed ? 'isclaimed' : ''}`}>
        <div className="box">
          <div className="content">
            <h2>
              Account {accountIndex + 1}
              <div className="balance">
                {humanReadableSatoshis(balance)} {coin}
              </div>
            </h2>
            {(history.historyParsed.length === 0) && (
              <React.Fragment>
                No history
              </React.Fragment>
            )}
            {(history.historyParsed.length > 0) && (
              <React.Fragment>
                <h4>Transactions</h4>
                <Transactions transactions={history.historyParsed} />
              </React.Fragment>
            )}
            {account.addresses && account.addresses.length &&
              <div style={this.state.address ? {'padding': '10px 20px 20px 20px'} : {'padding': '10px 20px 30px 20px'}}>
                Send rewards to
                <select
                  style={{'marginLeft': '10px'}}
                  className="account-index-selector"
                  name="address"
                  value={this.state.address}
                  onChange={ (event) => this.updateInput(event) }>
                  <option
                    key="rewards-output-address-default"
                    value="">
                    Unused address (default)
                  </option>
                  {account.addresses.slice(0, 10).map((item, index) => (
                    <option
                      key={`rewards-output-address-${index}`}
                      value={item.address}>
                      {item.address}
                    </option>
                  ))}
                </select>
              </div>
            }
            {this.state.address &&
              <div style={{'padding': '0 20px 30px 20px'}}>
                <strong>Warning:</strong> sending rewards to a non-default address will break so called pseudo anonimity (one time address usage) and link your addresses together! This is not recommended option.
              </div>
            }
            {(isClaimed && claimTxid) && (
              <div className="is-pulled-right">
                Claim TXID: <TxidLink txid={claimTxid}/>
              </div>
            )}
            {this.state.isDebug &&
              <button className="button is-primary" onClick={() => this.showXpub(accountIndex)}>
                {this.state.showXpub >=0 && this.state.showXpub == accountIndex ? 'Hide Xpub' : 'Show Xpub'}
              </button>
            }
            {this.state.showXpub >=0 &&
             this.state.showXpub == accountIndex &&
              <div style={{'padding': '20px', 'wordBreak': 'break-all'}}>
                <strong>Xpub:</strong> {xpub}
              </div>
            }
            <ClaimRewardsButton account={account} handleRewardClaim={this.handleRewardClaim} isClaimed={this.state.isClaimed} vendor={this.props.vendor} address={this.state.address}>
              Claim Rewards
            </ClaimRewardsButton>
          </div>
        </div>
      </div>
    );
  }
}

const Accounts = ({accounts, tiptime}) => (
  <div className="Accounts">
    <div className="container">
      <div className="columns is-multiline">
        {accounts.map((account) => (
          <Account
            key={account.accountIndex}
            account={account}
            tiptime={tiptime}
            />
        ))}
      </div>
    </div>
  </div>
);

export default Accounts;
