import { getOrdersData } from "./utilities";
import { logout, authenticateCalls } from "./auth";
import "../css/orders.css";


const orderTableRef = document.getElementById("order-table").getElementsByTagName('tbody')[0];

const lastPage = document.getElementById("last-page");
const currentPage = document.getElementById("current-page");
const nextPage = document.getElementById("next-page");
const previousPage = document.getElementById("previous-page");
const searchQuery = document.getElementById("search-query");
const navToDashboard = document.getElementById("nav-to-dashboard");
const loggingOut = document.getElementById("log-out");
const overLay = document.getElementById("the-overlay");

let initialPage = 1;
let search = '';

let orderValues;
let orderData;
let totalPages;



const loadOrderDataAndDisplay = (initPage, searchTerm) => {
    authenticateCalls();
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
            totalPages = Math.ceil(res.total / res.orders.length);
            lastPage.innerHTML = isNaN(totalPages) ? 1 : totalPages;
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

            overLay.style.display = "none";
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
    overLay.style.display = "block";
    initialPage++;
    orderTableRef.innerHTML = "";
    loadOrderDataAndDisplay(initialPage, search)
}

//Function to handle prev page navigation
const handlePrevPage = () => {
    overLay.style.display = "block";
    initialPage--;
    orderTableRef.innerHTML = "";
    loadOrderDataAndDisplay(initialPage, search)
}
let oldVal = '';


//Function to handle Search functionality
const handleQueryChange = (event) => {
    orderTableRef.innerHTML = "LOADING.....";
    initialPage = 1;
    setTimeout(() => {
        if (oldVal !== event.target.value) {
            oldVal = event.target.value
            orderTableRef.innerHTML = "";
            loadOrderDataAndDisplay(initialPage, event.target.value);
            search = event.target.value;
        }
    }, 1000)
}

const navigateToDashboard = (e) => {
    e.preventDefault();
    window.location.assign("./dashboard.html");
}

const logOutUser = (e) => {
    e.preventDefault();
    logout();
}


nextPage.addEventListener('click', handleNextPage);
previousPage.addEventListener('click', handlePrevPage);
searchQuery.addEventListener("keyup", handleQueryChange)
navToDashboard.addEventListener('click', navigateToDashboard);
loggingOut.addEventListener('click', logOutUser);



