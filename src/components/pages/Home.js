import React, { useState, useEffect } from "react";
import { w3cwebsocket } from "websocket";
import Spinner from "./Spinner";

const Home = () => {
  const api_url = "https://api.delta.exchange/v2/products/";

  const [allCoins, setCoins] = useState([]);
  const [price, setPrice] = useState([]);
  const [Loading, setLoading] = useState(true);
  // let newPrice = [];
  var uniqueData = [];
  var symbol = [];
  var newData = [];
  var srvData = [];
  var uniquePrice = [];
  async function getapi(url) {
    let response = await fetch(url);
    let data = await response.json();

    componentDidMount(data.result, data.result.length, price);
    setLoading(false);
  }

  function getUniqueListBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }
  useEffect(() => {
    getapi(api_url);
  });

  var coins = JSON.stringify(allCoins.map((val) => val.symbol));
  // console.log(JSON.stringify(coins));
  const socket = w3cwebsocket("wss://production-esocket.delta.exchange");

  ///////

  async function componentDidMount(data, dlength, price) {
    symbol = await data;
    // var j = symbol.length;
    for (var i = 0; i < dlength; i++) {
      newData.push({
        symbol: symbol[i].symbol,
        description: symbol[i].description,
        underlying_asset_symbol: symbol[i].underlying_asset.symbol,
        mark_price: " ",
      });
    }

    uniqueData = getUniqueListBy(newData, "underlying_asset_symbol");
    if (uniqueData[1] !== undefined) {
      setCoins(uniqueData);
    }

    //logic to add mark price in table
    if (price[1] !== undefined) {
      for (let i = 0; i < price.length; i++) {
        let index = uniqueData.findIndex(
          (val) => val.symbol === price[i].symbol
        );
        // console.log(index)
        if(price[i].price !== null && uniqueData[index].mark_price !== price[i].price){
        uniqueData[index].mark_price = price[i].price;}
      }
      if (uniqueData !== undefined) {
        setCoins(uniqueData);
      }
    }
  }

  function getPrice() {
    socket.addEventListener("open", () => {
      // send a message to the server
      if (coins !== ['']) {
        socket.send(
          JSON.stringify({
            type: "subscribe",
            payload: {
              channels: [
                {
                  name: "v2/ticker",
                  symbols: ["BTCUSD","SOLUSDT","BNBBTC","ETHUSDT","AVAXUSDT","MATICUSDT","XRPUSDT","LINKBTC","BNS_USDT","CELOUSDT","MKRUSDT","ADABTC","BCHUSDT","AAVEUSDT","DOGEUSDT","DOTUSDT","UNIUSDT","LTCUSDT","ONEUSDT","CELUSDT","IMXUSDT","GALAUSDT","ICXUSDT","LPTUSDT","LRCUSDT","HOTUSDT","KLAYUSDT","BATUSDT","QTUMUSDT","SPELLUSDT","RSRUSDT","HNTUSDT","ARUSDT","COTIUSDT","MTLUSDT","OMGUSDT","ZENUSDT","PERPUSDT","EGLDUSDT","DYDXUSDT","NEARUSDT","AGLDUSDT","YFIIUSDT","IOTAUSDT","FTTUSDT","RAYUSDT","SRMUSDT","SCUSDT","STXUSDT","DASHUSDT","AUDIOUSDT","WRXUSDT","MINAUSDT","FTMBTC","RVNUSDT","WAVESUSDT","TLMUSDT","ALICEUSDT","HBARUSDT","SANDUSDT","AXSUSDT","MANAUSDT","CHZUSDT","ENJUSDT","ICPUSDT","KSMUSDT","SHIBUSDT","CAKEUSDT","CRVUSDT","FILUSDT","DETO_USDT","LUNAUSDT","THETAUSDT","1INCHUSDT","RUNEUSDT","SUSHIUSDT","XMRUSDT","GRTUSDT","XLMBTC","DEFIUSDT","KNCUSDT","TOMOBTC","RENUSDT","YFIBTC","BALUSDT","COMPUSDT","ZILUSDT","EOSUSDT","SNXUSDT","BANDUSDT","KAVAUSDT","ALGOUSDT","VETUSDT","ZECUSDT","XTZBTC","ATOMBTC","TRXUSDT","ETCUSDT"],
                },
              ],
            },
          })
        ); 
            }
    });

    // receive a message from the server
      setInterval(() => {
        socket.addEventListener("message", ({ data }) => {
          if (data !== undefined) {
            const dataFromServer = JSON.parse(data);
    
            // console.log(dataFromServer)
            if (dataFromServer.symbol !== undefined) {
              // console.table(dataFromServer.symbol)
              srvData.push({
                symbol: dataFromServer.symbol,
                price: dataFromServer.mark_price,
              });
            }
            
            uniquePrice = getUniqueListBy(srvData, "symbol");
            // console.table(srvData)
            if (uniquePrice[1] !== undefined) {
              setInterval(() => {
                setPrice(uniquePrice);
                // console.table(uniquePrice);
              }, 5000);
            }
    
          }
        });
      }, 5000);
    
    // Listen for possible errors
    socket.addEventListener("error", function (event) {
      // console.log("WebSocket error: ", event);
    });
  }
  useEffect((coins) => {
      getPrice();
    return () => {
      
      socket.addEventListener("close", (event) => {});
    };
  },);

  return (
    <div className="container">
      <div className="py-4">
        <h1 className=" text-center">Coin details</h1>
        {/* <input
          className="form-control my-4"
          size="lg"
          type="text"
          placeholder="Search ..."
          onChange={(event) => {
           setSearchTerm(event.target.value);
          }}
        /> */}

        <table className="table border table-bordered shadow">
          <thead className="thead-dark sticky-top">
            <tr>
              <th scope="col">#</th>
              <th scope="col">symbols</th>
              <th scope="col">Description</th>
              <th scope="col">Underlying Asset</th>
              <th scope="col">Mark price</th>
            </tr>
          </thead>

          <tbody>
            {/* for loading spinner*/}
            {Loading && <Spinner />}
            {allCoins.map((val, index) => (
              <tr key={val.symbol}>
                <th scope="row">{index + 1}</th>
                <td>{val.symbol}</td>
                <td>{val.description} </td>
                <td>{val.underlying_asset_symbol} </td>
                <td>{val.mark_price} </td>
              </tr>
            ))}
          </tbody>  
        </table>
      </div>
    </div>
  );
};

export default Home;
