import propTypes from 'prop-types';
import PrimaryButton from "../../../../components/Button/PrimaryButton";
import { groupReceiptsByBranch } from './utils';
import { toast } from 'react-toastify';
import Spinner from '../../../../components/Spinner/Spinner';

import "./Receipts.css";
import { useCallback, useEffect, useState } from 'react';

function Receipts({ receipts }) {

    const [data, setData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEmptyData, setIsEmptyData] = useState(false);

    const toastError = (message) => {
        toast.error(message, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    };

    //Retorna a data selecionada já formatada em data.
    const selectReceiptDate = () => {

        let selectedDate = document.querySelector(".receipt-date").value;

        if (selectedDate) {
            selectedDate = new Date(`${selectedDate}T00:00:00`)
        }

        return selectedDate;

    };

    const getData = async () => {

        setIsLoading(true);

        const selectedReceiptDate = selectReceiptDate();

        if (!selectedReceiptDate) {
            toastError("Nenhuma data selecionada!");
            return;
        }

        const result = await groupReceiptsByBranch(receipts, selectedReceiptDate);

        if (!result || result.length <= 0) {
            setIsEmptyData(true);
        } else {
            setIsEmptyData(false);
        }

        setData(result)
        setIsLoading(false);
        setIsLoaded(true);

    };

    //Retonar um objeto agrupado por filial desde que o "type" seja "success".
    const groupedByBranch = useCallback(() => {

        const branchs = data.reduce((acc, item) => {

            if (item.type === "success") {
                const branchValue = item.data[0].E1_FILIAL;
    
                acc[branchValue] = acc[branchValue] || [];
                acc[branchValue].push(item);
            }
    
            return acc;
        }, {});

        console.log(Object.keys(branchs));

    }, [data]); 

    useEffect(() => {

        if (isLoaded && !isEmptyData) {
            groupedByBranch()
        }

    }, [isLoaded, isEmptyData, groupedByBranch])

    return (
        <div className="receipts">
            <div className="receipts-header">
                <h1>Recebimentos</h1>
                <div className="receipts-options">
                    <input type="date" className="receipt-date" />
                    <PrimaryButton text="Exibir" onClick={getData} />
                </div>
            </div>

            {/* Mostra um spinner enquanto estiver carregando os dados */}
            {isLoading &&
                <div className="receipts-loading-data">
                    <Spinner></Spinner>
                </div>
            }

            {/* Verifica se os dados fora carregados e se esta vazio */}
            {isLoaded && isEmptyData && !isLoading &&
                <div className="receipts-empty-data">
                    <h4 className="not-found-options">Nenhum resultado encontrado</h4>
                </div>
            }

            {/* Verifica se os dados fora carregados e se não esta vazio */}
            {isLoaded && !isEmptyData && !isLoading &&
                <div>
                    CARREGOU OS DADOS
                </div>
            }

            {/* <div>
                {receipts.map((item) => (
                    <h1 key={`${item.NSU}${item.PL}`}>{item.PL}</h1>
                ))}
            </div> */}
        </div>

    );
}

Receipts.propTypes = {
    receipts: propTypes.arrayOf(
        propTypes.shape({
        })
    ),
};

export default Receipts;