// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");
// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

// Fetch the OpenAI key from the Firebase functions configuration
const { Configuration, OpenAIApi } = require("openai");

// Setup OpenAI API configuration with the fetched OpenAI key
const configuration = new Configuration({
    apiKey: process.env.Amadeus_apiKey,
});

// const placeAPIKey = '5ae2e3f221c38a28845f05b63e357b1b0a0ade8195a1ccd5ba27738b'

// const yelpAPIKey = '-IdRLtv_5oNUULaCzsJ9GwDQTyV2YKgwlWgZT6v5hbniOgh0l0hEbQUCkacFvfZ_R6HPYTDx_hhZU0ewgrCC0vkYhLmvQ6qNDKS1hGe6nvc93mnBwJ5g1WzoCPC3ZHYx'

const googleAPI = process.env.googleAPI

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
    hostname: process.env.Amadeus_HOSTNAME,
    clientId: process.env.Amadeus_clientId,
    clientSecret: process.env.Amadeus_clientSecret
});

/* Cloud functions start here... */
// deprecated
// exports.searchFlight = functions.https.onRequest(async (req, res) => {
//     // ! Crucial, must use the cors wrapper.
//     cors(req, res, () => {
//         const TOKEN = 'duffel_test_jmmpvZzOOkD-qvaahFZGjjqtGXFcT8jipwFdcx-bIBH';
//         var searchID = ''

//         const data = req.body

//         const headers = {
//             'Accept-Encoding': 'gzip',
//             'Accept': 'application/json',
//             'Content-Type': 'application/json',
//             'Duffel-Version': 'v1',
//             'Authorization': `Bearer ${TOKEN}`
//         }

//         // First, find all flights satisfying user inputs.
//         axios.post(
//             'https://api.duffel.com/air/offer_requests?return_offers=false&supplier_timeout=10000', data, { headers })
//             .then((res) => {
//                 // Record the search id.
//                 // ! Notice the first `data` is mandatory from Axios.
//                 searchID = res.data.data.id;
//                 // Then, get those found flights.
//                 return axios.get('https://api.duffel.com/air/offers', {
//                     params: {
//                         // Use the recorded search id to fetch the entire list of eligible flights.
//                         offer_request_id: searchID,
//                         limit: 10,
//                         sort: "total_amount",
//                         max_connections: 0
//                     },
//                     headers
//                 }
//                 )
//             }).then((response) => {
//                 // ! Crucial, must set this.
//                 res.set('Access-Control-Allow-Origin', '*');
//                 res.send(response.data)
//             })
//             .catch((error) => {

//             });
//     })
// });

// exports.searchFlightV2 = functions.https.onRequest(async (req, res) => {
//     cors(req, res, async () => {
//         await amadeus.shopping.flightOffersSearch.get({
//             // TODO - Get request from front-end.
//             originLocationCode: 'YYZ',
//             destinationLocationCode: 'JFK',
//             departureDate: '2023-07-20',
//             returnDate: '2023-07-24',
//             adults: '1',
//             children: '1',
//             travelClass: 'ECONOMY',
//             max: '10',
//             nonStop: 'true'
//         }).then((response) => {
//             let flightRes = response.data.map(item => ({
//                 carrier: item.validatingAirlineCodes[0],
//                 currency: item.price.currency,
//                 price: item.price.grandTotal,
//                 go_duration: item.itineraries[0].duration,
//                 go_departure: item.itineraries[0].segments[0].departure.iataCode,
//                 go_departure_time: item.itineraries[0].segments[0].departure.at,
//                 go_terminal: item.itineraries[0].segments[0].departure.terminal,
//                 go_arrival: item.itineraries[0].segments[0].arrival.iataCode,
//                 go_arrival_time: item.itineraries[0].segments[0].arrival.at,
//                 leave_duration: item.itineraries[1].duration,
//                 leave_departure: item.itineraries[1].segments[0].departure.iataCode,
//                 leave_departure_time: item.itineraries[1].segments[0].departure.at,
//                 leave_terminal: item.itineraries[1].segments[0].departure.terminal,
//                 leave_arrival: item.itineraries[1].segments[0].arrival.iataCode,
//                 leave_arrival_time: item.itineraries[1].segments[0].arrival.at
//             }))
//             res.set('Access-Control-Allow-Origin', '*');
//             res.send(flightRes)
//         }).catch((error) => {
//             res.set('Access-Control-Allow-Origin', '*');
//             res.send(error)
//         });
//     })
// })

