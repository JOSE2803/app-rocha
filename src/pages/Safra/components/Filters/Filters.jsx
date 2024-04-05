import { useCallback, useContext, useEffect, useState } from "react";
import { context } from "../../../../context/SafraContext/SafraContext";
import axios from "axios"
import "./Filters.css";

function Filters() {
    const [inputNsu,setInputNsu] = useState('');
    const {setFilteredData} = useContext(context)
    const chengeInputNsu = (ev)=>{
        setInputNsu(ev.target.value)
    }

    useEffect(()=>{
        if(inputNsu.length > 0 ){
            setFilteredData((current)=>{
                return current.filter((el)=> el.Nsu.includes(inputNsu))
            })
        }
    },[inputNsu,setFilteredData])
    return ( 
        <div className="filter-content">
            <h2>Filtros</h2>
            <div className="filters-inputs-div">
                <input 
                    type="text" 
                    placeholder="Pesquisar NSU..."
                    className="filters-input" 
                    value={inputNsu}
                    onChange={chengeInputNsu}
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