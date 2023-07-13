// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");
// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

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
            departureDate: '2023-07-13',
            returnDate: '2023-07-17',
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
                adults: '2',
                checkInDate: '2023-07-13',
                checkOutDate: '2023-07-16',
                roomQuantity: '3',
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

exports.searchAttractions = functions.https.onRequest(async(req, res)=>{
    cors(req, res, async () => {
        amadeus.referenceData.locations.pointsOfInterest.get({
            latitude: '43.64289',
            longitude: '-79.40103',
            radius:2
          }).then((response) => {
            res.set('Access-Control-Allow-Origin', '*');
            res.send(response)
        }).catch((error) => {
            res.set('Access-Control-Allow-Origin', '*');
            res.send(error)
        });
    })
})