// exports.searchHotels = functions.https.onRequest(async (req, res) => {
//     cors(req, res, async () => {
//         await amadeus.referenceData.locations.hotels.byCity.get({
//             cityCode: 'JFK',
//             ratings: "4",
//             radius: "30"
//         }).then(async (response) => {
//             // Limit hotel count to 10.
//             var limitedHotels = response.data.slice(0, 10);

//             let hotelInfo = limitedHotels.map((hotel) => ({
//                 hotelName: hotel.name,
//                 hotelId: hotel.hotelId
//             }))

//             let hotelIds = hotelInfo.map((hotel) => hotel.hotelId);

//             return await amadeus.shopping.hotelOffersSearch.get({
//                 hotelIds: JSON.stringify(hotelIds),
//                 adults: '1',
//                 checkInDate: '2023-07-20',
//                 checkOutDate: '2023-07-24',
//                 roomQuantity: '1',
//             })
//         }).then((response) => {
//             let hotelRes = response.data.map((hotel) => ({
//                 hotelId: hotel.hotel.hotelId,
//                 hotelName: hotel.hotel.name,
//                 offerId: hotel.offers[0].id,
//                 offerPrice: hotel.offers[0].price.total,
//                 offerCurrency: hotel.offers[0].price.currency
//             }))
//             res.set('Access-Control-Allow-Origin', '*');
//             res.send(hotelRes)
//         }).catch((error) => {
//             res.set('Access-Control-Allow-Origin', '*');
//             res.send(error)
//         });
//     })
// })

// exports.getOptimalFlight = functions.https.onCall(async (data, context) => {
//     const flightData = data.flightData;
//     const budget = data.budget;

//     // !!!! budget is an array of 2 numbers, so will need to change the prompt.
//     const prompt = `Given the flight data ${JSON.stringify(flightData)} and a budget of ${budget}, return the optimal flight in human-readable sentence. No explanation.`;

//     try {
//         const gptResponse = await openai.createChatCompletion({
//             model: 'gpt-3.5-turbo',
//             messages: [
//                 {
//                     role: 'user',
//                     content: prompt
//                 }
//             ]
//         })
//         return { gptResponse: gptResponse.data.choices[0].message }
//     } catch (error) {
//         return { error: 'An error occurred while processing your request.' };
//     }
// });

