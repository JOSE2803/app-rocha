import {useState } from "react";
import { createContext } from "react";
import propTypes from "prop-types";

const context = createContext();

function SafraContextProvider({ children }) {

    const [data, setData] = useState([]);
  
    const [installmentContents, setInstallmentContents] = useState([]);
    const [showOptions, setShowOptions] = useState(false);
    

    return (
        <context.Provider value={{
            data,
            setData,
            installmentContents,
            setInstallmentContents,
            showOptions,
            setShowOptions
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