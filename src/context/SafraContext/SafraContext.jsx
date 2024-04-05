import { useEffect, useState } from "react";
import { createContext } from "react";
import propTypes from "prop-types";

const context = createContext();

function SafraContextProvider({ children }) {

    const [data, setData] = useState([]);
    const [filteredData,setFilteredData] = useState([]);
    const [installmentContents, setInstallmentContents] = useState([]);
    const [showOptions, setShowOptions] = useState(false);
    
    useEffect(()=>{
        setFilteredData(data)
    },[data])
    return (
        <context.Provider value={{
            data,
            setData,
            installmentContents,
            setInstallmentContents,
            showOptions,
            setShowOptions,
            filteredData,
            setFilteredData
        }}>
            {
                children
            }
        </ context.Provider>
    );
}

SafraContextProvider.propTypes = {
    children: propTypes.node
}

export {
    SafraContextProvider,
    context,
};