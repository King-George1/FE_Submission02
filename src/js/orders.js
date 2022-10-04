import { getOrdersData } from "./utilities";
import "../css/orders.css";


const orderTableRef = document.getElementById("order-table").getElementsByTagName('tbody')[0];
const lastPage = document.getElementById("last-page");
const currentPage = document.getElementById("current-page");
const nextPage = document.getElementById("next-page");
const previousPage = document.getElementById("previous-page");
const searchQuery = document.getElementById("search-query");

let initialPage = 1;
let search = '';

let orderValues;
let orderData;
let totalPages;

const loadOrderDataAndDisplay = (initPage, searchTerm) => {
    getOrdersData(initPage, searchTerm)
        .then(res => {
            orderValues = res;
            orderData = res.orders.map((item) => ({
                productName: item.product.name,
                date: item.created_at.slice(0, 10),
                price: `${item.currency}${item.total}`,
                status: `${item.status.charAt(0).toUpperCase()}${item.status.slice(1)}`
            }))
            currentPage.innerHTML = res.page;
            lastPage.innerHTML = totalPages = Math.ceil(res.total / res.orders.length);
            for (let item of orderData) {
                createOrderTableDataRows(item.productName, item.date, item.price, item.status);
            }
            if (initialPage === 1) {
                previousPage.style.visibility = "hidden";
            } else {
                previousPage.style.visibility = "visible";
            }
            if (initialPage === totalPages) {
                nextPage.style.visibility = "hidden";
            } else {
                nextPage.style.visibility = "visible";
            }
        })
}




const createOrderTableDataRows = (productName, date, price, status) => {
    //Insert a row at the end of table
    const newRow = orderTableRef.insertRow()

    //Insert a cell at the end of the row
    const newProductNameCell = newRow.insertCell();
    newProductNameCell.appendChild(document.createTextNode(productName))
    const newDateCell = newRow.insertCell();
    newDateCell.appendChild(document.createTextNode(date))
    const newPriceCell = newRow.insertCell();
    newPriceCell.appendChild(document.createTextNode(price))
    const newStatusCell = newRow.insertCell();
    newStatusCell.setAttribute("data-num", status)
    newStatusCell.appendChild(document.createTextNode(status))


}

window.addEventListener("load", loadOrderDataAndDisplay(initialPage, search));

//Function to handle next page navigation
const handleNextPage = () => {
    initialPage++;
    orderTableRef.innerHTML = "";
    loadOrderDataAndDisplay(initialPage, search)
}

//Function to handle prev page navigation
const handlePrevPage = () => {
    initialPage--;
    orderTableRef.innerHTML = "";
    loadOrderDataAndDisplay(initialPage, search)
}
let oldVal = '';


//Function to handle Search functionality
const handleQueryChange = (event) => {
    initialPage = 1;
    setTimeout(() => {
        if (oldVal !== event.target.value) {
            oldVal = event.target.value
            console.log(event.target.value)
            orderTableRef.innerHTML = "";
            loadOrderDataAndDisplay(initialPage, event.target.value);
            search = event.target.value;
        }
    }, 1000)
}


nextPage.addEventListener('click', handleNextPage);
previousPage.addEventListener('click', handlePrevPage);
searchQuery.addEventListener("keyup", handleQueryChange)



