var Amadeus = require('amadeus');

var amadeus = new Amadeus({
  clientId: 'DRDMkL6F0SpfltcQuiMtmENUcwRSYAEs',
  clientSecret: 'JkFycaDtmBTXohCO'
});

amadeus.referenceData.locations.hotel.get({
    keyword: 'PARI',
    subType: 'HOTEL_GDS'
}).then(function(response){
  console.log(response.data[0]);
  amadeus.shopping.hotelOffersSearch.get({
    hotelIds: 'RTPAR001',
    adults: '2'
}).then((response)=>{
    console.log(response)
    
    // amadeus.booking.hotelBookings.post(
    //     JSON.stringify({
    //       'offerId': 'RTPAR001',
    //       'guests': [ {
    //         "id": 1,
    //         "name": {
    //           "title": "MR",
    //           "firstName": "BOB",
    //           "lastName": "SMITH"
    //         },
    //         "contact": {
    //           "phone": "+33679278416",
    //           "email": "bob.smith@email.com"
    //         }
    //       }],
    //       'payments': [{
    //         "id": 1,
    //         "method": "creditCard",
    //         "card": {
    //           "vendorCode": "VI",
    //           "cardNumber": "4151289722471370",
    //           "expiryDate": "2023-08"
    //         }
    //       }]
    //       }
    //     )
    //   ).then((response)=>{
    //     console.log(response)
    //     }).catch(response=>{
    //         console.log(response);
    //     })

  }).catch((response)=>{
    console.log(response)
  })
  
}).catch(function(responseError){
  console.log(responseError.code);
});