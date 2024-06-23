import React, { useEffect, useState } from "react";
import allpool from "./allpool.module.css";
import { Link } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { ArrowChangeDown } from "components/Icons/ArrowChangeDown";

const StyledDownArrow = styled(ArrowChangeDown)<{ $noColor?: boolean }>`
  color: ${({ theme, $noColor }) =>
    $noColor ? theme.neutral2 : theme.critical};
`;

export function TokenTable() {
  //   const [poolData, setPoolData] = useState([]);
  //   const [totalTVL, setTotalTVL] = useState<number>();
  //   const getPoolDetails = async () => {
  //     // ETH price in dollar
  //     const api_url = process.env.REACT_APP_ETHAPIURL;
  //     let ethPriceDollar: number;
  //     if (api_url) {
  //       const response = await fetch(api_url);
  //       const ethPrice = await response.json();
  //       ethPriceDollar = ethPrice.USD;
  //     }
  //     const graphURL =
  //       "https://api.goldsky.com/api/public/project_clth71vucl2l701uu07ha0im7/subgraphs/udonswap/0.0.1/gn";
  //     const poolQuery = `
  //     query MyQuery {
  //       pairs(first: 100) {
  //         id
  //         token1 {
  //           name
  //           symbol
  //           derivedETH
  //         }
  //         token0 {
  //           name
  //           symbol
  //           derivedETH
  //         }
  //         reserve0
  //         reserve1
  //       }
  //     }`;
  //     axios({
  //       url: graphURL,
  //       method: "post",
  //       data: {
  //         query: poolQuery,
  //       },
  //     }).then(async (result) => {
  //       // Changed to async
  //       const data = result.data.data.pairs;
  //       let addTVL = 0;
  //       // Calculate TVL price in dollar
  //       for (let i = 0; i < data.length; i++) {
  //         const token0InEth = data[i].reserve0 * data[i].token0.derivedETH;
  //         const token1InEth = data[i].reserve1 * data[i].token1.derivedETH;
  //         const TVL = (token0InEth + token1InEth) * ethPriceDollar;
  //         data[i]["TVL"] = TVL;
  //         addTVL += TVL;
  //       }
  //       setTotalTVL(addTVL);
  //       // Get the daily volume
  //       const sevenDaysEpoch = 604800;
  //       const currentTimestamp = Math.floor(Date.now() / 1000);
  //       const time = currentTimestamp - sevenDaysEpoch;

  //       // Fetch volume data for each pair asynchronously
  //       await Promise.all(
  //         data.map(async (pair: any, j: number) => {
  //           const dailyVolumeQuery = `
  //           query MyQuery{
  //             pairDayDatas(where: {date_gte: ${time}, pairAddress: "${pair.id}"}){
  //               dailyVolumeToken0
  //               dailyVolumeToken1
  //               reserve0
  //               reserve1
  //             }
  //           }`;
  //           const result = await axios({
  //             url: graphURL,
  //             method: "post",
  //             data: {
  //               query: dailyVolumeQuery,
  //             },
  //           });
  //           const volumeData = result.data.data.pairDayDatas;

  //           let volumeToken0 = 0;
  //           let volumeToken1 = 0;
  //           for (let k = 0; k < volumeData.length; k++) {
  //             volumeToken0 += Number(volumeData[k].dailyVolumeToken0);
  //             volumeToken1 += Number(volumeData[k].dailyVolumeToken1);
  //           }

  //           const volumeToken0Eth = volumeToken0 * Number(pair.token0.derivedETH);
  //           const volumeToken1Eth = volumeToken1 * Number(pair.token1.derivedETH);
  //           const volumeTokenDollar =
  //             (volumeToken0Eth + volumeToken1Eth) * ethPriceDollar;
  //           pair["volume7d"] = volumeTokenDollar;
  //         }),
  //       );
  //       console.log(data);
  //       setPoolData(data);
  //     });
  //   };

  //   useEffect(() => {
  //     getPoolDetails();
  //   }, []);

  return (
    <div className="">
      <div className={allpool.tablediv}>
        <div className={allpool.head}>
          <table className={allpool.table}>
            <thead>
              <tr className={allpool.row}>
                <th className={allpool.column1}>#</th>
                <th className={allpool.column2}>Token name</th>
                <th className={allpool.column3}>Price</th>
                <th className={allpool.column4}>1 hour</th>
                <th className={allpool.column5}>1 day</th>
                <th className={allpool.column6}>FDV</th>
                <th className={allpool.column7}>Volume</th>
              </tr>
            </thead>
          </table>
        </div>
        <div className={allpool.content}>
          <table className={allpool.table}>
            <tbody>
              <tr className={allpool.row}>
                <td className={allpool.column1}>1</td>
                <td className={allpool.column2}>token/symbol</td>
                <td className={allpool.column3}>757587098</td>
                <td className={allpool.column4}>7856846575</td>
                <td className={allpool.column5}>0857789</td>
                <td className={allpool.column6}>0857789</td>
                <td className={allpool.column7}>0857789</td>
              </tr>
            </tbody>
          </table>
          <table className={allpool.table}>
            <tbody>
              <tr className={allpool.row}>
                <td className={allpool.column1}>1</td>
                <td className={allpool.column2}>token/symbol</td>
                <td className={allpool.column3}>757587098</td>
                <td className={allpool.column4}>7856846575</td>
                <td className={allpool.column5}>0857789</td>
                <td className={allpool.column6}>0857789</td>
                <td className={allpool.column7}>0857789</td>
              </tr>
            </tbody>
          </table>
          {/* <table className={allpool.table}>
            <tbody>
              {poolData?.length > 0 ? (
                poolData.map((token, index) => (
                  <tr className={allpool.row} key={index}>
                    <td className={allpool.column1}>
                      {token["token0"]["symbol"]}-{token["token1"]["symbol"]}
                    </td>
                    <td className={allpool.column2}>
                      $ {parseFloat(token["TVL"]).toFixed(3)}
                    </td>
                    <td className={allpool.column3}>
                      $ {parseFloat(token["volume7d"]).toFixed(3)}
                    </td>
                    <td className={allpool.column4}>
                      ${token["volume7d"] * 0.03}
                    </td>
                  </tr>
                ))
              ) : (
                <div style={{ textAlign: "center" }}>
                  <span className={allpool.loader}></span>
                </div>
              )}
            </tbody>
          </table> */}
        </div>
      </div>
    </div>
  );
}
