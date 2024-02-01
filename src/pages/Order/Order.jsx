import "./Order.css";
import CardOrder from "./components/CardOrder/CardOrder";
import { data } from "../../data/data.json";
import { useEffect, useState } from "react";

function Order() {

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        setOrders(data);
    }, [])

    console.log(orders.length);

    return (
        <div className="order">

            {orders.map((el) => (
                <CardOrder key={el.R_E_C_N_O_} order={el} />
            ))}

        </div>
    );
}

export default Order;