// Order.jsx
import "./Order.css";
import CardOrder from "./components/CardOrder/CardOrder.jsx";
import FilterOrder from "./components/FilterOrder/FilterOrder.jsx";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useInView } from 'react-intersection-observer';
import removeDuplicates from "../../utils/removeDuplicates.js";

function Order() {

    const [data, setData] = useState([]);
    const [loop, setLoop] = useState(0);

    const offset = useRef(0);

    const { ref, inView } = useInView({});

    const dataLength = () => {
        offset.current = data.length;
    };

    const fetchData = async () => {

        const params = {
            offset: offset.current,
            limit: 10
        };

        const response = await axios.get(`http://localhost:3001/order`, { params });

        const data = response.data.data;

        setData((pre) => {
            const updateData = removeDuplicates([...pre, ...data], "R_E_C_N_O_");
            return updateData;
        });

        setLoop(pre => pre + 1);       

    };

    useEffect(() => {

        if (inView) {
            fetchData();
        }

    }, [inView, loop])

    return (
        <>
            <div className="order">
                <FilterOrder></FilterOrder>
                <div className="items">
                    {data.map((el) => (
                        <CardOrder key={el.R_E_C_N_O_} order={el} />
                    ))}
                </div>
                <div ref={ref}></div>
            </div>
            {dataLength()}
        </>
    );
}

export default Order;
