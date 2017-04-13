/*******************************
 Global Variables
 *******************************/
var self = this;
// Creates a global map marker
var map;

// Create a new blank array for all the listing markers.
var markers = [];

// Create placemarkers array to use in multiple functions to have control
// over the number of places that show.
var placeMarkers = [];

// Creates a Global variable for all of the locations
var location;

// Declaring Global clientID & Secret for Foursquare API
var clientID;
var clientSecret;

/*******************************
 Google Maps API
 *******************************/
var defaultLocations = [
    {
        name: 'Winnemac Park',
        location: {lat: 41.9741, lng: -87.6820}
    },
    {
        name: 'Over Easy Cafe',
        location: {lat: 41.9718, lng: -87.6790}
    },
    {
        name: 'Bang Bang Pie',
        location: {lat: 41.9720, lng: -87.6790}
    },
    {
        name: 'Roots Handmade Pizza',
        location: {lat: 41.9689, lng: -87.6842}
    },
    {
        name: 'Mariano\'s',
        location: {lat: 41.9693, lng: -87.6749}
    },
    {
        name: 'Wendys',
        location: {lat: 41.9685, lng: -87.6812}
    },
    {
        name: 'Aroy Thai',
        location: {lat: 41.9667, lng: -87.6793}
    }
];

/*******************************
 Foursquare API
 *******************************/

function model() {
    location = function (data) {
        var self = this;
        this.name = data.name;
        this.lat = data.lat;
        this.long = data.long;
        this.URL = "";
        this.street = "";
        this.city = "";
        this.phone = "";

        this.visible = ko.observable(true);

        var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll=' + this.lat + ',' + this.long + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20170413' + '&query=' + this.name;

        $.getJSON(foursquareURL).done(function (data) {
            var results = data.response.venues[0];
            self.URL = results.url;
            if (typeof self.URL === 'undefined') {
                self.URL = "";
            }
            self.street = results.location.formattedAddress[0];
            self.city = results.location.formattedAddress[1];
            self.phone = results.contact.phone;
            if (typeof self.phone === 'undefined') {
                self.phone = "";
            } else {
                self.phone = formatPhone(self.phone);
            }
        }).fail(function () {
            alert("There was an error with the Foursquare API call. Please refresh the page and try again to load Foursquare data.");
        });

        this.contentString = '<div class="info-window-content"><div class="title"><b>' + data.name + "</b></div>" +
            '<div class="content"><a href="' + self.URL + '">' + self.URL + "</a></div>" +
            '<div class="content">' + self.street + "</div>" +
            '<div class="content">' + self.city + "</div>" +
            '<div class="content">' + self.phone + "</div></div>";
    };
    initMap();
}

function initMap() {
    // Create a styles array to use with the map.
    var styles = [{
        "featureType": "landscape.man_made",
        "elementType": "geometry",
        "stylers": [{"color": "#f7f1df"}]
    }, {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [{"color": "#d0e3b4"}]
    }, {
        "featureType": "landscape.natural.terrain",
        "elementType": "geometry",
        "stylers": [{"visibility": "off"}]
    }, {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [{"visibility": "off"}]
    }, {
        "featureType": "poi.business",
        "elementType": "all",
        "stylers": [{"visibility": "off"}]
    }, {
        "featureType": "poi.medical",
        "elementType": "geometry",
        "stylers": [{"color": "#fbd3da"}]
    }, {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{"color": "#bde6ab"}]
    }, {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [{"visibility": "off"}]
    }, {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [{"visibility": "on"}]
    }, {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [{"color": "#ffe15f"}]
    }, {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{"color": "#efd151"}]
    }, {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [{"color": "#ffffff"}]
    }, {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [{"color": "black"}]
    }, {
        "featureType": "transit.station.airport",
        "elementType": "geometry.fill",
        "stylers": [{"color": "#cfb2db"}]
    }, {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{"color": "#a2daf2"}]
    }];

    // Error handling if map doesn't load.
    this.errorHandlingMap = setTimeout(function(){
        $('#map').html('We had trouble loading Google Maps. Please refresh your browser and try again.');
    });

    // Initializes a new infowindow to store information inside of it.
    var largeInfowindow = new google.maps.InfoWindow();

    // Initializes a rectangle from the points at its south-west and north-east corners.
    // Basically makes all the markers fit from the users point of view.
    var bounds = new google.maps.LatLngBounds();

    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 41.970329, lng: -87.678778},
        zoom: 13,
        styles: styles,
        mapTypeControl: false
    });

    // If map loads this will clear out the timeout error.
    clearTimeout(self.errorHandlingMap);

    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < defaultLocations.length; i++) {

        // Get the position from the location array.
        var position = defaultLocations[i].location;

        // Gets the name from the location array.
        var name = defaultLocations[i].name;

        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: name,
            animation: google.maps.Animation.DROP,
            id: i
        });

        // Push the marker to our array of markers.
        markers.push(marker);

        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
        });
        bounds.extend(markers[i].position);
    }

    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);
}



// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {

    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);

        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick',function(){
            infowindow.setMarker = null;
        });
    }
}

function startApp() {
    ko.applyBindings(new model());
}