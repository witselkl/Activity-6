//Leaflet quickstart
/* Example from Leaflet Quick Start Guide*/

//L.map
//set view sets the view of the map's geographic center
var mymap = L.map('map').setView([51.505, -0.09], 13);

//add tile layer...replace project id and accessToken with your own
// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
//     maxZoom: 18,
//     id: 'your.mapbox.project.id',
//     accessToken: 'your.mapbox.public.access.token'
// }).addTo(mymap);

//Example 1.1 line 5...add tile layer. Used to load and display tile layers on the map. Most require attribution, which is set under Layer.
var tileLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
});

tileLayer.addTo(mymap);

// Not a method but a function... L.Marker is used to display clickable/draggable icons on the map
var marker = L.marker([51.5, -0.09]).addTo(mymap);

// a class.. A class for drawing circle overlays on a map
var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(mymap);

//A class for drawing polygon overlays on a map. 
var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(mymap);

marker.bindPopup("<strong>Hello world!</strong><br />I am a popup.").openPopup();
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");


//Used to open popups in certain places of the map
var popup = L.popup()
    .setLatLng([51.5, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(mymap);

var popup = L.popup();

//event listeners when clicking on the map
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}

mymap.on('click', onMapClick);