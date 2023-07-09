// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

// Axios
const axios = require('axios')

// CORS
const cors = require('cors')({origin: true});

exports.searchFlight = functions.https.onRequest(async (req, res) => {
    // ! Crucial, must use the cors wrapper.
    cors(req, res, () => {
        const TOKEN = 'duffel_test_jmmpvZzOOkD-qvaahFZGjjqtGXFcT8jipwFdcx-bIBH';
    var searchID = ''

    const data = req.body

    const headers = {
        'Accept-Encoding': 'gzip',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Duffel-Version': 'v1',
        'Authorization': `Bearer ${TOKEN}`
    }

    // First, find all flights satisfying user inputs.
    axios.post(
        'https://api.duffel.com/air/offer_requests?return_offers=false&supplier_timeout=10000', data, { headers })
        .then((res) => {
            // Record the search id.
            // ! Notice the first `data` is mandatory from Axios.
            searchID = res.data.data.id;
            // Then, get those found flights.
            return axios.get('https://api.duffel.com/air/offers', {
                params: {
                    // Use the recorded search id to fetch the entire list of eligible flights.
                    offer_request_id: searchID,
                    limit: 10,
                    sort: "total_amount",
                    max_connections: 0
                },
                headers
            }
            )
        }).then((response) => {
            // ! Crucial, must set this.
            res.set('Access-Control-Allow-Origin', '*');
            res.send(response.data)
        })
        .catch((error) => {

        });
    })
});



