// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");
const { getFunctions, httpsCallable, connectFunctionsEmulator } = require('firebase/functions');
const { getApp } = require('firebase/app');
// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

// Fetch the OpenAI key from the Firebase functions configuration
const { Configuration, OpenAIApi } = require("openai");

// Setup OpenAI API configuration with the fetched OpenAI key
const configuration = new Configuration({
    apiKey: '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',
});

const openai = new OpenAIApi(configuration);

/* Other imports start here... */
// Axios
const axios = require('axios')
// CORS
const cors = require('cors')({ origin: true });
// Amadeus
const Amadeus = require('amadeus');

/* Credentials start here... */
var amadeus = new Amadeus({
    hostname: 'production',
    clientId: '7mjGX9eTRAs8VJe3JeAcylCiZBUQoRy0',
    clientSecret: 'fwM8VVtfG05pEgzi'
});

/* Cloud functions start here... */
// deprecated
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

exports.searchFlightV2 = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        await amadeus.shopping.flightOffersSearch.get({
            // TODO - Get request from front-end.
            originLocationCode: 'YYZ',
            destinationLocationCode: 'JFK',
            departureDate: '2023-07-17',
            returnDate: '2023-07-24',
            adults: '1',
            children: '1',
            travelClass: 'ECONOMY',
            max: '10',
            nonStop: 'true'
        }).then((response) => {
            let flightRes = response.data.map(item => ({
                carrier: item.validatingAirlineCodes[0],
                currency: item.price.currency,
                price: item.price.grandTotal,
                go_duration: item.itineraries[0].duration,
                go_departure: item.itineraries[0].segments[0].departure.iataCode,
                go_departure_time: item.itineraries[0].segments[0].departure.at,
                go_terminal: item.itineraries[0].segments[0].departure.terminal,
                go_arrival: item.itineraries[0].segments[0].arrival.iataCode,
                go_arrival_time: item.itineraries[0].segments[0].arrival.at,
                leave_duration: item.itineraries[1].duration,
                leave_departure: item.itineraries[1].segments[0].departure.iataCode,
                leave_departure_time: item.itineraries[1].segments[0].departure.at,
                leave_terminal: item.itineraries[1].segments[0].departure.terminal,
                leave_arrival: item.itineraries[1].segments[0].arrival.iataCode,
                leave_arrival_time: item.itineraries[1].segments[0].arrival.at
            }))
            res.set('Access-Control-Allow-Origin', '*');
            res.send(flightRes)
        }).catch((error) => {
            res.set('Access-Control-Allow-Origin', '*');
            res.send(error)
        });
    })
})

exports.searchHotels = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        await amadeus.referenceData.locations.hotels.byCity.get({
            cityCode: 'JFK',
            ratings: "4",
            radius: "30"
        }).then(async (response) => {
            // Limit hotel count to 10.
            var limitedHotels = response.data.slice(0, 10);

            let hotelInfo = limitedHotels.map((hotel) => ({
                hotelName: hotel.name,
                hotelId: hotel.hotelId
            }))

            let hotelIds = hotelInfo.map((hotel) => hotel.hotelId);

            return await amadeus.shopping.hotelOffersSearch.get({
                hotelIds: JSON.stringify(hotelIds),
                adults: '1',
                checkInDate: '2023-07-17',
                checkOutDate: '2023-07-24',
                roomQuantity: '1',
            })
        }).then((response) => {
            let hotelRes = response.data.map((hotel) => ({
                hotelId: hotel.hotel.hotelId,
                hotelName: hotel.hotel.name,
                offerId: hotel.offers[0].id,
                offerPrice: hotel.offers[0].price.total,
                offerCurrency: hotel.offers[0].price.currency
            }))
            res.set('Access-Control-Allow-Origin', '*');
            res.send(hotelRes)
        }).catch((error) => {
            res.set('Access-Control-Allow-Origin', '*');
            res.send(error)
        });
    })
})

exports.getOptimalFlight = functions.https.onCall(async (data, context) => {
    const flightData = data.flightData;
    const budget = data.budget;

    // !!!! budget is an array of 2 numbers, so will need to change the prompt.
    const prompt = `Given the flight data ${JSON.stringify(flightData)} and a budget of ${budget}, return the optimal flight in human-readable sentence. No explanation.`;

    try {
        const gptResponse = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ]
        })
        return { gptResponse: gptResponse.data.choices[0].message }
    } catch (error) {
        return { error: 'An error occurred while processing your request.' };
    }
});

async function getOptimalFlightV2(data) {
    const flightData = data.flightData;
    const budget = data.budget;

    // !!!! budget is an array of 2 numbers, so will need to change the prompt.
    const prompt = `Given the flight data ${JSON.stringify(flightData)} and a budget of ${budget}, return the optimal flight in human-readable sentence. No explanation.`;

    try {
        const gptResponse = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ]
        })
        return gptResponse.data.choices[0].message
    } catch (error) {
        throw new Error(`GPT-3 API error: ${error.message}`);
    }
}

exports.generator = functions.https.onCall(async (data, context) => {
    try {
        /* First, get the JSON fields for the subsequent API calls. */

        // const flight = data.flight
        // const hotel = data.hotel

        /* Second, make API calls.  */

        // !!! local test for now.
        const flightPromise = axios.post('http://127.0.0.1:5001/serendipity-e1c63/us-central1/searchFlightV2')
            .catch(error => { throw new Error(`Flight API error: ${error.message}`); });
        const hotelPromise = axios.get('http://127.0.0.1:5001/serendipity-e1c63/us-central1/searchHotels')
            .catch(error => { throw new Error(`Hotel API error: ${error.message}`); });

        const [flightResponse, hotelResponse] = await Promise.all([flightPromise, hotelPromise]);

        const optimalFlightResponse = await getOptimalFlightV2({
            flightData: flightResponse.data,
            budget: "1000",
        })
        const optimalFlight = optimalFlightResponse.content;
        return { finalResult: optimalFlight }
    } catch (error) {
        console.error(error);
        throw new functions.https.HttpsError('unknown', error.message);
    }
})


