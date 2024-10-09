// Leaflet quickstart
/* Example from Leaflet Quick Start Guide */

// Initialize the map with 'L.map' and set the view of the map at a geographic center (latitude: 51.505, longitude: -0.09)
// The 'setView' method also sets the zoom level to 13
var mymap = L.map('map').setView([39.75621, -104.99404], 13);

// Add a tile layer to the map using OpenStreetMap tiles
// Tile layers are used to load and display tile images on the map
// '{s}', '{z}', '{x}', and '{y}' in the URL are placeholders for the subdomain, zoom level, and tile coordinates
var tileLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
});
// Add the tile layer to the map
tileLayer.addTo(mymap);

// Add a marker to the map at the specified coordinates (latitude: 51.5, longitude: -0.09)
var marker = L.marker([39.75621, -104.99404]).addTo(mymap);

// Add a circle overlay to the map at the specified coordinates (latitude: 51.508, longitude: -0.11)
// The 'color' sets the outline color, 'fillColor' sets the inside color, 'fillOpacity' controls the transparency of the fill, and 'radius' sets the circle's radius
var circle = L.circle([39.750588, -104.971646], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(mymap);

// Add a polygon to the map with three coordinates (forming a triangle)
// The polygon is created by connecting the points in the array
var polygon = L.polygon([
    [39.764, -104.968891],
    [39.767, -104.9670],
    [39.763, -104.965]
]).addTo(mymap);

// Bind a popup to the marker with the specified content
// The popup will open automatically when the map is loaded
marker.bindPopup("<strong>Hello world!</strong><br />I am a popup.").openPopup();

// Bind popups to the circle and polygon with custom text
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");

// Create a standalone popup and set its position using 'setLatLng' at the specified coordinates
// 'setContent' defines the content of the popup, and 'openOn' attaches it to the map
var popup = L.popup()
    .setLatLng([39.76583, -105.0128])
    .setContent("I am a standalone popup.")
    .openOn(mymap);

// Event listener for clicks on the map
// When the map is clicked, a popup appears showing the latitude and longitude of the click
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)  // Sets the popup's position to the clicked location
        .setContent("You clicked the map at " + e.latlng.toString())  // Sets the content to display the clicked coordinates
        .openOn(mymap);  // Opens the popup on the map
}

// Add the event listener to the map for 'click' events and link it to the 'onMapClick' function
mymap.on('click', onMapClick);

// Fetch and load GeoJSON data from the file 'MegaCities.geojson'
fetch("data/MegaCities.geojson")
    .then(function(response){
        return response.json();  // Convert the response to JSON format
    })
    .then(function(json){
        // Define options for displaying GeoJSON point features as circle markers
        var geojsonMarkerOptions = {
            radius: 8,
            fillColor: "#ff7800",  // Set fill color of the marker
            color: "#000",         // Set border color of the marker
            weight: 1,             // Set the thickness of the marker border
            opacity: 1,            // Set the border opacity
            fillOpacity: 0.8       // Set the fill opacity
        };

        // Function to bind popups to each feature in the GeoJSON data
        function onEachFeature(feature, layer) {
            var popupContent = "";
            if (feature.properties) {
                // Loop through the properties of each feature and add them to the popup content
                for (var property in feature.properties){
                    popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
                }
                // Bind the popup content to the layer (feature on the map)
                layer.bindPopup(popupContent);
            }
        }

        // Add the GeoJSON data to the map using 'L.geoJson'
        L.geoJson(json, {
            pointToLayer: function (feature, latlng) {
                // For point features, create circle markers with the defined options
                return L.circleMarker(latlng, geojsonMarkerOptions);
            },
            // Bind popups to each feature
            onEachFeature: onEachFeature
        }).addTo(mymap);
    });
