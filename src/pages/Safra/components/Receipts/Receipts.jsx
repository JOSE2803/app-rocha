import axios from "axios";
import propTypes from 'prop-types';
import PrimaryButton from "../../../../components/Button/PrimaryButton";

import { parse } from 'date-fns';

import "./Receipts.css";



function Receipts({ receipts }) {

    // Função para limpar os valores das propriedades
    const cleanValue = (value) => value.replace("'", "").trim().replace(",", ".");

    //Retorna a data selecionada já formatada em data.
    const selectReceiptDate = () => {

        let selectedDate = document.querySelector(".receipt-date").value;

        if (selectedDate) {
            selectedDate = new Date(`${selectedDate}T00:00:00`)
        }

        return selectedDate;

    };

    //Responsável por localizar o contas a receber no Protheus e agrupar por filial.
    const groupReceiptsByBranch = async () => {

        const selectedReceiptDate = selectReceiptDate();

        if (!selectedReceiptDate) {
            return;
        }

        const result = await Promise.all(receipts.map(async (item) => {

            const dataItem = {
                nsu: cleanValue(item.NSU).trim(),
                saleDate: parse(cleanValue(item["DT VENDA"]).trim(), "dd.MM.yyyy", new Date()), //Data do recebimento 
                receiptDate: parse(cleanValue(item["DT EFETIVA"]).trim(), "dd.MM.yyyy", new Date()), //Data do recebimento     
                grossValueReceived: parseFloat(cleanValue(item["VALOR BRUTO PARC."])),
                netValueReceived: parseFloat(cleanValue(item["VALOR LIQUIDO"])),
                installment: parseInt(cleanValue(item.PL).trim()),
                product: cleanValue(item.PRODUTO).trim(),
            };

            if (dataItem.receiptDate.getTime() !== selectedReceiptDate.getTime()) {
                return;
            }

            const lowerLimitGrossValueReceived = dataItem.grossValueReceived - 0.5;
            const upperLimitGrossValueReceived = dataItem.grossValueReceived + 0.5;

            try {

                const params = {
                    startNsu: cleanValue(item.NSU),
                    endNsu: cleanValue(item.NSU),
                    startNsuInstallment: dataItem.installment === 0 ? "1" : dataItem.installment.toString(),
                    endNsuInstallment: dataItem.installment === 0 ? "1" : dataItem.installment.toString(),
                };

                const response = await axios.get(`${import.meta.env.VITE_API_URL}/accounts-receivable`, { params });

                if (response.data.data && response.data.data.length <= 0) {
                    return {
                        ...{
                            "type": "warning",
                            "message": "Concialiação não realizada ou não foi encontrada."
                        }, ...dataItem, ...response.data.data
                    }
                }

                if (response.data.data && response.data.data.length > 1) {
                    return {
                        ...{
                            "type": "warning",
                            "message": "Foi encontrado mais de uma conciliação para o mesmo recebimento."
                        }, ...dataItem, ...response.data.data
                    }
                }

                if (response.data.data.E1_SALDO <= 0) {
                    return {
                        ...{
                            "type": "warning",
                            "message": "Conciliação já baixada, compensada ou líquidada."
                        }, ...dataItem, ...response.data.data
                    }
                }

                if (response.data.data.E1_SALDO < lowerLimitGrossValueReceived || response.data.data.E1_SALDO > upperLimitGrossValueReceived) {
                    return {
                        ...{
                            "type": "warning",
                            "message": "O valor recebido difere do limite de tolerância do saldo do título conciliado."
                        }, ...dataItem, ...response.data.data
                    }
                }

                return {
                    ...{
                        "type": "success",
                        "message": "Conciliação encontrada com sucesso."
                    }, ...dataItem, ...response.data.data
                }

            } catch (error) {
                return {
                    ...{
                        "type": "error",
                        "message": "Erro inesperado."
                    }, ...dataItem
                }
            }

        }));

        

        console.log(result.filter(el => el !== undefined));
    };

    return (
        <div className="receipts">
            <div className="receipts-header">
                <h1>Recebimentos</h1>
                <div className="receipts-options">
                    <input type="date" className="receipt-date" />
                    <PrimaryButton text="Exibir" onClick={groupReceiptsByBranch} />
                </div>
            </div>

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