import { useState } from "react";
import "./FilterOrder.css";
import { TbFilterDown, TbFilterUp } from "react-icons/tb";
import { format, subDays } from 'date-fns';

function FilterOrder() {

    const [isVisible, setIsVisible] = useState(false);
    const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [startDate, setStartDate] = useState(format(subDays(new Date(), 3), "yyyy-MM-dd"));

    const handleClick = () => {
        setIsVisible(!isVisible);
    };

    return (
        <>
            {!isVisible &&
                <div className="filter-down" onClick={handleClick} title="Mostrar filtros">
                    <TbFilterDown className="filter-icon"></TbFilterDown>
                </div>
            }
            {isVisible &&
                <>
                    <div className="expanded-filter">
                        <form className="filter-options">
                            <div className="div-sales-order div-default">
                                <label>Pedido</label>
                                <input
                                    className="input-sales-order input-default"
                                    placeholder="Pedido..."
                                />
                            </div>
                            <div className="div-date div-default">
                                <div className="start-end-date div-default">
                                    <label htmlFor="datePicker">Data Inicial</label>
                                    <input
                                        className="input-default"
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div className="start-end-date div-default">
                                    <label htmlFor="datePicker">Data Final</label>
                                    <input
                                        className="input-default"
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="div-seller div-default">
                                <label>Vendedor</label>
                                <input
                                    className="input-seller input-default"
                                    placeholder="Vendedor..."
                                />
                            </div>
                        </form>
                        <div className="filter-up" onClick={handleClick} title="Ocultar filtros">
                            <TbFilterUp className="filter-icon"></TbFilterUp>
                        </div>
                    </div>

                </>

            }
        </>
    );

}

export default FilterOrder;