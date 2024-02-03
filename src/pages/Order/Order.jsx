import "./Order.css";
import CardOrder from "./components/CardOrder/CardOrder";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useInView } from 'react-intersection-observer';


function Order() {

    const [orders, setOrders] = useState([]);
    const [numberOfLoops, setNumberOfLoops] = useState(1);

    const offsetRef = useRef(0);

    const { ref, inView } = useInView({});

    const removeDuplicates = useCallback((array, property) => {
        const filter = array.filter((obj, index, self) =>
        index === self.findIndex((o) => o[property] === obj[property]));
    
      return filter;
    }, []);

    const fetchOrders = useCallback(async () => {

        const limit = 6;

        const params = {
            offset: offsetRef.current,
            limit,
            startDate: "20240127",
            endDate: "20240127",
        };

        const response = await axios.get(`http://localhost:3001/order`, { params });

        return response.data;

    }, []);


    const setOrdersData = useCallback(async () => {

        const dataOrders = await fetchOrders();

        if (dataOrders.data.length > 0) {
            setOrders((current) => removeDuplicates([...current, ...dataOrders.data], "R_E_C_N_O_"));

            setNumberOfLoops((current) => current + 1);
        }

    }, [fetchOrders, removeDuplicates])

    useEffect(() => {

        if (inView) {

            setOrdersData();
        }

    }, [inView, setOrdersData, numberOfLoops]);

    const ordersLength = () => {
        offsetRef.current = orders.length;
    };


    return (
        <>
            <div className="order">

                {
                    <div className="items">
                        {orders.map((el) => (
                            <CardOrder key={el.R_E_C_N_O_} order={el} />
                        ))}
                    </div>
                }

                <div ref={ref}></div>


            </div>
            {ordersLength()}
        </>


    );
}

export default Order;