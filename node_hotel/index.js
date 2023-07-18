var Amadeus = require('amadeus');

var amadeus = new Amadeus({
  clientId: 'DRDMkL6F0SpfltcQuiMtmENUcwRSYAEs',
  clientSecret: 'JkFycaDtmBTXohCO'
});

const hotelList = [];

function getHotelList() {
  return new Promise((resolve, reject) => {
    amadeus.referenceData.locations.hotel
      .get({ keyword: 'PAR', subType: 'HOTEL_GDS' })
      .then(function (response) {
       
        const data = response.data;
        data.forEach((item) => {
          hotelList.push(item.hotelIds[0]);
        });
        resolve(hotelList);
      })
      .catch(function (responseError) {
        reject(responseError.code);
      });
  });
}


function getOffer(hotelIdVal){
  return new Promise((resolve, reject)=>{
    amadeus.shopping.hotelOffersSearch.get({
      hotelIds: 'RTPAR001',
      adults: '1',
      'checkInDate': '2023-10-10',
      'checkOutDate': '2023-10-12'

  }).then(function (response) {
    console.log(response.data[0]);
  }).catch(function (response) {
    console.error(response);
  });
  })
}



getHotelList()
  .then((hotelList) => {
    // console.log(hotelList); // Handle the hotelList array
    console.log(hotelList[0]);
     
    amadeus.shopping.hotelOffersSearch.get({
      hotelIds: 'RTPAR001',
      adults: '2',
      'checkInDate': '2023-10-10',
      'checkOutDate': '2023-10-12'
    }).then(function (response) {
      console.log(response.data[0]);
    }).catch(function (response) {
      console.error(response);
    });
})
  .catch((error) => {
    console.log('Error:', error); // Handle the error
});



