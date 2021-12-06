/* eslint-disable no-useless-concat */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { ExplorerAddressDetailsHeader } from "../components/ExplorerAddressDetailsHeader";
import Stacks from "../assets/explorer/stacks-block.png";
import Mining from "../assets/explorer/mining-block.svg";
import MiningInfo from "../assets/explorer/mining-info.svg";
import OtherAssets from "../assets/explorer/other-assets.svg";
import Burn from "../assets/explorer/burn-block.svg";
import { AddressTokens } from "../components/AddressTokens";
import { useExplorerAddressDetails } from "../hooks/useExplorerAddressDetail";
import { LoadTransactions } from "../components/LoadTransactions";
import Logo from "../assets/side-menu/no-search-results.svg";
import ProgressBar from "../components/Progressbar";

interface Props {
  theme: any;
  themeToggler: any;
  failure: boolean;
}

export const ExplorerAddressDetails: React.FC<Props> = ({
  theme,
  themeToggler,
  failure,
}) => {
  const params: any = useParams();
  const [toggle, setToggle] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [count, setCount] = useState(1);
  const {
    recentTransactions,
    setAddress,
    address,
    overviewData,
    nativeInfo,
    getRecentTransactions,
    isLoading,
    blockHeight,
    tokens,
  } = useExplorerAddressDetails();

  useEffect(() => {
    const { innerWidth: width } = window;
    setToggle(width >= 1025);
  }, [toggle]);
  const { push } = useHistory();

  useEffect(() => {
    if (params?.address) {
      setAddress(params.address);
    }
  }, [params]);

  useEffect(() => {
    if (failure) {
      push("/upgrading");
    }
  }, [failure]);
  return (
    <div className="explorer">
      <div id="main">
        <ExplorerAddressDetailsHeader
          address={address}
          headerDetails={overviewData}
        />
        <div className={"tabs"}>
          <div
            onClick={() => setTabIndex(0)}
            className={tabIndex === 0 ? "active" : ""}
          >
            Overview
          </div>
          <div
            onClick={() => setTabIndex(1)}
            className={tabIndex === 1 ? "active" : ""}
          >
            Tokens
          </div>
          <div
            onClick={() => setTabIndex(2)}
            className={tabIndex === 2 ? "active" : ""}
          >
            Collections
          </div>
        </div>
      </div>
      {tabIndex === 0 && (
        <div id="transactionContainer" className="transaction-container">
          <div className="recent-transactions">
            <div style={{ marginTop: 0 }} className="rt-table">
              <div className="table-header">
                <p>Transactions</p>
              </div>
              <LoadTransactions
                recentTransactions={recentTransactions}
                theme={theme}
              />
              {recentTransactions.length > 0 && (
                <div
                  style={{
                    borderTop: "1px solid #84818A",
                    color: "#84818A",
                    fontSize: 12,
                    paddingTop: 15,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    getRecentTransactions();
                  }}
                >
                  <p style={{ textAlign: "center", fontWeight: 600 }}>
                    {isLoading ? "Loading..." : "Load More"}
                  </p>
                </div>
              )}
            </div>
          </div>
          {nativeInfo?.assets_info && (
            <div className="address-blocks">
              <div className="address-card">
                <div className="address-card-header">
                  <p>Assets</p>
                </div>
                <div className="address-card-item">
                  <img alt="stacks" src={Stacks} />
                  <div>
                    <p className="title">Total Balance</p>
                    <p className="sub-title">
                      {nativeInfo.assets_info.balance.toLocaleString()} STX
                    </p>
                  </div>
                </div>
                <div className="address-card-item">
                  <img alt="stacks" src={OtherAssets} />
                  <div>
                    <p className="title">Other Assets</p>
                    <p className="sub-title">
                      {nativeInfo.assets_info.fungible_tokens.length +
                        nativeInfo.assets_info.non_fungible_tokens.length}{" "}
                      tokens
                    </p>
                  </div>
                </div>
              </div>
              <div className="address-card">
                <div className="address-card-header">
                  <p>Stacking</p>
                </div>
                <div className="address-card-header"></div>
                <div className="address-card-item">
                  <img alt="stacks" src={Mining} />
                  <div>
                    <p className="title">STX Stacked(locked)</p>
                    <p className="sub-title">
                      {nativeInfo.stacking_info.stacking_amount.toLocaleString()}{" "}
                      STX
                    </p>
                  </div>
                </div>
                {blockHeight && nativeInfo.stacking_info && (
                  <ProgressBar
                    theme={theme}
                    completed={
                      nativeInfo.stacking_info.stacking_amount
                        ? (
                            ((nativeInfo.stacking_info.burnchain_unlock_at -
                              +blockHeight) *
                              100) /
                            nativeInfo.stacking_info.burnchain_lock_at
                          ).toFixed(1)
                        : 0
                    }
                  />
                )}
                {nativeInfo.stacking_info.stacking_amount !== 0 && (
                  <div
                    style={{
                      marginTop: 5,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      display: "flex",
                    }}
                  >
                    <p className="sub-title">
                      #{nativeInfo.stacking_info.burnchain_lock_at}
                    </p>
                    <p className="sub-title">
                      ~
                      {nativeInfo.stacking_info.burnchain_unlock_at -
                        +blockHeight}{" "}
                      (
                      {(
                        ((nativeInfo.stacking_info.burnchain_unlock_at -
                          +blockHeight) *
                          100) /
                        nativeInfo.stacking_info.burnchain_lock_at
                      ).toFixed(1)}
                      %) remaining
                    </p>
                    <p className="sub-title">
                      #{nativeInfo.stacking_info.burnchain_unlock_at}
                    </p>
                  </div>
                )}
              </div>
              <div className="address-card">
                <div className="address-card-header">
                  <p>Mining</p>
                  <img
                    onClick={() => push("/miner/address/" + address)}
                    alt="stacks"
                    src={MiningInfo}
                  />
                </div>
                <div className="address-card-header"></div>
                <div className="address-card-item">
                  <img alt="stacks" src={Mining} />
                  <div>
                    <p className="title">Mining reward earned</p>
                    <p className="sub-title">
                      {nativeInfo.mining_info.miner_rewards} STX
                    </p>
                  </div>
                </div>
                <div className="address-card-item">
                  <img alt="stacks" src={Burn} />
                  <div>
                    <p className="title">Fees burn</p>
                    <p className="sub-title">
                      {nativeInfo.mining_info.total_burnt} Sats
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {tabIndex === 1 && (
        <>
          {tokens.length > 0 ? (
            <div id="transactionContainer" className="tokens-container">
              <p className={"title-table"}>All Tokens</p>
              <div>
                <AddressTokens initialPageSize={10} tokens={tokens.sort()} />
              </div>
            </div>
          ) : (
            <div
              id="transactionContainer"
              style={{ width: "100%", paddingLeft: "30%" }}
            >
              {" "}
              <img src={Logo} alt="404" />
            </div>
          )}
        </>
      )}
      {tabIndex === 2 && (
        <div id="transactionContainer" className="image-container">
          {/* <div className="collections-header">
            <input
              className="search-bar"
              type="text"
              id="header-search"
              placeholder="Search for TxHash / Address / Block"
              name="s"
            />
            <select value="Sort by recent">
              <option value="Orange">Recent</option>
              <option value="Radish">Oldest</option>
              <option value="Cherry">Rarest</option>
            </select>
          </div>
           */}
          <div className="card-img">
            <img
              className="nft-image"
              alt={count.toString()}
              src={`https://ipfs.io/ipfs/QmYCnfeseno5cLpC75rmy6LQhsNYQCJabiuwqNUXMaA3Fo/${count}.png`}
            />
            <p>Bitcoin monkeys #{count}</p>
          </div>
          <div className="card-img">
            <img
              className="nft-image"
              alt={count.toString()}
              src={`https://stacksart.s3.amazonaws.com/frontier/${count}.png`}
            />
            <p>Frontier #{count}</p>
          </div>
          <div className="card-img">
            <img
              className="nft-image"
              alt={count.toString()}
              src={`https://stacksart.s3.amazonaws.com/stacks-mandala/${count}.png`}
            />
            <p>Mandala #{count}</p>
          </div>
          <div className="card-img">
            <img
              className="nft-image"
              alt={count.toString()}
              src={`https://ipfs.io/ipfs/QmdCtFNfFu8RnewyUNayiDuAUQAN6jarYE18c3NTKNhSYF/${count}.png`}
            />
            <p>Bubo #{count}</p>
          </div>
          <div className="card-img">
            <img
              className="nft-image"
              alt={count.toString()}
              src={`https://stacksart.s3.amazonaws.com/funky-donuts/${count}.png`}
            />
            <p>Funky Donuts #{count}</p>
          </div>
          <div className="card-img">
            <img
              className="nft-image"
              alt={count.toString()}
              src={`https://www.stackspunks.com/assets/punks/punk${count}.png`}
            />
            <p>Stacks Punks #{count}</p>
          </div>
          <div className="card-img">
            <img
              className="nft-image"
              alt={count.toString()}
              src={`https://ipfs.io/ipfs/QmWJRkeiRVuosfhuGxfrNwY2peUvbAQ7oT36Jh6wpfxChN/${count}.jpg`}
            />
            <p>Bitcoin Bulls #{count}</p>
          </div>
          <div className="card-img">
            <img
              className="nft-image"
              alt={count.toString()}
              src={`https://stacksart.s3.amazonaws.com/blocks/${count}.png`}
            />
            <p>Blocks #{count}</p>
          </div>
          <div className="card-img">
            <img
              className="nft-image"
              alt={count.toString()}
              src={`https://ipfs.io/ipfs/QmWmuf4tJsHDsLhPwumtpqUsLUnDJPgKcLRiikQNNcM7qy/${count}.png`}
            />
            <p>Stacks Owls #{count}</p>
          </div>
          <div className="card-img">
            <img
              className="nft-image"
              alt={count.toString()}
              src={`https://stacksart.s3.amazonaws.com/stx-jokers/${count}.png`}
            />
            <p>Jokers #{count}</p>
          </div>

          {/* <img className="nft-image" alt={count.toString()} src={`https://ipfs.io/ipfs/QmRWzC2FEB4u1jEkVpc18XwxnVCxks7ZwLuhFHjfn2FeAU/${count}.jpg`} /> */}

          {/* <img className="nft-image" alt={count.toString()} src={`https://stacksart.mypinata.cloud/ipfs/QmSrGnpifLtNuF8rf5txC2XVodALB4RezLALKrKEcEXZKt/${count}.jpg`} /> */}

          <p onClick={() => setCount(count - 1)}>Previous</p>
          <p onClick={() => setCount(count + 1)}>Next</p>
        </div>
      )}
    </div>
  );
};
