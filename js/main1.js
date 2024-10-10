// Function to instantiate the Leaflet map
function createMap(){
    // Create the map
    var map = L.map('map', {
      center: [0, 0],
      zoom: 2
    });
  
    // Add OSM base tilelayer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);
  
    // Call getData function
    getData(map);
  };
  
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
  
  // Function to calculate radius based on attribute value
  function calcPropRadius(attValue, minValue) {
    // Constant factor adjusts symbol sizes evenly
    var minRadius = 5;
    // Flannery Apperance Compensation formula (adjust as needed)
    var radius = 1.0083 * Math.pow(attValue/minValue,0.5715) * minRadius;
  
    return radius;
  };
  
  // Function to create proportional symbols
  function createPropSymbols(data, map, minValue){
    // Attribute to visualize with proportional symbols
    var attribute = "Pop_2015";
  
    // Marker options
    var geojsonMarkerOptions = {
      fillColor: "#ff7800",
      color: "#fff",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
  
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