import { useState } from "react";
import "./FilterOrder.css";
import { TbFilterDown, TbFilterUp } from "react-icons/tb";
import SwitchToggle from "../../../../components/SwitchToggle/SwitchToggle.jsx";
import { Stack, TextField } from '@mui/material';

function FilterOrder() {

    const [isVisible, setIsVisible] = useState(false);
    const [toggle, setToggle] = useState(false);

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
                            <Stack spacing={8}>
                                <Stack direction="row" spacing={4}>
                                    <TextField label="Pedido" variant="filled"/>
                                </Stack>
                            </Stack>
                            <SwitchToggle
                                isOn={toggle}
                                onColor="#EF476F"
                                handleToggle={() => setToggle(!toggle)}
                            />
                            <input type="text" />
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