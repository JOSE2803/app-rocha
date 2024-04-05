import {useState,useRef } from "react";
import { createContext } from "react";
import propTypes from "prop-types";

const context = createContext();

function SafraContextProvider({ children }) {

    const [data, setData] = useState([]);
    const [installmentContents, setInstallmentContents] = useState([]);
    const [showOptions, setShowOptions] = useState(false);
    const [filtered,setFiltered] = useState(false)
    const offset = useRef(0);
    const [params,setParams] = useState({
        offset: offset.current,
        limit: 2
    })

    
    

    return (
        <context.Provider value={{
            data,
            setData,
            installmentContents,
            setInstallmentContents,
            showOptions,
            setShowOptions,
            offset,
            params,
            setParams,
            filtered,
            setFiltered
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