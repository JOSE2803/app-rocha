
import { parse } from 'date-fns';
import axios from "axios";

const groupReceiptsByBranch = async (receipts, selectedReceiptDate) => {

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
                        "codeType": "w1",
                        "message": "Concialiação não realizada ou não foi encontrada."
                    }, ...dataItem, ...response.data.data
                }
            }

            if (response.data.data && response.data.data.length > 1) {
                return {
                    ...{
                        "type": "warning",
                        "codeType": "w2",
                        "message": "Foi encontrado mais de uma conciliação para o mesmo recebimento."
                    }, ...dataItem, ...response.data.data
                }
            }

            if (response.data.data.E1_SALDO <= 0) {
                return {
                    ...{
                        "type": "warning",
                        "codeType": "w3",
                        "message": "Conciliação já baixada, compensada ou líquidada."
                    }, ...dataItem, ...response.data.data
                }
            }

            if (response.data.data.E1_SALDO < lowerLimitGrossValueReceived || response.data.data.E1_SALDO > upperLimitGrossValueReceived) {
                return {
                    ...{
                        "type": "warning",
                        "codeType": "w4",
                        "message": "O valor recebido difere do limite de tolerância do saldo do título conciliado."
                    }, ...dataItem, ...response.data.data
                }
            }

            return {
                ...{
                    "type": "success",
                    "codeType": "s1",
                    "message": "Conciliação encontrada com sucesso."
                }, ...dataItem, ...response.data.data
            }

        } catch (error) {
            return {
                ...{
                    "type": "error",
                    "codeType": "e1",
                    "message": "Erro inesperado."
                }, ...dataItem
            }
        }

    }));



    console.log(result.filter(el => el !== undefined));
};

const cleanValue = (value) => value.replace("'", "").trim().replace(",", ".");

export {
    groupReceiptsByBranch,
    cleanValue,
};