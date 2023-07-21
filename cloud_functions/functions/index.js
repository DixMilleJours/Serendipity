// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");
// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

// Fetch the OpenAI key from the Firebase functions configuration
const { Configuration, OpenAIApi } = require("openai");

// Setup OpenAI API configuration with the fetched OpenAI key
const configuration = new Configuration({
    apiKey: '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',
});

// const placeAPIKey = '5ae2e3f221c38a28845f05b63e357b1b0a0ade8195a1ccd5ba27738b'

// const yelpAPIKey = '-IdRLtv_5oNUULaCzsJ9GwDQTyV2YKgwlWgZT6v5hbniOgh0l0hEbQUCkacFvfZ_R6HPYTDx_hhZU0ewgrCC0vkYhLmvQ6qNDKS1hGe6nvc93mnBwJ5g1WzoCPC3ZHYx'

const googleAPI = 'AIzaSyArF98C3uGVEnul-hfQwmZTRfPK8kmlzIs'

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
            departureDate: '2023-07-20',
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
                checkInDate: '2023-07-20',
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

async function searchHotels(data) {
    try {
        const response1 = await amadeus.referenceData.locations.hotels.byCity.get({
            cityCode: data.destination,
            ratings: data.rating,
            radius: "30"
        })
        // Error handling.
        if (!response1.data.length) {
            throw new Error('No hotels found');
        }
        // Limit hotel count to 10.
        var limitedHotels = response1.data.slice(0, 10);

        let hotelInfo = limitedHotels.map((hotel) => ({
            hotelName: hotel.name,
            hotelId: hotel.hotelId
        }))

        let hotelIds = hotelInfo.map((hotel) => hotel.hotelId);
        const response2 = await amadeus.shopping.hotelOffersSearch.get({
            hotelIds: JSON.stringify(hotelIds),
            adults: data.hotelDetails[1],
            // TODO -> change check in / out date.
            checkInDate: data.startDate,
            checkOutDate: data.endDate,
            roomQuantity: data.hotelDetails[0],
        })
        // Error handling.
        if (!response2.data.length) {
            throw new Error('No hotel offers found');
        }
        let hotelRes = response2.data.map((hotel) => ({
            // hotelId: hotel.hotel.hotelId,
            hotelName: hotel.hotel.name,
            latitude: hotel.hotel.latitude,
            longitude: hotel.hotel.longitude,
            offerId: hotel.offers[0].id,
            offerPrice: hotel.offers[0].price.total,
            offerCurrency: hotel.offers[0].price.currency
        }))
        return hotelRes
    } catch (error) {
        throw new Error(`search hotels error: ${error.message}`);
    }
}

async function searchFlight(data) {
    try {
        const response = await amadeus.shopping.flightOffersSearch.get({
            // TODO - Get request from front-end.
            originLocationCode: data.departure,
            destinationLocationCode: data.destination,
            departureDate: data.startDate,
            returnDate: data.endDate,
            adults: data.travelDetails[2],
            children: data.travelDetails[3],
            travelClass: data.travelDetails[1],
            max: '10',
            nonStop: 'true'
        })
        // Error handling.
        if (!response.data.length) {
            throw new Error('No flights found');
        }
        let flightRes = response.data.map(item => ({
            carrier: item.validatingAirlineCodes[0],
            currency: item.price.currency,
            price: item.price.grandTotal,
            // go_duration: item.itineraries[0].duration,
            go_departure: item.itineraries[0].segments[0].departure.iataCode,
            go_departure_time: item.itineraries[0].segments[0].departure.at,
            go_terminal: item.itineraries[0].segments[0].departure.terminal,
            go_arrival: item.itineraries[0].segments[0].arrival.iataCode,
            go_arrival_time: item.itineraries[0].segments[0].arrival.at,
            // leave_duration: item.itineraries[1].duration,
            leave_departure: item.itineraries[1].segments[0].departure.iataCode,
            leave_departure_time: item.itineraries[1].segments[0].departure.at,
            leave_terminal: item.itineraries[1].segments[0].departure.terminal,
            leave_arrival: item.itineraries[1].segments[0].arrival.iataCode,
            leave_arrival_time: item.itineraries[1].segments[0].arrival.at
        }))
        return flightRes
    } catch (error) {
        throw new Error(`search flights API error: ${error.message}`);
    }
}

