import { BASEURL, getCookieAccessToken, ACCESS_TOKEN_KEY } from "./auth";

//Functions that get fetches the dashboard data
export const getDashboardData = () => {
    return new Promise((resolve, reject) => {
        try {
            let access_token = getCookieAccessToken(ACCESS_TOKEN_KEY);
            if (access_token) {
                fetch(`${BASEURL}/dashboard`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        authorization: `Bearer ${access_token}`
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        resolve(data);
                    })
                    .catch(err => {
                        reject(err);
                    })
            }
        } catch (error) {
            reject(error);
        }
    })

}


export const arrangeData = (data) => {
    const arrangedData = Object.entries(data);
    arrangedData.sort((a, b) => a[0] - b[0]);
    return arrangedData;
}


//Function that returns labels  and sort data for the graph the week data(for today to day 7) and yearly data(from this month to month 12)
const labelsForGraph = (dataForGraph, durate) => {
    const dataToUse = arrangeData(dataForGraph);
    const labels = dataToUse.map((item, index) => {
        if (index === 0) {
            if (durate === "weekly") {
                return "today";
            } else {
                return "this month";
            }
        } else if (index === 1) {
            if (durate === "weekly") {
                return "yesterday"
            } else {
                return "last month"
            }
        }
        return `${durate === "weekly" ? "day" : "month"} ${index + 1}`
    })
    return labels;
}

//Function that returns y-axis(revenue) data for the graph
const revenueForGraph = (dataForGraph) => {
    const dataToUse = arrangeData(dataForGraph);
    return dataToUse.map(x => x[1].total);
}

//Function that returns object that represent the graph object
export const graphing = (dataForGraph, duration) => {
    return {
        type: 'bar',
        data: {
            labels: labelsForGraph(dataForGraph, duration),
            datasets: [{
                label: '# of Sales',
                data: revenueForGraph(dataForGraph, duration),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };
}


export const getOrdersData = (page = 1, searchTerm = '') => {
    return new Promise((resolve, reject) => {
        try {
            let access_token = getCookieAccessToken(ACCESS_TOKEN_KEY);
            if (access_token) {
                fetch(`${BASEURL}/orders?${page !== 1 ? `page=${page}&` : ``}${searchTerm !== '' ? `q=${searchTerm}` : ``}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        authorization: `Bearer ${access_token}`
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        resolve(data);
                    })
                    .catch(err => {
                        reject(err);
                    })
            }
        } catch (error) {
            reject(error);
        }
    })

}