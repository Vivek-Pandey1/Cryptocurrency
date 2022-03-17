import React, { useState, useEffect } from "react";
import { w3cwebsocket } from "websocket";
import Spinner from "./Spinner";

const Home = () => {
  const api_url = "https://api.delta.exchange/v2/products/";

  const [allCoins, setCoins] = useState([]);
  // const [price, setPrice] = useState([]);
  const [Loading, setLoading] = useState(true);
    // let newPrice = [];
  var uniqueData = [];
  var symbol = [];
  var newData = [];
  var srvData = [];
  async function getapi(url) {
    let response = await fetch(url);
    let data = await response.json();

    componentDidMount(data.result, data.result.length);
    setLoading(false);
  }

  function getUniqueListBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }
  useEffect(() => {
    getapi(api_url);
  });

  // var coins = JSON.stringify(allCoins.map((val) => val.symbol));

  const socket = w3cwebsocket("wss://production-esocket.delta.exchange");
  useEffect((coins) => {
    getPrice();
    return () => {
      
      socket.addEventListener("close", (event) => {
        console.log("The connection has been closed successfully.");
      });
    };
  }, );

  function getPrice(){
    socket.addEventListener("open", () => {
      // send a message to the server

      socket.send(
        JSON.stringify({
          type: "subscribe",
          payload: {
            channels: [
              {
                name: "v2/ticker",
                symbols: [
                  "ETHUSDT",
                  "BTCUSD"],
              },
            ],
          },
        })
      );
    });

    // receive a message from the server

    socket.addEventListener("message", ({ data }) => {
      if (data !== undefined) {
        const dataFromServer = JSON.parse(data);

        // console.log(dataFromServer)
        if (dataFromServer.oi_value_symbol !== undefined) {
          srvData.push({
            symbol: dataFromServer.oi_value_symbol,
            price: dataFromServer.mark_price,
          });
          
        }
        // console.log(srvData)
        // setPrice(getUniqueListBy(srvData, "symbol"));
        //  console.table(newPrice[0].symbol)
        

        // console.log(price)
      }
    });
  }
  // console.log(newPrice)
  ///////
  
  async function componentDidMount(data, dlength, price) {
    symbol = await data;
    // var j = symbol.length;
    for (var i = 0; i < dlength; i++) {
      newData.push({
        symbol: symbol[i].symbol,
        description: symbol[i].description,
        underlying_asset_symbol: symbol[i].underlying_asset.symbol,
      });
    }

    uniqueData = getUniqueListBy(newData, "underlying_asset_symbol");

    setCoins(uniqueData);

    //logic to add mark price in table
      // for(i=0;i<50;i++){
      //   let index = uniqueData.findIndex(val=> val.underlying_asset_symbol == newPrice[i].symbol)
      //   // console.log(index)
      //    uniqueData[index].mark_price= newPrice[i].price;
      // }
      // setCoins(uniqueData);
    
  }
  
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
          { Loading && <Spinner/ >}
            {allCoins.map((val, index) => (
              <tr key={val.underlying_asset_symbol}>
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
