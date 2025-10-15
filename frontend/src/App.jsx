import AuthProvider from "./context/AuthProvider";
import AppRoutes from "./components/routes/AppRoutes";
import { useState } from "react";

function App() {
  const [store, setStore] = useState([]);
  const [poition, setposition] = useState(0);

  const handleSubmit = (coinFlip) => {
    setStore((prev) => {
      if (prev.length === 0) {
        return [[coinFlip]];
      }
      if (prev[prev.length - 1][0] === coinFlip) {
        const currentValues = [...prev];
        currentValues[currentValues.length - 1] = [
          ...prev[prev.length - 1],
          coinFlip,
        ];
        return currentValues;
      }
      return [...prev, [coinFlip]];
      // [["head", "head"], ["tail"], ["head"]];
    });
  };
  return (
    // <AuthProvider>
    //   <AppRoutes />
    // </AuthProvider>
    <div>
      <div>
        <button
          className="bg-red-400 mx-4 p-4"
          onClick={() => handleSubmit("head")}
        >
          Head
        </button>
        <button
          className="bg-red-400 mx-4 p-4"
          onClick={() => handleSubmit("tail")}
        >
          Tail
        </button>
      </div>
      <div>
        <h1>Response Input</h1>
        <div style={{ display: "flex", }}>
          {store.length !== 0 &&
            store.map((arrayValues, key) => (
              <ul style={{ margin: '20px '}} key={key}>
                {arrayValues.map((coin, coinKey) => (
                  <li key={coinKey}>{coin}</li>
                ))}
              </ul>
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;

// import {useState, useEffect} from 'react';
// export default function App() {
//     const [value, setValue] = useState(null);
//     const [position, setPosition] = useState(1);
//     const [store, setStore] = useState([]);

//     const handleSubmit = (event) => {
//         event.preventDefault();
//         if(!store.length) {
//             setStore([value])
//         } else if(store.slice(-1)[0] !== value) {
//             setStore(store.push([value]))
//         } else {
//             setStore()
//         }
//         [['head', 'head'], ['tail'], ['head']]

//     }

//   return (
//       <main>
//              <div>
//                  <button onClick={() => setValue('head')}>
//                      Head
//                  </button>
//                  <button onClick={() => setValue('tail')}>
//                      Tail
//                  </button>
//                   <button type='submit' onClick={handleSubmit}>
//                   Submit
//                   </button>
//              </div>
//               <div>
//                   <h1>
//                       Response Input
//                   </h1>
//                   <ul style={{ display: 'flex'}}>
//                       {/* {store.length !== 0 && store.map((coin, key) => (
//                           <li style={{ margin: '0px 5px', textDecoration: 'none'}} key={key}>{coin.side}</li>
//                       ))} */}
//                   </ul>
//               </div>
//   </main>
//   )
// }
