//GOAL: Proportional symbols representing attribute values of mapped features
//STEPS:
//Step 1. Create the Leaflet map--already done in createMap()
//Step 2. Import GeoJSON data--already done in getData()
//Step 3. Add circle markers for point features to the map--already done in AJAX callback
//Step 4. Determine the attribute for scaling the proportional symbols
//Step 5. For each feature, determine its value for the selected attribute
//Step 6. Give each feature's circle marker a radius based on its attribute value

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

//Step 2. Import GeoJSON data--already done in getData() ?????????????????? Isn't step 1 come before step 2
// Load the data
fetch("data/MegaCities.geojson")
.then(function(response){
    return response.json();
})
.then(function(json){
    // Create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(json).addTo(mymap);
})

//Step 1. Create the Leaflet map--already done in createMap()
/* Map of GeoJSON data from MegaCities.geojson */
// Function to instantiate the Leaflet map
function createMap(){
    // The map is already created globally as mymap
}

///Step #????????????????????????????????????????????????????????????????
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

//Step 2. Import GeoJSON data--already done in getData()
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

/// IS this part necessary for activity 6 ?????????????????????????????????????????/
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

// IS this part a duplicate of onEachFeature ???????????????????????????????????????????????
L.geoJSON(geojsonFeature, {
    onEachFeature: onEachFeature
}).addTo(map);

// IS this part necessary for activity 6 ?????????????????????????????????????????/
var myLines = [{
    "type": "LineString",
    "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
}, {
    "type": "LineString",
    "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
}];

// IS this part necessary for activity 6 ?????????????????????????????????????????/
var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};

// IS this part necessary for activity 6 ?????????????????????????????????????????/
L.geoJSON(myLines, {
    style: myStyle
}).addTo(map);

// IS this part necessary for activity 6 ?????????????????????????????????????????/
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

// IS this part necessary for activity 6 ?????????????????????????????????????????/
L.geoJSON(states, {
style: function(feature) {
    switch (feature.properties.party) {
        case 'Republican': return {color: "#ff0000"};
        case 'Democrat':   return {color: "#0000ff"};
    }
   }
}).addTo(map);

//IS This a duplication of Step 1. Create the Leaflet map--already done in createMap() but with variables ?????????????????????/
//declare map variable globally so all functions have access
var map;
var minValue;

//step 1 create map
function createMap(){

    //create the map
    map = L.map('map', {
        center: [0, 0],
        zoom: 2
    });

    //add OSM base tilelayer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

    //call getData function
    getData(map);
};

// Step 1 continued as shown on activity 6
function calculateMinValue(data){
    //create empty array to store all data values
    var allValues = [];
    //loop through each city
    for(var city of data.features){
        //loop through each year
        for(var year = 1985; year <= 2015; year+=5){
              //get population for current year
              var value = city.properties["Pop_"+ String(year)];
              //add value to array
              allValues.push(value);
        }
    }
    //get minimum value of our array
    var minValue = Math.min(...allValues)

    return minValue;
}
// Step 1 continued as shown on activity 6
//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //constant factor adjusts symbol sizes evenly
    var minRadius = 5;
    //Flannery Apperance Compensation formula
    var radius = 1.0083 * Math.pow(attValue/minValue,0.5715) * minRadius

    return radius;
};

// What happended to Step 2????????????????????? as shown on activity 6
//Step 3: Add circle markers for point features to the map
function createPropSymbols(data){

    //Step 4: Determine which attribute to visualize with proportional symbols
    var attribute = "Pop_2015";

    //create marker options
    var geojsonMarkerOptions = {
        fillColor: "#ff7800",
        color: "#fff",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
        radius: 8
    };

    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            //Step 5: For each feature, determine its value for the selected attribute
            var attValue = Number(feature.properties[attribute]);

            //Step 6: Give each feature's circle marker a radius based on its attribute value
            geojsonMarkerOptions.radius = calcPropRadius(attValue);

            //create circle markers
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    }).addTo(map);
};

//Step 2: Import GeoJSON data
function getData(){
    //load the data
    fetch("data/MegaCities.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            //calculate minimum data value
            minValue = calculateMinValue(json);
            //call function to create proportional symbols
            createPropSymbols(json);
        })
};

document.addEventListener('DOMContentLoaded',createMap)


//Example 1.2 line 1...Step 3: Add circle markers for point features to the map
function createPropSymbols(data){

    //Step 4. Determine the attribute for scaling the proportional symbols
    var attribute = "Pop_2015";


//Example 1.3 line 1...Step 3: Add circle markers for point features to the map
function createPropSymbols(data){
    //Step 4: Determine which attribute to visualize with proportional symbols
    var attribute = "Pop_2015";



//Example 1.2 line 13...create a Leaflet GeoJSON layer and add it to the map
L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
            
    //Step 5: For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);

    //examine the attribute value to check that it is correct
    console.log(feature.properties, attValue);

    //create circle markers
    return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    }).addTo(map);
};    


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
