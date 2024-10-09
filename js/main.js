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

var marker = L.marker([39.75621, -104.99404]).addTo(mymap);

// Load the data
fetch("data/MegaCities.geojson")
.then(function(response){
    return response.json();
})
.then(function(json){
    // Create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(json).addTo(mymap);
})

/* Map of GeoJSON data from MegaCities.geojson */
// Function to instantiate the Leaflet map
function createMap(){
    // The map is already created globally as mymap
}

function onEachFeature(feature, layer) {
    //no property named popupContent; instead, create html string with all properties
    var popupContent = "";
    if (feature.properties) {
        //loop to add feature property names and values to html string
        for (var property in feature.properties){
            popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
        }
        layer.bindPopup(popupContent);
    };
};

//function to retrieve the data and place it on the map
function getData(){
    //load the data
    fetch("data/MegaCities.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(json).addTo(map);
        })
};

document.addEventListener('DOMContentLoaded',createMap)


var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
};

L.geoJSON(geojsonFeature, {
    onEachFeature: onEachFeature
}).addTo(map);

var myLines = [{
    "type": "LineString",
    "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
}, {
    "type": "LineString",
    "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
}];

var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};

L.geoJSON(myLines, {
    style: myStyle
}).addTo(map);

var states = [{
    "type": "Feature",
    "properties": {"party": "Republican"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-104.05, 48.99],
            [-97.22,  48.98],
            [-96.58,  45.94],
            [-104.03, 45.94],
            [-104.05, 48.99]
        ]]
    }
}, {
    "type": "Feature",
    "properties": {"party": "Democrat"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-109.05, 41.00],
            [-102.06, 40.99],
            [-102.03, 36.99],
            [-109.04, 36.99],
            [-109.05, 41.00]
        ]]
    }
}];

L.geoJSON(states, {
style: function(feature) {
    switch (feature.properties.party) {
        case 'Republican': return {color: "#ff0000"};
        case 'Democrat':   return {color: "#0000ff"};
    }
   }
}).addTo(map);

//.then(function(json){
var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
    };


L.geoJson(json, {
    pointToLayer: function (feature, latlng){
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
}).addTo(map);


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