async function searchPlacesV2() {
    try {
        const response = await axios.get('https://api.opentripmap.com/0.1/en/places/radius?', {
            params: {
                apikey: placeAPIKey,
                radius: 5000,
                lat: 32.05458124467749,
                lon: 118.78957564478667,
                kinds: "restaurants",
                format: "json",
                limit: 10
            }
        });
        console.log(response.data)
        return response.data
    } catch (error) {
        throw new Error(`search places API error: ${error.message}`);
    }
}

async function gpt({flight, hotel, restaurant, poi}) {

    // !!!! budget is an array of 2 numbers, so will need to change the prompt.
    const prompt = `Given JSON data for the flight ${JSON.stringify(flight)}, the hotel ${JSON.stringify(hotel)}, the restaurant ${JSON.stringify(restaurant)}, and the tourist attraction ${JSON.stringify(poi)}, return the best itinerary in short human-readable sentence. No explanation.`;

    const promptV2 = `Please suggest an optimal itinerary for my trip in human-readable and intriguing sentences.
    Number of Meals per Day: 2
    Preferences:
    Flights: ${JSON.stringify(flight)}
    Hotels: ${JSON.stringify(hotel)}
    Restaurants: ${JSON.stringify(restaurant)}
    Tourist Attractions: ${JSON.stringify(poi)}
    Please format the response using line breaks or special characters to ensure better readability when displayed on the front-end UI.`

    try {
        const gptResponse = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'user',
                    content: promptV2
                }
            ]
        })
        return gptResponse.data.choices[0].message
    } catch (error) {
        throw new Error(`GPT-3 API error: ${error.message}`);
    }
}

async function fetchRestaurants({averageLat, averageLong, userPreference}) {
    try {
        // First fetch with user preference
        const response1 = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
            params: {
                keyword: userPreference.restaurant,
                location: `${averageLat}, ${averageLong}`,
                radius: 4000,
                maxprice: '',
                minprice: '',
                type: 'restaurant',
                key: `${googleAPI}`
            }
        })
        let firstResults = response1.data.results;

        // Second fetch for any cuisine
        const response2 = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
            params: {
                keyword: 'popular restaurants',
                location: `${averageLat}, ${averageLong}`,
                radius: 4000,
                type: 'restaurant',
                key: `${googleAPI}`
            }
        });
        let secondResults = response2.data.results;
        // Merge and remove duplicates, prioritizing user preference results
        let ids = new Set(firstResults.map(result => result.place_id));

        // Only add places from the secondResults that have a new place_id
        for (let place of secondResults) {
            if (!ids.has(place.place_id)) {
                firstResults.push(place);
                ids.add(place.place_id);
            }
        }

        // Filter out any restaurants that are not currently operational
        firstResults = firstResults.filter(restaurant => !restaurant.business_status || (restaurant.business_status !== 'CLOSED_TEMPORARILY' && restaurant.business_status !== 'CLOSED_PERMANENTLY'));


        // Make sure no more than 40 results are returned
        const finalResults = firstResults.slice(0, 20);

        // Error handling.
        if (!finalResults.length) {
            throw new Error('No restaurants found');
        }
        let restaurantRes = finalResults.map((res) => ({
            resName: res.name,
            resID: res.place_id,
            resRating: res.rating,
            // resTypes: res.types
        }))
        return restaurantRes
    } catch (error) {
        throw new Error(`search places API error: ${error.message}`);
    }
}

