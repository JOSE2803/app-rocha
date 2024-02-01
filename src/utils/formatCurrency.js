const formatCurrency = (value, currency) => {

    const currencyValue = value.toLocaleString('pt-br', {
      style: 'currency',
      currency
    });
  
    return currencyValue;
    
  };
  
  export default formatCurrency;
  