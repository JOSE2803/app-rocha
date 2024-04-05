import "./Filters.css";

function Filters() {
    return ( 
        <div className="filter-content">
            <h2>Filtros</h2>
            <div className="filters-inputs-div">
                <input 
                    type="text" 
                    placeholder="Pesquisar NSU..."
                    className="filters-input" 
                />
                <input 
                    type="text" 
                    placeholder="Pesquisar por valor..."
                    className="filters-input" 
                />
            </div>
        </div>
     );
}

export default Filters;