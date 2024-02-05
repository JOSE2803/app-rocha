import { useState } from "react";
import "./FilterOrder.css";
import { TbFilterDown, TbFilterUp } from "react-icons/tb";

function FilterOrder() {

    const [isVisible, setIsVisible] = useState(false);

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
                        <div className="filter-options">
                            <h1>FILTROS AQUI</h1>
                            <h1>FILTROS AQUI</h1>
                            <h1>FILTROS AQUI</h1>
                            <h1>FILTROS AQUI</h1>
                        </div>
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