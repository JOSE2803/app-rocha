import { useContext, useEffect, useState } from "react";
import { context } from "../../../../context/SafraContext/SafraContext";
import axios from "axios"
import { cleanValue } from "../Receipts/utils";

import "./Filters.css";

function Filters() {
    const [inputNsu,setInputNsu] = useState('');
    const {setData,setParams,params,setFiltered} = useContext(context)

    useEffect(()=>{
        if(inputNsu.length > 0){
            setParams((current)=>{
                return {
                    ...current,
                    startNsu: cleanValue(inputNsu),
                    endNsu: cleanValue(inputNsu)
                }
            })
            
        }
    },[inputNsu,setParams,setFiltered])

    const hendlerKeyDonwEvent = async (ev)=>{
        if(ev.key == 'Enter'){
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/safra`,{params})
            setData(response.data.data)
            setFiltered(true)
        }
    }

    return ( 
        <div className="filter-content">
            <h2>Filtros</h2>
            <div className="filters-inputs-div">
                <input 
                    type="text" 
                    placeholder="Pesquisar NSU..."
                    className="filters-input" 
                    value={inputNsu}
                    onChange={(ev)=>{setInputNsu(ev.target.value)}}
                    onKeyDown={hendlerKeyDonwEvent}
                />
                <input 
                    type="text" 
                    placeholder="Pesquisar por valor..."
                    className="filters-input" 
                />
            </div>
        </div>
     );
}

export default Filters;