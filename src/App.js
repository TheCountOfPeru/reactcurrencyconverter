import React from "react";
import Select from 'react-select';
import DarkModeToggle from "react-dark-mode-toggle";

function CurrencyComboBox(props)
{
  if(props.currencies == null){
    return (
      <div>
  <Select />
      </div>
    );
  }
  else{
    var options = [];
    props.currencies.map(item => {
      options.push({value: item, label: item});
    })
    return (
      <div>
          <Select 
          options={options} 
          value={options.filter(({value}) => value === props.currentCurrency)}
          onChange={props.onChange}
          />
      </div>
    );
  }

}

class CurrencyConverter extends React.Component{
  constructor(props) {   
    super(props);    
    this.state = {
      amount: 1,
      fromCurrency: "USD",
      toCurrency: "USD",
      fromCurrencySymbol: "USD",
      toCurrencySymbol: null,
      result: null,
      availableCurrencies: null,
      availableCurrenciesRate: null,
      checked: false,
      darkMode: true,
    }
    this.handleAmountOnChange=this.handleAmountOnChange.bind(this);
    this.handleOnClick=this.handleOnClick.bind(this);
    this.handleOnClickFlip=this.handleOnClickFlip.bind(this);
    this.handleFromCurrencyChangeCombobox=this.handleFromCurrencyChangeCombobox.bind(this);
    this.handleToCurrencyChangeCombobox=this.handleToCurrencyChangeCombobox.bind(this);
    this.handleChange=this.handleChange.bind(this);
  }

  handleChange(checked) {
    this.setState({ checked });
    this.setState({ darkMode: !this.state.darkMode });
  }
  componentDidMount(){
    console.log("componentDidMount")
    const API_KEY = process.env.REACT_APP_KEY;  
    const API =
    "https://api.currencyapi.com/v3/latest?apikey="+API_KEY;
    fetch(API)
    .then(response => response.json())
    .then(response => {
      var codes = [];
      Object.keys(response.data)
      .map(function(i) {
        codes.push(response.data[i].code)
        return codes;
      });
      this.setState({availableCurrencies:codes})
    })
    .catch(err => {
      console.log(err);
    });
  }

  handleAmountOnChange(event){
    this.setState({amount: event.target.value});
  }
  
  handleOnClick(){ 
    var amount = parseFloat(this.state.amount);
    const API_KEY = process.env.REACT_APP_KEY; 
    var API;
    if(this.state.fromCurrency === "USD"){
      API =
      "https://api.currencyapi.com/v3/convert?apikey="+API_KEY+"&value="+amount+"&currencies="+this.state.toCurrency;
    }
    else{
      API =
      "https://api.currencyapi.com/v3/convert?apikey="+API_KEY+"&base_currency="+this.state.fromCurrency+"&value="+amount+"&currencies="+this.state.toCurrency;
    }
    console.log(API);
    fetch(API)
    .then(response => response.json())
    .then(response => {
      var result = [];
      Object.keys(response.data)
      .map(function(i) {
        result = response.data[i].value;
        return result;
      });
      this.setState({result: result})
      this.setState({toCurrencySymbol: this.state.toCurrency})
    })
    .catch(err => {
      console.log(err);
    });
  }

  handleOnClickFlip(){
    let temp = this.state.fromCurrency;
    this.setState({fromCurrency: this.state.toCurrency});
    this.setState({toCurrency: temp});
    temp = this.state.fromCurrencySymbol;
    this.setState({fromCurrencySymbol: this.state.toCurrencySymbol});
    this.setState({toCurrencySymbol: temp});
  }

  handleFromCurrencyChangeCombobox(obj){
    this.setState({fromCurrency: obj.value});
    this.setState({fromCurrencySymbol: obj.value});
  }

  handleToCurrencyChangeCombobox(obj){
    this.setState({toCurrency: obj.value});
  }

  render() {
    return (
      <>
      <div>
      <header class={"flex h-14 " + (this.state.darkMode ? 'bg-white' : 'bg-black')}>
      <div class="m-3">
      <DarkModeToggle
      onChange={this.handleChange}
      checked={this.state.checked}
      size={80}
    />

      </div>
      </header>

  <div class={"h-7 " + (this.state.darkMode ? 'bg-white' : 'bg-black')} > 
  
  </div>
  <div class={"flex justify-center h-screen "  + (this.state.darkMode ? 'bg-white' : 'bg-black')}>
      <div class={"overflow-hidden " + (this.state.darkMode ? 'bg-white' : 'bg-black')}>
      
    <div class="flex flex-row">
      <div class="m-4">
      <p class={"text-base font-bold "  + (this.state.darkMode ? 'text-black' : 'text-white')}>
      Amount
      </p>
       <input class="border-2 p-1.5" type="number" step="any" value={this.state.amount} onChange={this.handleAmountOnChange} autoFocus></input>
      </div>
      <div class="m-4">
      <p class={"text-base font-bold "  + (this.state.darkMode ? 'text-black' : 'text-white')}>
      From
      </p>
      <CurrencyComboBox onChange={this.handleFromCurrencyChangeCombobox} currentCurrency={this.state.fromCurrency} currencies={this.state.availableCurrencies}/>
       </div>
       <div class="m-4">
         <button class={" border-2 hover:bg-blue-600 mt-7 p-1 "   + (this.state.darkMode ? 'text-black' : 'text-white')} onClick={this.handleOnClickFlip} >Switch</button>
       </div>
       <div class="m-4">
       <p class={"text-base font-bold "  + (this.state.darkMode ? 'text-black' : 'text-white')}>
      To
      </p>
      <CurrencyComboBox onChange={this.handleToCurrencyChangeCombobox} currentCurrency={this.state.toCurrency} currencies={this.state.availableCurrencies}/>
       </div>
    </div>
    <div>
    <p class={"m-4 font-bold text-xl "  + (this.state.darkMode ? 'text-black' : 'text-white')}>
    {this.state.amount} {this.state.fromCurrencySymbol} =
    </p>

    </div>
    <div>
    <p class={"m-4 font-bold text-xl "  + (this.state.darkMode ? 'text-black' : 'text-white')}>
    {this.state.result} {this.state.toCurrencySymbol}
    </p>

    </div>
    <div class="flex justify-end m-4">
      <button class={"font-bold text-xl m-4 border-2  px-6 py-4 hover:bg-blue-600 "   + (this.state.darkMode ? 'text-black' : 'text-white')}  onClick={this.handleOnClick}>Convert</button>
    </div>
  </div>
  </div>
  </div>
      </>
    );
  }
}

function App() {
  return (
    <CurrencyConverter/>
  );
}

export default App;
