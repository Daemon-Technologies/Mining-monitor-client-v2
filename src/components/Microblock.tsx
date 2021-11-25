/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { toRelativeTime, truncateMiddle } from "../utils/utils";
import BlockLight from "../assets/explorer/microblock-light.svg";
import BlockDark from "../assets/explorer/microblock-dark.svg";

export const Microblock: React.FC<{
  getMicroBlock: any;
  block: any;
  theme: any;
  parent_burn_block_time: number;
}> = ({ theme, getMicroBlock, block, parent_burn_block_time }) => {
  const [currentBlock, setCurrentBlock] = useState<any>();
  useEffect(() => {
    getItem();
  }, []);
  const getItem = async () => {
    const x = await getMicroBlock(block);
    setCurrentBlock(x);
  };
  return (
    <>
      {currentBlock && (
        <div className="table-item" key={currentBlock.block_hash}>
          <div className="left-content">
            <img
              className="transaction-image"
              alt="transaction"
              src={theme === "light" ? BlockLight : BlockDark}
            />
            <div>
              <p className="title">
                {truncateMiddle(currentBlock.microblock_hash, 10)}
              </p>
              <p className="subtitle">{currentBlock.txs.length} Transactions</p>
            </div>
          </div>
          <div className="right-content">
            <p className="title">
              {toRelativeTime(parent_burn_block_time * 1000)}
            </p>
            {/* <p className="subtitle">{truncateMiddle(block, 6)}</p> */}
          </div>
        </div>
      )}
    </>
  );
};
