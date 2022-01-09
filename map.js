
let map;
const btn=document.getElementById('btn');


function initMap() {
  const myLatLng = new google.maps.LatLng( 24.774265, 46.738586);

  map = new google.maps.Map(document.getElementById("googleMap"), {
    center: myLatLng,
    zoom: 7,
  });

//create autocomplete objects for all inputs
var options = {
  componentRestrictions: { country: "sa" },
  
  types: ["establishment"],
}

var input1 = document.getElementById("from");
var input2 = document.getElementById("to");


var autocomplete1 = new google.maps.places.Autocomplete(input1, options);
var autocomplete2 = new google.maps.places.Autocomplete(input2, options);


const directionsService = new google.maps.DirectionsService();
const directionsDisplay = new google.maps.DirectionsRenderer();
  

  directionsDisplay.setMap(map);
  btn.addEventListener("click", function () {
    calcRoute(directionsService,directionsDisplay)
  })
}
function calcRoute(directionsService,directionsDisplay) {


  const myLatLng = new google.maps.LatLng( 	24.774265, -46.738586);
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
          output.innerHTML = "<div class='alert-info'>From: " + document.getElementById("from").value + ".<br />To: " + document.getElementById("to").value + ".<br /> Driving distance <i class='fas fa-road'></i> : " + result.routes[0].legs[0].distance.text + ".<br />Duration <i class='fas fa-hourglass-start'></i> : " + result.routes[0].legs[0].duration.text + ".</div>";

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