async function searchHotels(data) {
    try {
        const response1 = await amadeus.referenceData.locations.hotels.byCity.get({
            cityCode: data.destination,
            ratings: data.rating,
            radius: "30"
        })
        // Error handling.
        if (!response1.data.length) {
            throw new Error('No hotels found for the selected criteria.');
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
            adults: data.adults,
            // TODO -> change check in / out date.
            checkInDate: data.startDate,
            checkOutDate: data.endDate,
            roomQuantity: data.rooms,
        })
        // Error handling.
        if (!response2.data.length) {
            throw new Error('No hotel offerings found for the selected criteria.');
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
        throw new Error('No hotel offerings found for the selected criteria.');
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
            throw new Error('No flights found for the selected criteria.');
        }
        let flightRes = response.data.map(item => ({
            departureFlightCode: item.validatingAirlineCodes[0] + item.itineraries[0].segments[0].number,
            returnFlightCode: item.validatingAirlineCodes[0] + item.itineraries[1].segments[0].number,
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
        throw new Error("No flights found for the selected criteria.");
    }
}

async function gpt({ flight, hotel, restaurant, poi, start, end, foodPref, poiPref }) {

    const promptV3 = `Please suggest the best itinerary for my trip, formatted in a day-by-day manner (Day 1, Day 2, etc.). The itinerary should be in human-readable, intriguing and explanatory sentences, and should not include any assumptions not specified in the data provided.

    The itinerary must include:
    - Clearly mention start date ${start} and end date ${end} of this itinerary.
    - One hotel check-in on ${start} and check-out on ${end}.
    - Return flight must be on ${end}.
    - Clear explanations of the two flights to take with departure times and flight codes.
    - Brief, interesting highlights of each suggested tourist attraction to give a clear sense of what to expect.
    - Recommendations for two meals per day, with no meal in the morning.
    - A balance of restaurant and tourist attraction recommendations, with half based on user preferences of ${foodPref} food and ${poiPref} tourist attraction, and the other half not based on these preferences to ensure diversity.

    !! Do not include any notes, disclaimers, or additional information at the end of the itinerary.

    Details:
    - Flights: ${JSON.stringify(flight)}
    - Hotels: ${JSON.stringify(hotel)}
    - Restaurants: ${JSON.stringify(restaurant)}
    - Tourist Attractions: ${JSON.stringify(poi)}

    The response should be formatted using line breaks or special characters for better readability when displayed on the front-end UI.
    After that, the final response must be in JSON format. This JSON response must follow the below format:
    response = [
        title: // The title of this itinerary. This must be an individual key-value pair not inside the following key-value pairs.
        {
            day: // The day number and its corresponding date.
            activities: [
            ] // A list of all activities happening in this day. Notice the activities are separated based on the line breaks.
        },
        {
        } // Same as above for the next day.
        ending: // The ending sentence summarizing this itinerary. This must be an individual key-value pair not inside the above key-value pairs.
    ]`;


    try {
        const gptResponse = await openai.createChatCompletion({
            model: 'gpt-4-turbo-preview',
            messages: [
                {
                    role: 'user',
                    content: promptV3
                }
            ],
            temperature: 0.1
        })
        return gptResponse.data.choices[0].message
    } catch (error) {
        throw new Error('We encountered a problem while recommending the itinerary. Please try again.');
    }
}

async function fetchRestaurants({ averageLat, averageLong, userPreference }) {
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
        let firstResults = response1.data.results.slice(0, 10);

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
            if (!ids.has(place.place_id) && firstResults.length < 20) {
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
            throw new Error('No restaurants found for the selected criteria.');
        }
        let restaurantRes = finalResults.map((res) => ({
            resName: res.name,
            resID: res.place_id,
            resRating: res.rating,
            // resTypes: res.types
        }))
        return restaurantRes
    } catch (error) {
        throw new Error('No restaurants found for the selected criteria.');
    }
}

async function searchTouristAttraction({ averageLat, averageLong, userPreference }) {
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
        let firstResults = response1.data.results.slice(0, 10);

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
            if (!ids.has(place.place_id) && firstResults.length < 20) {
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
            throw new Error('No attractions found for the selected criteria.');
        }
        let touristAttractionRes = finalResults.map((data) => ({
            touristAttractionName: data.name,
            touristAttractionID: data.place_id,
            touristAttractionRating: data.rating,
            // touristAttractionTypes: data.types
        }))
        return touristAttractionRes
    } catch (error) {
        throw new Error('No tourist attractions found for the selected criteria.');
    }
}

exports.generator = functions.https.onCall(async (data, context) => {
    try {
        /* First, get the JSON fields for the subsequent API calls. */

        const flightData = data.flightData;
        const hotelData = data.hotelData;
        const userPreference = data.userPreference;
        const start = flightData.startDate;
        const end = flightData.endDate;
        const foodPref = userPreference.restaurant;
        const poiPref = userPreference.poi;

        /* Second, make API calls.  */

        // !!! local test for now.
        const flightPromise = searchFlight(flightData)
        const hotelPromise = searchHotels(hotelData)
        const [flightResponse, hotelResponse] = await Promise.all([flightPromise, hotelPromise]);
        const { averageLat, averageLong } = getAverageLatLong(hotelResponse);
        const restaurantResponse = await fetchRestaurants({ averageLat, averageLong, userPreference })
        const poiResponse = await searchTouristAttraction({ averageLat, averageLong, userPreference })

        // Data cleaning before passing into gpt.
        let flight = flightResponse.map(({ go_duration, leave_duration, ...rest }) => rest);
        let hotel = hotelResponse.map(({ offerId, hotelId, ...rest }) => rest);
        let restaurant = restaurantResponse.map(({ resID, resTypes, ...rest }) => rest);
        let poi = poiResponse.map(({ touristAttractionID, touristAttractionTypes, ...rest }) => rest);

        const gptResponse = await gpt({
            flight,
            hotel,
            restaurant,
            poi,
            start,
            end,
            foodPref,
            poiPref
        })
        const finalResult = gptResponse.content;
        return { finalResult: finalResult }
    } catch (error) {
        console.error(error);
        throw new functions.https.HttpsError('internal', error.message);
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

