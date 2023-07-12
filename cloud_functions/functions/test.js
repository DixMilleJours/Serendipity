const axios = require('axios');

const testFlightData = {
    flights: [
        {
            carrier: 'Air Canada',
            price: 200,
            departureTime: '10:00',
            arrivalTime: '12:00',
            duration: '2:00',
            stops: 0
        },
        {
            carrier: 'WestJet',
            price: 150,
            departureTime: '11:00',
            arrivalTime: '14:00',
            duration: '3:00',
            stops: 1
        },
        {
            carrier: 'Delta',
            price: 180,
            departureTime: '09:30',
            arrivalTime: '12:30',
            duration: '3:00',
            stops: 0
        }
    ]
};


const testBudget = 500; 

axios.post('https://us-central1-serendipity-e1c63.cloudfunctions.net/getOptimalFlight', { 
    flightData: testFlightData, 
    budget: testBudget 
}).then((response) => {
    console.log(response.data);
}).catch((error) => {
    console.error(error);
});
