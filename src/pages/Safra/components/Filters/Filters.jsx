import { useContext, useState } from "react";
import { context } from "../../../../context/SafraContext/SafraContext";
import axios from "axios"

import "./Filters.css";

function Filters() {
    const [inputNsu,setInputNsu] = useState('');
    const {setData} = useContext(context)

    const hendlerKeyDonwEvent = async (ev)=>{
        if(ev.key == 'Enter'){
            const params = {
                startNsu: inputNsu,
                endNsu: inputNsu
            }
            
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/safra`,{params})
            setData(response.data.data)
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