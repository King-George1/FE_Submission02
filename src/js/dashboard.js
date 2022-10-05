import { Chart, BarController, BarElement, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';
import { getDashboardData, graphing, arrangeData } from "./utilities";
import { logout } from './auth';
import "../css/dashboard.css";

Chart.register(LineController, LineElement, BarElement, BarController, PointElement, LinearScale, Title, CategoryScale);


const checkBox = document.getElementById("check-box");
const graphHeading = document.getElementById("graph-header");
const tableRef = document.getElementById("sales").getElementsByTagName('tbody')[0];
const navToOrder = document.getElementById("nav-to-order");
const logOutUser = document.getElementById("log-out-user");
const overLay = document.getElementById("the-overlay");

let data;
let sales_over_time_week;
let sales_over_time_year
let duration = "weekly";
let dataForGraph;
let ctx;

const loadDataAndPlot = () => {
    getDashboardData()
        .then(res => {
            data = res;
            ctx = document.getElementById('myChart').getContext('2d');
            sales_over_time_week = Object.values(res.dashboard.sales_over_time_week);
            sales_over_time_year = Object.values(res.dashboard.sales_over_time_year);
            dataForGraph = sales_over_time_week;
            handleSummaryData();
            const graph = graphing(dataForGraph, duration);


            let bestsellersInfo = data.dashboard.bestsellers.map(x => ({ name: x.product.name, price: x.revenue / x.units, unitSold: x.units, revenue: x.revenue }));

            //Sorted the bestsellers details in descending order based on the units sold.
            bestsellersInfo = bestsellersInfo.sort(function (a, b) {
                return b.unitSold - a.unitSold;
            })
            for (let item of bestsellersInfo) {
                createTableDataRows(item.name, item.price, item.unitSold, item.revenue);
            }
            const myChart = new Chart(ctx, graph)
            overLay.style.display = "none";

        })
        .catch(err => {

        })

}


const handleSummaryData = () => {
    const todayRev = document.getElementById("today-rev");
    const todayOrders = document.getElementById("today-orders");
    const lastweekRev = document.getElementById("lastweek-rev");
    const lastweekOrders = document.getElementById("lastweek-orders");
    const lastmonthRev = document.getElementById("lastmonth-rev");
    const lastmonthOrders = document.getElementById("lastmonth-orders");
    const table = document.getElementById("table");

    const weekData = arrangeData(sales_over_time_week);
    const yearlyData = arrangeData(sales_over_time_year);

    const lastWeekRevenues = weekData.map(x => x[1].total).reduce((a, b) => (a + b));
    const lastWeekOrd = weekData.map(x => x[1].orders).reduce((a, b) => (a + b));

    todayRev.innerHTML = `$${weekData[0][1].total}`;
    todayOrders.innerHTML = `${weekData[0][1].orders} orders`;

    lastweekRev.innerHTML = `$${lastWeekRevenues}`;
    lastweekOrders.innerHTML = `${lastWeekOrd} orders`;

    lastmonthRev.innerHTML = `$${yearlyData[1][1].total}`;
    lastmonthOrders.innerHTML = `${yearlyData[1][1].orders} orders`;

}

const createTableDataRows = (name, price, units, revenue) => {
    //Insert a row at the end of table
    const newRow = tableRef.insertRow()

    //Insert a cell at the end of the row
    const newNameCell = newRow.insertCell();
    newNameCell.appendChild(document.createTextNode(name))
    const newPriceCell = newRow.insertCell();
    newPriceCell.appendChild(document.createTextNode(price))
    const newUnitsCell = newRow.insertCell();
    newUnitsCell.appendChild(document.createTextNode(units))
    const newRevenueCell = newRow.insertCell();
    newRevenueCell.appendChild(document.createTextNode(revenue))


}


const handleToggleChange = () => {
    let existingChart = Chart.getChart("myChart");
    existingChart.destroy();
    const ctx = document.getElementById('myChart').getContext('2d');
    if (!checkBox.checked) {
        dataForGraph = sales_over_time_week
        duration = "weekly"
        graphHeading.innerHTML = "Revenue (Last 7 days)"
    } else {
        dataForGraph = sales_over_time_year;
        duration = "yearly"
        graphHeading.innerHTML = "Revenue (Last 12 Months)"
    }

    const graph = graphing(dataForGraph, duration);

    const myChartw = new Chart(ctx, graph)
}


const navigateToOrdersPage = (e) => {
    e.preventDefault();
    window.location.assign("./orders.html");
}

const loggingOutUser = (e) => {
    e.preventDefault();
    logout();
}

checkBox.addEventListener("change", handleToggleChange)
window.addEventListener('load', loadDataAndPlot);
navToOrder.addEventListener('click', navigateToOrdersPage)
logOutUser.addEventListener('click', loggingOutUser);










