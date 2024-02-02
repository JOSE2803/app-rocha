import "./Order.css";
import CardOrder from "./components/CardOrder/CardOrder";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

function Order() {

    const [orders, setOrders] = useState([]);

    let offset = 0;

    const removeDuplicates = useCallback((data) => {

        const property = "R_E_C_N_O_";

        return data.filter((obj, index, self) =>
        index === self.findIndex((o) => o[property] === obj[property]));

    }, [])

    const fetchOrders = useCallback(async () => {

        const dataOrders = await axios.get(`http://localhost:3001/order?offset=${offset}`);

        return dataOrders.data;

    }, [offset]);

    const setOrdersData = useCallback(async () => {

        const dataOrders = await fetchOrders();

        const newOrders = removeDuplicates([...orders, ...dataOrders.data]);

        setOrders(newOrders);
        
    }, [fetchOrders, removeDuplicates, orders])

    useEffect(() => {

        setOrdersData();

    }, [setOrdersData])


    return (
        <div className="order">

            {
                <div className="items">
                    {orders.map((el) => (
                        <CardOrder key={el.R_E_C_N_O_} order={el} />
                    ))}
                </div>
            }

            <div id="sentinel">
                {offset}
            </div>



        </div>

    );
}

export default Order;