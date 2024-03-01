import { useState } from "react";
import { createContext } from "react";
import propTypes from "prop-types";

const context = createContext();

function SafraContextProvider({ children }) {

    const [data, setData] = useState([]);

    return (
        <context.Provider value={{
            data,
            setData
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