async function searchRestaurants() {
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
            params: {
                keyword: 'vietnamese or mexican',
                location: '43.472599613636696, -80.53789113576617',
                radius: 4000,
                maxprice: '',
                minprice: '',
                type: 'restaurant',
                key: `${googleAPI}`
            }
        })
        // Error handling.
        if (!response.data.results.length) {
            throw new Error('No hotels found');
        }
        let restaurantRes = response.data.results.map((res) => ({
            resName: res.name,
            resID: res.place_id,
            resRating: res.rating,
            resTypes: res.types
        }))
        console.log(restaurantRes)
        return restaurantRes
    } catch (error) {
        throw new Error(`search places API error: ${error.message}`);
    }
}

async function searchTouristAttraction({averageLat, averageLong, userPreference}) {
    try {
        const response1 = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
            params: {
                keyword: userPreference.poi,
                location: `${averageLat}, ${averageLong}`,
                radius: 5000,
                maxprice: '',
                minprice: '',
                type: 'tourist_attraction',
                key: `${googleAPI}`
            }
        })
        let firstResults = response1.data.results;

        // Second fetch for any cuisine
        const response2 = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
            params: {
                keyword: 'popular tourist attractions',
                location: `${averageLat}, ${averageLong}`,
                radius: 5000,
                type: 'tourist_attraction',
                key: `${googleAPI}`
            }
        });
        let secondResults = response2.data.results;
        // Merge and remove duplicates, prioritizing user preference results
        let ids = new Set(firstResults.map(result => result.place_id));

        // Only add places from the secondResults that have a new place_id
        for (let place of secondResults) {
            if (!ids.has(place.place_id)) {
                firstResults.push(place);
                ids.add(place.place_id);
            }
        }

        // Filter out any restaurants that are not currently operational
        firstResults = firstResults.filter(restaurant => !restaurant.business_status || (restaurant.business_status !== 'CLOSED_TEMPORARILY' && restaurant.business_status !== 'CLOSED_PERMANENTLY'));

        // Make sure no more than 20 results are returned
        const finalResults = firstResults.slice(0, 20);

        // Error handling.
        if (!finalResults.length) {
            throw new Error('No attractions found');
        }
        let touristAttractionRes = finalResults.map((data) => ({
            touristAttractionName: data.name,
            touristAttractionID: data.place_id,
            touristAttractionRating: data.rating,
            // touristAttractionTypes: data.types
        }))
        return touristAttractionRes
    } catch (error) {
        throw new Error(`search places API error: ${error.message}`);
    }
}

exports.generator = functions.https.onCall(async (data, context) => {
    try {
        /* First, get the JSON fields for the subsequent API calls. */

        const flightData = data.flightData;
        const hotelData = data.hotelData;
        const userPreference = data.userPreference;

        /* Second, make API calls.  */

        // !!! local test for now.
        const flightPromise = searchFlight(flightData)
        const hotelPromise =  searchHotels(hotelData)
        const [flightResponse, hotelResponse] = await Promise.all([flightPromise, hotelPromise]);
        const { averageLat, averageLong } = getAverageLatLong(hotelResponse);
        const restaurantResponse = await fetchRestaurants({averageLat, averageLong, userPreference})
        const poiResponse = await searchTouristAttraction({averageLat, averageLong, userPreference})

        // Data cleaning before passing into gpt.
        let flight = flightResponse.map(({ go_duration, leave_duration, ...rest }) => rest);
        let hotel = hotelResponse.map(({ offerId, hotelId, ...rest }) => rest);
        let restaurant = restaurantResponse.map(({ resID, resTypes, ...rest }) => rest);
        let poi = poiResponse.map(({ touristAttractionID, touristAttractionTypes, ...rest }) => rest);

        const gptResponse = await gpt({
            flight,
            hotel,
            restaurant,
            poi
        })
        const finalResult = gptResponse.content;
        return { finalResult: finalResult }
    } catch (error) {
        console.error(error);
        throw new functions.https.HttpsError('unknown', error.message);
    }
})

function getAverageLatLong(hotels) {
    let totalLat = 0;
    let totalLong = 0;

    for (let hotel of hotels) {
        totalLat += hotel.latitude;
        totalLong += hotel.longitude;
    }

    let averageLat = totalLat / hotels.length;
    let averageLong = totalLong / hotels.length;

    return { averageLat, averageLong };
}


