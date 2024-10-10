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
  //step continues..
  // Function to create proportional symbols
  function createPropSymbols(data, map, minValue){
    // Attribute to visualize with proportional symbols
    //Step 4: Determine which attribute to visualize with proportional symbols
    var attribute = "Pop_2015";
  
    // Marker options
    var geojsonMarkerOptions = {
      fillColor: "#ff7800",
      color: "#fff",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
  
//Step 3. Add circle markers for point features to the map--already done in AJAX callback    
    // Add GeoJSON data with circle markers
    L.geoJson(data, {
      pointToLayer: function (feature, latlng) {
        // Get attribute value
        var attValue = Number(feature.properties[attribute]);
  
        // Calculate radius based on attribute value
        geojsonMarkerOptions.radius = calcPropRadius(attValue, minValue);
  
        // Create circle marker
        return L.circleMarker(latlng, geojsonMarkerOptions);
      }
    }).addTo(map);
  };
  
  document.addEventListener('DOMContentLoaded',createMap);





  

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
