import React, { useState, useEffect, Component } from "react";
import Select from 'react-select';

function CurrencyComboBox(props)
{
  if(props.currencies == null){
    return (
      <div>
  <Select/>
      </div>
    );
  }
  else{
    var options = [];
    props.currencies.map(item => {
      options.push({value: item, label: item});
    })
    console.log(options)
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
      //options: [],
    }
    
    this.handleAmountOnChange=this.handleAmountOnChange.bind(this);
    this.handleOnClick=this.handleOnClick.bind(this);
    this.handleOnClickFlip=this.handleOnClickFlip.bind(this);
    this.handleFromCurrencyChangeCombobox=this.handleFromCurrencyChangeCombobox.bind(this);
    this.handleToCurrencyChangeCombobox=this.handleToCurrencyChangeCombobox.bind(this);

  }

  componentDidMount(){
    console.log("componentDidMount")
    const API_KEY = process.env.REACT_APP_KEY;  
    const API =
    "https://freecurrencyapi.net/api/v2/latest?apikey="+API_KEY;
    fetch(API)
    .then(response => response.json())
    .then(response => {
      //console.log(response)
      const array1 = ['USD'];
      const array2 = [1];
      this.setState({availableCurrencies: array1.concat(Object.keys(response.data))  })
      this.setState({availableCurrenciesRate: array2.concat(Object.values(response.data))})
      //console.log(this.state.availableCurrencies);

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

    var fromRate = this.state.availableCurrenciesRate[this.state.availableCurrencies.indexOf(this.state.fromCurrency)]
    var toRate = this.state.availableCurrenciesRate[this.state.availableCurrencies.indexOf(this.state.toCurrency)]
    console.log(fromRate)
    console.log(toRate)
    var newRate = fromRate/toRate;
    console.log(newRate)
    this.setState({result: (amount/newRate).toFixed(5)});

    this.setState({fromCurrencySymbol: this.state.fromCurrency})
    this.setState({toCurrencySymbol: this.state.toCurrency})
  }

  handleOnClickFlip(){
    let temp = this.state.fromCurrency;
    this.setState({fromCurrency: this.state.toCurrency});
    this.setState({toCurrency: temp});

  }

  handleFromCurrencyChangeCombobox(obj){
    this.setState({fromCurrency: obj.value});
  }

  handleToCurrencyChangeCombobox(obj){
    this.setState({toCurrency: obj.value});
  }

  render() {
    return (
      <>
      <header class="flex h-14 bg-blue-800"></header>

  <div class=""> 
  asd
  </div>
  <div class="">
  <div class="flex justify-center">
      <div class="max-w-4xl rounded-xl overflow-hidden shadow-2xl">
      <div class="font-bold text-xl m-4">Convert</div>
    <div class="flex px-6 py-4 flex-row">
      <div class="m-4">
      <p class="text-gray-700 text-base font-bold">
      Amount
      </p>
       <input class="shadow-inner border-2 p-2" type="number" step="any" value={this.state.amount} onChange={this.handleAmountOnChange} autoFocus></input>
      </div>
      <div class="m-4">
       <p class="text-gray-700 text-base font-bold">
      From
      </p>
      <CurrencyComboBox onChange={this.handleFromCurrencyChangeCombobox} currentCurrency={this.state.fromCurrency} currencies={this.state.availableCurrencies}/>
       </div>
       <div class="m-4">
         <button class="rounded-3xl shadow-sm bg-gray-200 hover:bg-blue-600 mt-8 p-1" onClick={this.handleOnClickFlip} >Switch</button>
       </div>
       <div class="m-4">
       <p class="text-gray-700 text-base font-bold">
      To
      </p>
      <CurrencyComboBox onChange={this.handleToCurrencyChangeCombobox} currentCurrency={this.state.toCurrency} currencies={this.state.availableCurrencies}/>
       </div>
    </div>
    <div class="font-bold text-xl m-4">
    {this.state.amount} {this.state.fromCurrencySymbol}
    </div>
    <div class="font-bold text-xl m-4">
    {this.state.result} {this.state.toCurrencySymbol}
    </div>
    <div class="flex justify-end m-4">
      <button class="font-bold text-xl m-4 border-2 rounded-3xl px-6 py-4 hover:bg-blue-600" onClick={this.handleOnClick}>Convert</button>
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
