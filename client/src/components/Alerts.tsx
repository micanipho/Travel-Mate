// import React from "react";
// import Alert_Type from "./Alert-Type";

// const Alerts = () => {
//   return (
//     <section className="pt-16 pb-1 bg-orange-50 relative overflow-hidden">
      
//       <div className="pt-16 justif pb-1 bg-orange-50">
//           <h3>Alerts</h3>
//           <span>Rosebank, Parkwood</span>

//           <div className="br-20px bg-white">
//                 <span>Alerts around you</span>
//           </div>
              
//           <div>
//             <Alert_Type/>
//           </div>
//       </div>

//     </section>
//   );
// };

// export default Alerts;

import React, { useState, useEffect } from 'react';
import Alert_Types from './Alert-Types';
import fetchData from './api';


const Alerts = () => {
const [items, setItems] = useState([]);
const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchData();
        setItems(result);
      } catch (error) {
        console.error('Failed to load');
      }
      setIsLoading(false);
    };

    getData();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return <Alert_Types items={items} />;
};

export default Alerts;