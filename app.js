/*******************************
 Other
 *******************************/
var self = this;
// Creates a global map marker
var map;
// Create a new blank array for all the listing markers.
var markers = [];
// Create placemarkers array to use in multiple functions to have control
// over the number of places that show.
var placeMarkers = [];

/*******************************
 Google Maps API
 *******************************/
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
        "stylers": [{"visibility": "off"}]
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
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 41.970329, lng: -87.678778},
        zoom: 13,
        styles: styles,
        mapTypeControl: false
    });
}
/*******************************
 Yelp API
 *******************************/