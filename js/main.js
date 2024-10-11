//GOAL: Proportional symbols representing attribute values of mapped features
//STEPS:
//Step 1. Create the Leaflet map--already done in createMap()
//Step 2. Import GeoJSON data--already done in getData()
//Step 3. Add circle markers for point features to the map--already done in AJAX callback
//Step 4. Determine the attribute for scaling the proportional symbols
//Step 5. For each feature, determine its value for the selected attribute
//Step 6. Give each feature's circle marker a radius based on its attribute value

//GOAL: Allow the user to sequence through the attributes and resymbolize the map 
//   according to each attribute
//STEPS:
//Step 1. Create slider widget
//Step 2. Create step buttons
//Step 3. Create an array of the sequential attributes to keep track of their order
//Step 4. Assign the current attribute based on the index of the attributes array
//Step 5. Listen for user input via affordances
//Step 6. For a forward step through the sequence, increment the attributes array index; 
//   for a reverse step, decrement the attributes array index
//Step 7. At either end of the sequence, return to the opposite end of the sequence on the next step
//   (wrap around)
//Step 8. Update the slider position based on the new index
//Step 9. Reassign the current attribute based on the new attributes array index
//Step 10. Resize proportional symbols according to each feature's value for the new attribute

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

//Above Example 3.10...Step 3: build an attributes array from the data
function processData(data){
  //empty array to hold attributes
  var attributes = [];

  //properties of the first feature in the dataset
  var properties = data.features[0].properties;

  //push each attribute name into attributes array
  for (var attribute in properties){
      //only take attributes with population values
      if (attribute.indexOf("Pop") > -1){
          attributes.push(attribute);
      };
  };

  //check result
  console.log(attributes);

  return attributes;
};

function getData(map){
  //load the data
  fetch("data/MegaCities.geojson")
      .then(function(response){
          return response.json();
      })
      .then(function(json){
      var minValue = Math.min(json.features.map(f => f.properties["Pop_2015"]));

         //create an attributes array
        var attributes = processData(json);
         minValue = minValue(json);
          createPropSymbols(json, map, attributes);
          createSequenceControls(attributes);
      })
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

//Step 1: Create new sequence controls
function createSequenceControls(){
  //create range input element (slider)
  var slider = "<input class='range-slider' type='range'></input>";
  document.querySelector("#panel").insertAdjacentHTML('beforeend',slider);

  //Example 3.5...create range input element (slider)
  var slider = "<input class='range-slider' type='range'></input>";
  document.querySelector("#panel").insertAdjacentHTML('beforeend',slider);

  //set slider attributes
  document.querySelector(".range-slider").max = 6;
  document.querySelector(".range-slider").min = 0;
  document.querySelector(".range-slider").value = 0;
  document.querySelector(".range-slider").step = 1; 
    
  //replace button content with images
  document.querySelector('#reverse').insertAdjacentHTML('beforeend',"<img src='img/reverse.png'>");
  document.querySelector('#forward').insertAdjacentHTML('beforeend',"<img src='img/forward.png'>");
  };


 //function to convert markers to circle markers with popups
 function pointToLayer(feature, latlng, attributes){
  //Step 4: Assign the current attribute based on the first index of the attributes array
  var attribute = attributes[0];
  //check
  console.log(attribute);
  
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

//Example 2.1 line 34...Add circle markers for point features to the map
function createPropSymbols(data, attributes){
  //create a Leaflet GeoJSON layer and add it to the map
  L.geoJson(data, {
      pointToLayer: function(feature, latlng){
          return pointToLayer(feature, latlng, attributes);
      }
  }).addTo(map);
};

   //Below Example 3.6 in createSequenceControls()
    //Step 5: click listener for buttons
    document.querySelectorAll('.step').forEach(function(step){
      step.addEventListener("click", function(){
          //sequence
      })
  })

  document.querySelectorAll('.step').forEach(function(step){
    step.addEventListener("click", function(){
        var index = document.querySelector('.range-slider').value;

        //Step 6: increment or decrement depending on button clicked
        if (step.id == 'forward'){
            index++;
            //Step 7: if past the last attribute, wrap around to first attribute
            index = index > 6 ? 0 : index;
        } else if (step.id == 'reverse'){
            index--;
            //Step 7: if past the first attribute, wrap around to last attribute
            index = index < 0 ? 6 : index;
        };

        //Step 8: update slider
        document.querySelector('.range-slider').value = index;

        //Called in both step button and slider event listener handlers
        //Step 9: pass new attribute to update symbols
        updatePropSymbols(attributes[index]);

        
    })
})

//Step 10: Resize proportional symbols according to new attribute values
function updatePropSymbols(attribute){
  map.eachLayer(function(layer){
       //Example 3.18 line 4
       if (layer.feature && layer.feature.properties[attribute]){
        //access feature properties
        var props = layer.feature.properties;

        //update each feature's radius based on new attribute values
        var radius = calcPropRadius(props[attribute]);
        layer.setRadius(radius);

        //add city to popup content string
        var popupContent = "<p><b>City:</b> " + props.City + "</p>";

        //add formatted attribute to panel content string
        var year = attribute.split("_")[1];
        popupContent += "<p><b>Population in " + year + ":</b> " + props[attribute] + " million</p>";

        //update popup content            
        popup = layer.getPopup();            
        popup.setContent(popupContent).update();
    };
  });
};



document.addEventListener('DOMContentLoaded',createMap);




