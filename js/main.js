//GOAL: Proportional symbols representing attribute values of mapped features
//STEPS:
//Step 1. Create the Leaflet map--already done in createMap()
//Step 2. Import GeoJSON data--already done in getData()
//Step 3. Add circle markers for point features to the map--already done in AJAX callback
//Step 4. Determine the attribute for scaling the proportional symbols
//Step 5. For each feature, determine its value for the selected attribute
//Step 6. Give each feature's circle marker a radius based on its attribute value

//Step 1. Create the Leaflet map--already done in createMap()
// Function to instantiate the Leaflet map
function createMap(){
    // Create the map
    var map = L.map('map', {
      center: [0, 0],
      zoom: 2
    });

// Add a tile layer to the map using OpenStreetMap tiles
// Tile layers are used to load and display tile images on the map
// '{s}', '{z}', '{x}', and '{y}' in the URL are placeholders for the subdomain, zoom level, and tile coordinates
var tileLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
});
// Add the tile layer to the map
tileLayer.addTo(map);

// Call getData function
getData(map);
};

//Step 2. Import GeoJSON data--already done in getData()
// Function to retrieve and process GeoJSON data
function getData(map){
  fetch("data/MegaCities.geojson")
    .then(function(response){
      return response.json();
    })
    .then(function(json){
    // Calculate minimum data value   
   
    var minValue = Math.min(...json.features.map(f => f.properties["Pop_2015"]));
  
    // Call function to create proportional symbols
    createPropSymbols(json, map, minValue);
  });
};

//Step 2 below this is step 4. Determine the attribute for scaling the proportional symbols
// Function to calculate radius based on attribute value
function calcPropRadius(attValue, minValue) {
    // Constant factor adjusts symbol sizes evenly
    var minRadius = 5;
    // Flannery Apperance Compensation formula (adjust as needed)
    var radius = 1.0083 * Math.pow(attValue/minValue,0.5715) * minRadius;
    return radius;
  };


 //function to convert markers to circle markers with popups
function pointToLayer(feature, latlng){
  //Determine which attribute to visualize with proportional symbols
  var attribute = "Pop_2015";
  
    // Marker options
  var options = {
      fillColor: "#ff7800",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
  };

    
 //For each feature, determine its value for the selected attribute
  var attValue = Number(feature.properties[attribute]);

 //Give each feature's circle marker a radius based on its attribute value
  options.radius = calcPropRadius(attValue);

 //create circle marker layer
  var layer = L.circleMarker(latlng, options);

 //build popup content string
  var popupContent = "<p><b>City:</b> " + feature.properties.City + "</p>";
  var year = attribute.split("_")[1];
  popupContent += "<p><b>Population in " + year + ":</b> " + feature.properties[attribute] + " million</p>";

  layer.bindPopup(popupContent);

  return layer;
};

//Add circle markers for point features to the map
function createPropSymbols(data, map){
 //create a Leaflet GeoJSON layer and add it to the map
 L.geoJson(data, {
     pointToLayer: pointToLayer
 }).addTo(map);
};

document.addEventListener('DOMContentLoaded',createMap);
