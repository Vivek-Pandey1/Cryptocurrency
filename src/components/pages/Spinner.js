import React from 'react'
import loading from './loading.gif'

 const Spinner= ()=> {
   
        return (
          <tr>
            <td colSpan={5} className='text-center' >
                <img  src={loading} alt="loading" />
            </td>
            </tr>
        );
    };



export default Spinner;
