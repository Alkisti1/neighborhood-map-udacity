/*******************************
 Global Variables & Default Locations
 *******************************/

// Creates a global map marker
var map;

// Creates a Global variable for all of the locations
var Location;

// Declaring Global clientID & secret for Foursquare API
var clientID;
var clientSecret;

// Default Locations that are displayed on the map
var defaultLocations = [
    {
        name: 'Winnemac Park',
        lat: 41.9741, long: -87.6820
    },
    {
        name: 'Over Easy Cafe',
        lat: 41.9718, long: -87.6790
    },
    {
        name: 'Bang Bang Pie',
        lat: 41.9720, long: -87.6790
    },
    {
        name: 'Roots Handmade Pizza',
        lat: 41.9689, long: -87.6842
    },
    {
        name: 'Mariano\'s',
        lat: 41.9693, long: -87.6749
    },
    {
        name: 'Wendys',
        lat: 41.9685, long: -87.6812
    },
    {
        name: 'Aroy Thai',
        lat: 41.9667, long: -87.6793
    }
];

/*******************************
 Foursquare API
 *******************************/
Location = function(data) {
    var self = this;
    this.name = data.name;
    this.lat = data.lat;
    this.long = data.long;
    this.URL = "";
    this.street = "";
    this.city = "";
    this.phone = "";

    // By default every marker will be visible
    this.visible = ko.observable(true);

    // Foursquare API credentials.
    clientID = "YA5YCGZRA414QRZ2HR4GG24H5Y45LNSLO02Z1C3BJ3N4CCWH";
    clientSecret = "X50UXR4JITKLCC5VBEERFFT5LMGTTHIROU1ZDEZBFWMJEITO";

    // Foursquare API Link to call.
    var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll=' + this.lat + ',' + this.long + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20170413' + '&query=' + this.name;

    // Gets the data from foursquare and store it into it's own variables.
    $.getJSON(foursquareURL).done(function (data) {
        var results = data.response.venues[0];
        self.URL = results.url;
        if (typeof self.URL === 'undefined') {
            self.URL = "";
        }
        self.street = results.location.formattedAddress[0];
        self.city = results.location.formattedAddress[1];
        self.phone = results.contact.phone;
    }).fail(function () {
        $('.list').html('There was an error with the Foursquare API call. Please refresh the page and try again to load Foursquare data.');
    });

    // This is what the infowindow will contain when clicked.
    this.contentString = '<div class="info-window-content"><div class="title"><b>' + data.name + "</b></div>" +
        '<div class="content"><a href="' + self.URL + '">' + self.URL + "</a></div>" +
        '<div class="content">' + self.street + "</div>" +
        '<div class="content">' + self.city + "</div>" +
        '<div class="content">' + self.phone + "</div></div>";

    // Puts the content string inside infowindow.
    this.infoWindow = new google.maps.InfoWindow({content: self.contentString});

    // Places the marker to it's designed location on the map along with it's title.
    this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.lat, data.long),
        map: map,
        title: data.name
    });

    // Only makes the one selected marker visible.
    this.showMarker = ko.computed(function() {
        if(this.visible() === true) {
            this.marker.setMap(map);
        } else {
            this.marker.setMap(null);
        }
        return true;
    }, this);

    // When marker is clicked on open up infowindow designated to the marker with it's information.
    this.marker.addListener('click', function(){
        self.contentString = '<div class="info-window-content"><div class="title"><b>' + data.name + "</b></div>" +
            '<div class="content"><a href="' + self.URL +'">' + self.URL + "</a></div>" +
            '<div class="content">' + self.street + "</div>" +
            '<div class="content">' + self.city + "</div>" +
            '<div class="content"><a href="tel:' + self.phone +'">' + self.phone +"</a></div></div>";

        self.infoWindow.setContent(self.contentString);

        self.infoWindow.open(map, this);

        self.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            self.marker.setAnimation(null);
        }, 2100);
    });

    // Makes the marker bounce animation whenever clicked.
    this.bounce = function(place) {
        google.maps.event.trigger(self.marker, 'click');
    };
};

/*******************************
 Google Maps API
 *******************************/
function viewModel(){

    var self = this;

    // Search term is blank by default
    this.searchTerm = ko.observable("");

    // Initializes a blank array for locations
    this.locationList = ko.observableArray([]);

    // Error handling if map doesn't load.
    this.errorHandlingMap = setTimeout(function(){
        $('#map').html('We had trouble loading Google Maps. Please refresh your browser and try again.');
    }, 8000);

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

    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 41.970329, lng: -87.678778},
        zoom: 16,
        styles: styles,
        mapTypeControl: false
    });

    // If map loads this will clear out the timeout error.
    clearTimeout(self.errorHandlingMap);

    // Centers map when compass is clicked on.
    this.centerMap = function(){
        map.setCenter({lat: 41.970329, lng: -87.678778});
    };

    // Pushes default locations array into new location list array
    defaultLocations.forEach(function(locationItem){
        self.locationList.push( new Location(locationItem));
    });

    // Searches for what user typed in the input bar to the locationlist array.
    // Only displaying the exact item results that user type if available in the locationlist array.
    this.filteredList = ko.computed( function() {
        var filter = self.searchTerm().toLowerCase();
        if (!filter) {
            self.locationList().forEach(function(locationItem){
                locationItem.visible(true);
            });
            return self.locationList();
        } else {
            return ko.utils.arrayFilter(self.locationList(), function(locationItem) {
                var string = locationItem.name.toLowerCase();
                var result = (string.search(filter) >= 0);
                locationItem.visible(result);
                return result;
            });
        }
    }, self);
}

function startApp() {
    ko.applyBindings(new viewModel());
}