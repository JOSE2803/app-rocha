// Order.jsx
import "./Order.css";
import CardOrder from "./components/CardOrder/CardOrder";
import FilterOrder from "./components/FilterOrder/FilterOrder";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useInView } from 'react-intersection-observer';
import removeDuplicates from "../../utils/removeDuplicates.js";
import SwitchToggle from "../../../../components/SwitchToggle/SwitchToggle.jsx";

function Order() {
    const [orders, setOrders] = useState([]);
    const [numberOfLoops, setNumberOfLoops] = useState(1);
    const offsetRef = useRef(0);
    const { ref, inView } = useInView({});

    const [value, setValue] = useState(false);

    const fetchOrders = useCallback(async () => {

        const limit = 10;
        const params = {
            offset: offsetRef.current,
            limit,
            startDate: "20240203",
            endDate: "20240203",
        };

        const response = await axios.get(`http://localhost:3001/order`, { params });

        return response.data;

    }, []);

    const setOrdersData = useCallback(async () => {

        let dataOrders = await fetchOrders();

        // Verifica se não retornou vazio.
        if (dataOrders.data.length > 0) {
            setOrders((current) => {
                const updatedOrders = removeDuplicates([...current, ...dataOrders.data], "R_E_C_N_O_");
                return updatedOrders;
            });
            setNumberOfLoops((current) => current + 1);
        }

    }, [fetchOrders]);

    useEffect(() => {

        if (inView) {
            console.log("CHAMOU");
            setOrdersData();
        }

    }, [inView, numberOfLoops, setOrdersData]);

    const ordersLength = () => {
        offsetRef.current = orders.length;
    };

    return (
        <>
            <div className="order">
                <SwitchToggle
                    isOn={value}
                    onColor="#EF476F"
                    handleToggle={() => setValue(!value)}
                />
                <FilterOrder></FilterOrder>
                <div className="items">
                    {orders.map((el) => (
                        <CardOrder key={el.R_E_C_N_O_} order={el} />
                    ))}
                </div>
                <div ref={ref}></div>
            </div>
            {ordersLength()}
        </>
    );
}

export default Order;
