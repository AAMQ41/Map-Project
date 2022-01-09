
let map;
const btn = document.getElementById('btn');
let latitude = 0
let longitude = 0
let infoWindow, markers;
let geocoder;

function initMap() {
  //const myLatLng = new google.maps.LatLng( 24.774265, 46.738586);

  map = new google.maps.Map(document.getElementById("googleMap"), {
    //center: myLatLng,
    zoom: 7,
  });

  //create autocomplete objects for all inputs
  let options = {
    componentRestrictions: { country: "sa" },
    types: ["establishment"],
  }
  // get and store the element 'from' and 'to' into input1 input2 var
  let input1 = document.getElementById("from");
  let input2 = document.getElementById("to");

  let autocomplete1 = new google.maps.places.Autocomplete(input1, options);
  let autocomplete2 = new google.maps.places.Autocomplete(input2, options);


   geocoder= new google.maps.Geocoder();

  //get the current location and display it to the map and get the lat and lng and convert into an address then store into input1
  infoWindow = new google.maps.InfoWindow();
  map.controls[google.maps.ControlPosition.TOP_CENTER];
  window.addEventListener("load", function getLocation() {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          getCordinationsToAddress(pos.lat, pos.lng, geocoder, input1)

          markers = new google.maps.Marker({
            position: pos,
            // content:'YOU ARE HERE',
            title: 'my location',
            map: map
          });
          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");
          infoWindow.open(map, markers);
          map.setCenter(pos);


        },

      );


    }
  });

  // display the rote
  const directionsService = new google.maps.DirectionsService();
  const directionsDisplay = new google.maps.DirectionsRenderer();


  directionsDisplay.setMap(map);


  btn.addEventListener("click", function () {
    calcRoute(directionsService, directionsDisplay)

  })
}
function calcRoute(directionsService, directionsDisplay) {


  const myLatLng = new google.maps.LatLng(24.774265, -46.738586);
  //create request
  let request = {
    origin: document.getElementById("from").value,
    destination: document.getElementById("to").value,
    travelMode: google.maps.TravelMode.DRIVING, //WALKING, BYCYCLING, TRANSIT
    unitSystem: google.maps.UnitSystem.IMPERIAL
  }

  //pass the request to the route method
  directionsService.route(request, function (result, status) {
    if (status == google.maps.DirectionsStatus.OK) {

      //Get distance and time
      const output = document.querySelector('#output');
      output.innerHTML = "<div class='alert-info'>From: "
        + document.getElementById("from").value + ".<br />To: "
        + document.getElementById("to").value + ".<br /> Driving distance <i class='fas fa-road'></i> : "
        + result.routes[0].legs[0].distance.text + ".<br />Duration <i class='fas fa-hourglass-start'></i> : "
        + result.routes[0].legs[0].duration.text + ".</div>";

      //display route
      directionsDisplay.setDirections(result);
    } else {
      //delete route from map
      directionsDisplay.setDirections({ routes: [] });
      //center map in London
      map.setCenter(myLatLng);

      //show error message
      output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance.</div>";
    }
  });

}


function getCordinationsToAddress(lat, lng, geocoder, input1) {

  let latlng = new google.maps.LatLng(lat, lng);

  geocoder.geocode({
    'latLng': latlng
  }, function (results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        console.log(results[1].formatted_address);
        //store the address into the input1 field
        input1.value = results[1].formatted_address
      } else {
        alert('No results found');
      }
    } else {
      alert('Geocoder failed due to: ' + status);
    }
  });
}