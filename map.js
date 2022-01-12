const btn = document.getElementById("btn");
let latitude = 0;
let longitude = 0;
let map, infoWindow, markers, autocomplete1, latlang, geocoder;
var coffee =
  "https://img.icons8.com/external-kmg-design-outline-color-kmg-design/32/000000/external-pin-coffee-shop-kmg-design-outline-color-kmg-design.png";

function initMap() {
  //const myLatLng = new google.maps.LatLng( 24.774265, 46.738586);

  map = new google.maps.Map(document.getElementById("googleMap"), {
    //center: myLatLng,
    zoom: 15,
  });

  //create autocomplete objects for all inputs
  let options = {
    componentRestrictions: { country: "sa" },
    types: ["establishment"],
  };
  // get and store the element 'from' and 'to' into input1 input2 var
  let input1 = document.getElementById("from");
  let input2 = document.getElementById("to");

  let autocomplete1 = new google.maps.places.Autocomplete(input1, options);
  let autocomplete2 = new google.maps.places.Autocomplete(input2, options);

  console.log(autocomplete1);
  //alert("This function is working!");
  //alert(place.name);
  // alert(place.address_components[0].long_name);

  geocoder = new google.maps.Geocoder();

  //get the current location and display it to the map and get the lat and lng and convert into an address then store into input1
  
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        getCordinationsToAddress(pos.lat, pos.lng, geocoder, input1);
      });
    }
 

  // display the rote
  const directionsService = new google.maps.DirectionsService();
  const directionsDisplay = new google.maps.DirectionsRenderer();

  directionsDisplay.setMap(map);
  //this.autocomplete1.addListener('places_changed', ((that) => () => this.placesChanged(that))(this));
  var spaceTypeID = document.getElementById('spaceTypeID').value;

  var space_value;
  if (document.getElementById('r1').checked) {
    space_value = document.getElementById('r1').value;
    console.log(space_value);
    

  }

  if (document.getElementById('r2').checked) {
    space_value = document.getElementById('r2').value;
    console.log(space_value);
    alert(space_value);

  }
  if (document.getElementById('r3').checked) {
    space_value = document.getElementById('r3').value;
    console.log(space_value);

  }

  

  btn.addEventListener("click", function () {
    calcRoute(directionsService, directionsDisplay);
console.log('Amal ');
console.log(space_value);

  });
}

function calcRoute(directionsService, directionsDisplay) {
  //var place = Autocomplete.getPlace();

  const myLatLng = new google.maps.LatLng(24.774265, -46.738586);
  //create request
  let request = {
    origin: document.getElementById("from").value,
    destination: document.getElementById("to").value,
    travelMode: google.maps.TravelMode.DRIVING, //WALKING, BYCYCLING, TRANSIT
    unitSystem: google.maps.UnitSystem.IMPERIAL,
  };

  //pass the request to the route method
  directionsService.route(request, function (result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      var bounds = new google.maps.LatLngBounds();

      //Get distance and time
      const output = document.querySelector("#output");
      output.innerHTML =
        "<div class='alert-info'>From: " +
        document.getElementById("from").value +
        ".<br />To: " +
        document.getElementById("to").value +
        ".<br /> Driving distance <i class='fas fa-road'></i> : " +
        result.routes[0].legs[0].distance.text +
        ".<br />Duration <i class='fas fa-hourglass-start'></i> : " +
        result.routes[0].legs[0].duration.text +
        ".</div>";

      console.log(result.routes);

      directionsDisplay.setDirections(result);

      bounds.union(result.routes[0].bounds);
      map.fitBounds(bounds);

      nearbyCafe();
    } else {
      //delete route from map
      directionsDisplay.setDirections({ routes: [] });
      //center map in London
      map.setCenter(myLatLng);

      //show error message
      output.innerHTML =
        "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance.</div>";
    }
  });
}

function nearbyCafe() {
  var request2 = {
    location: map.getCenter(),
    radius: 8047,
    types: ["cafe"],
  };
  var service = new google.maps.places.PlacesService(map);

  service.nearbySearch(request2, callback);
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  let infowindow = new google.maps.InfoWindow();

  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    title: place.name,
    icon: coffee,
  });
  marker.addListener("click", () => {
    infowindow.setContent(
      '<h5 class="info"> Cafe: ' +
        place.name +
        '</h5> <h6 class="info"> rating: ' +
        place.rating +
        "</h6>"
    );
    infowindow.open({
      anchor: marker,
      map,
      shouldFocus: false,
    });
  });
}

function getCordinationsToAddress(lat, lng, geocoder, input1) {
  let latlng = new google.maps.LatLng(lat, lng);

  geocoder.geocode(
    {
      latLng: latlng,
    },
    function (results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          console.log(results[1].formatted_address);
          //store the address into the input1 field
          input1.value = results[1].formatted_address;
        } else {
          alert("No results found");
        }
      } else {
        alert("Geocoder failed due to: " + status);
      }
    }
  );
}
// for the coffee banner
function myFunction() {
  var elmnt = document.getElementById("Map-Section");
  elmnt.scrollIntoView();
}
