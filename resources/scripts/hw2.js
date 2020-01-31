// Constants
const DINGUS_PRICE = 14.25;
const WIDGET_PRICE = 9.99;
const ZERO_FORMAT = '0.00';
const DEBUG = true; // Where might this flag be used? (It's not mandatory)


// Global store (What else would you need here?)
let store = {
	orderHistory: generateEntries(),
	currID: generateEntries().length,
	currDingusQuantity: 0,
	currWidgetQuantity: 0,
	dingusQuantity: 0,
	widgetQuantity: 0,
	//currTotal: 0,
	total: 0
  };


function generateEntries() {
	// Returns an orderHistory array
	// [ID#, Date, Dingus quantity, Widget quantity]
	return [
	  [1, '01/01/2020', 1, 1], 
	  [2, '01/02/2020', 2, 2]
	]
}

///////////////////////////////////////// INITIAL LOAD //////////////////////////////////////////

// load table to initial state
function load() {
	for (let i = 0; i < localStorage.length; i++) {
		let key = localStorage.key(i);
		let val = JSON.parse(localStorage.getItem(key.toString()));
		store[key] = val;
	}
	fillTable(store.orderHistory);
}

////////////////////////////////////////// ORDER FORM //////////////////////////////////////////

// once dingus or widget quantity fields are filled out: calculate total for widget or dingus and total for both
function updateTotal(quantity, dingus) {

	// if quantity is greater than 1 then enable order button
	if (quantity > 0) {
		document.getElementsByClassName("button-success pure-button")[0].disabled = false; 
	} 
	
	// some edge cases for inputs
	let d = document.getElementById("dingus").value;
	let w = document.getElementById("widget").value;
	

	let dingusTotal = 0;
	let widgetTotal = 0;

	// if quantity is from dingus field
	if (dingus==true) {
		dingusTotal = (quantity * DINGUS_PRICE).toFixed(2);
		document.getElementById("dtotal").value = dingusTotal;
		store.currDingusQuantity = Number(quantity);
	}
	// if quantity is from widget field
	if (dingus==false) {
		widgetTotal = (quantity * WIDGET_PRICE).toFixed(2);
		document.getElementById("wtotal").value = widgetTotal;
		store.currWidgetQuantity = Number(quantity);
		console.log(typeof(currWidgetQuantity));
	}
	// calculate total field
	let totalVal = Number(document.getElementById("dtotal").value) + Number(document.getElementById("wtotal").value);
	document.getElementById("total").value = totalVal.toFixed(2);

}

// once order button is hit: prepare array from order form to populate in table 
function prepOrder() {
	let d = new Date();
	let myDate =  (d.getDate() < 10 ? '0' : '') + d.getDate();
	let myMonth = (d.getMonth() < 10 ? '0' : '') + (d.getMonth() + 1);
	let myYear = d.getFullYear();
	store.currID += 1;
	let newOrder = [store.currID, myMonth+'/'+myDate+'/'+myYear, store.currDingusQuantity, store.currWidgetQuantity];
	store.orderHistory.push(newOrder);
	clearForm();
	fillTable([newOrder]);
	preserveTable();
}

//once cancel button is hit: replace user input with 0's
function clearForm() {
	store.currDingusQuantity = 0;
	store.currWidgetQuantity = 0;
	document.getElementById("dingus").value= 0;
	document.getElementById("dtotal").value= ZERO_FORMAT;
	document.getElementById("widget").value= 0;
	document.getElementById("wtotal").value= ZERO_FORMAT;
	document.getElementById("total").value= ZERO_FORMAT;
	document.getElementsByClassName("button-success pure-button")[0].disabled = true; 
}

////////////////////////////////////////// TABLE //////////////////////////////////////////

// fills table with values based on order form
function fillTable(arr) {
	// for every array in arr, add a row
	for (let i = 0; i < arr.length; i++) {
		let row = document.getElementById('OHBody').insertRow(-1); 
		// for every element, add a cell
		for (let j = 0; j < arr[i].length; j++) {
			let cell = row.insertCell(j);
			cell.innerHTML = arr[i][j];
		}
		
		//updating some global variables
		store.dingusQuantity += Number(arr[i][arr[i].length-2]);
		store.widgetQuantity += Number(arr[i][arr[i].length-1]);

		// for the last cell (total cell) & compute total sales 
		let currDingusQuantity = arr[i][arr[i].length-2];
		let currWidgetQuantity = arr[i][arr[i].length-1]
		let rowTotal = (currDingusQuantity * DINGUS_PRICE) + (currWidgetQuantity * WIDGET_PRICE);
		let cell = row.insertCell(arr[i].length);
		cell.innerHTML = '<span id="moneysign">$</span>' + rowTotal.toFixed(2);

		store.total += Number(rowTotal);
	}
	updateScoreboard([store.dingusQuantity, store.widgetQuantity, store.total]);
}

////////////////////////////////////////// SCOREBOARD //////////////////////////////////////////

// update scoreboard based on array outputted from filltable()
function updateScoreboard(entries) {
	document.getElementById('dingusval').innerHTML = entries[0];
	document.getElementById('widgetval').innerHTML = entries[1];
	document.getElementById('salesval').innerHTML = '<span id="moneysign">$</span>' + entries[2].toFixed(2);

}

////////////////////////////////////////// PRESERVING DATA //////////////////////////////////////////

// preserve data in table; courtesy of w3schools
function preserveTable() {
	// Check browser support
	if (typeof(Storage) !== "undefined") {
		// Store
		localStorage.setItem("orderHistory", JSON.stringify(store.orderHistory));
		// Retrieve
		localStorage.setItem("currID", JSON.stringify(store.currID));
	  } else {
		alert("Sorry, there is a problem with your browser!");
	}
}

load();
