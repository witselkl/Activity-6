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

var map; // Make map variable global to access it in other functions

// Function to instantiate the Leaflet map
function createMap(){
  // Create the map
  map = L.map('map', {
    center: [0, 0],
    zoom: 2
  });

  // Add a tile layer to the map using OpenStreetMap tiles
  var tileLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
  });
  tileLayer.addTo(map);

  // Call getData function
  getData(map);
};

// Step 3: Build an attributes array from the data
function processData(data){
  // Empty array to hold attributes
  var attributes = [];

  // Properties of the first feature in the dataset
  var properties = data.features[0].properties;

  // Push each attribute name into attributes array if it includes "Pop"
  for (var attribute in properties){
      // Only take attributes with population values
      if (attribute.indexOf("Pop") > -1){
          attributes.push(attribute);
      }
  }

  // Check result
  console.log("Attributes:", attributes); // Added logging to verify attributes

  return attributes;
};

// Function to load data and initiate map components
function getData(map){
  // Load the data
  fetch("data/MegaCities.geojson")
      .then(function(response){
          return response.json();
      })
      .then(function(json){
          // Create an attributes array
          var attributes = processData(json);

          // Calculate the minimum value for the initial attribute
          var minValue = Math.min(...json.features.map(f => f.properties[attributes[0]]));

          // Create proportional symbols
          createPropSymbols(json, map, attributes, minValue);

          // Create sequence controls
          createSequenceControls(attributes);
      });
}

// Function to calculate radius based on attribute value
function calcPropRadius(attValue, minValue) {
  // Constant factor adjusts symbol sizes evenly
  var minRadius = 5;
  // Flannery Appearance Compensation formula
  var radius = 1.0083 * Math.pow(attValue / minValue, 0.5715) * minRadius;
  return radius;
};

// Updated createSequenceControls function
function createSequenceControls(attributes){
    // Create range input element (slider)
    var slider = "<input class='range-slider' type='range'></input>";
    document.querySelector("#panel").insertAdjacentHTML('beforeend', slider);

    // Set slider attributes based on the length of attributes array
    const sliderElement = document.querySelector(".range-slider");
    sliderElement.max = attributes.length - 1; // Adjust max to the last index of attributes
    sliderElement.min = 0;
    sliderElement.value = 0;
    sliderElement.step = 1; 
    
    // Add event listener to update proportional symbols when slider changes
    sliderElement.addEventListener('input', function(){
        const index = sliderElement.value;
        const currentAttribute = attributes[index]; // Get current attribute based on slider value
        updatePropSymbols(currentAttribute);
    });

    // Replace button content with images
    document.querySelector('#reverse').innerHTML = "<img src='img/reverse.png' style='width:25px; height:25px;' alt='Reverse'>";
    document.querySelector('#forward').innerHTML = "<img src='img/forward.png' style='width:25px; height:25px;' alt='Forward'>";

    // Add click listeners for the forward and reverse buttons
    document.querySelectorAll('.step').forEach(function(step){
        step.addEventListener("click", function(){
            let index = parseInt(sliderElement.value);

            // Increment or decrement depending on button clicked
            if (step.id === 'forward'){
                index++;
                index = index > attributes.length - 1 ? 0 : index; // Wrap to start if beyond last
            } else if (step.id === 'reverse'){
                index--;
                index = index < 0 ? attributes.length - 1 : index; // Wrap to end if below first
            }

            // Update slider position
            sliderElement.value = index;

            // Update proportional symbols with the new attribute
            const currentAttribute = attributes[index];
            updatePropSymbols(currentAttribute);
        });
    });
}

// Function to add proportional symbols to the map
function createPropSymbols(data, map, attributes, minValue){
  // Create a Leaflet GeoJSON layer and add it to the map
  L.geoJson(data, {
      pointToLayer: function(feature, latlng){
          // Pass minValue to pointToLayer to access it within the function
          return pointToLayer(feature, latlng, attributes, minValue);
      }
  }).addTo(map);
}

// Function to convert markers to circle markers with popups
function pointToLayer(feature, latlng, attributes, minValue){
  // Assign the current attribute based on the first index of the attributes array
  var attribute = attributes[0];

  // Marker options
  var options = {
      fillColor: "#ff7800",
      color: "#100",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
  };

  // Determine value for the selected attribute
  var attValue = Number(feature.properties[attribute]);

  // Give each feature's circle marker a radius based on its attribute value
  options.radius = calcPropRadius(attValue, minValue);

  // Create circle marker layer
  var layer = L.circleMarker(latlng, options);

  // Build popup content string
  var popupContent = "<p><b>City:</b> " + feature.properties.City + "</p>";
  var year = attribute.split("_")[1];
  popupContent += "<p><b>Population in " + year + ":</b> " + feature.properties[attribute] + " million</p>";

  layer.bindPopup(popupContent);

  return layer;
}
<<<<<<< HEAD

// Updated updatePropSymbols function
function updatePropSymbols(attribute){
    // Recalculate minValue for the current attribute
    let minValue = Infinity;
    map.eachLayer(function(layer){
        if (layer.feature && layer.feature.properties[attribute]){
            const value = layer.feature.properties[attribute];
            if (value < minValue) minValue = value;
        }
    });

    // Update each layer with the new attribute's proportional symbols
    map.eachLayer(function(layer){
        if (layer.feature && layer.feature.properties[attribute]){
            // Access feature properties
            const props = layer.feature.properties;

            // Calculate new radius based on the updated attribute
            const radius = calcPropRadius(props[attribute], minValue);
            layer.setRadius(radius);

            // Update popup content            
            const popupContent = `<p><b>City:</b> ${props.City}</p><p><b>Population in ${attribute.split("_")[1]}:</b> ${props[attribute]} million</p>`;
            layer.getPopup().setContent(popupContent).update();
        }
    });
}
//Create array
//Line 1: variables we want to access from multiple functions  
var map;  
var dataStats = {};  

function calcStats(data){
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
    //get min, max, mean stats for our array
    dataStats.min = Math.min(...allValues);
    dataStats.max = Math.max(...allValues);
    //calculate meanValue
    var sum = allValues.reduce(function(a, b){return a+b;});
    dataStats.mean = sum/ allValues.length;

}     

function getData(map){  

    //load the data  
    fetch("data/MegaCities.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){ 

        //calling our renamed function  
        calcStats(response);  

    });  
};
///Create a legend
function createLegend(attributes){
    var LegendControl = L.Control.extend({
        options: {
            position: 'bottomright'
        },

        onAdd: function () {
            // create the control container with a particular class name
            var container = L.DomUtil.create('div', 'legend-control-container');

            container.innerHTML = '<p class="temporalLegend">Population in <span class="year">1980</span></p>';

            //Step 1: start attribute legend svg string
            var svg = '<svg id="attribute-legend" width="130px" height="130px">';

            //add attribute legend svg to container
            container.innerHTML += svg;

            return container;
        }
    });

    map.addControl(new LegendControl());

};
        //Example 3.5 line 15...Step 1: start attribute legend svg string
        var svg = '<svg id="attribute-legend" width="130px" height="130px">';

        //array of circle names to base loop on
        var circles = ["max", "mean", "min"];

        //Step 2: loop to add each circle and text to svg string
        for (var i=0; i<circles.length; i++){
            //circle string
            svg += '<circle class="legend-circle" id="' + circles[i] + 
            '" fill="#F47821" fill-opacity="0.8" stroke="#000000" cx="65"/>';
        };

        //close svg string
        svg += "</svg>";

        //add attribute legend svg to container
        container.insertAdjacentHTML('beforeend',svg);

//array of circle names to base loop on  
  var circles = ["max", "mean", "min"]; 

  //Step 2: loop to add each circle and text to svg string  
  for (var i=0; i<circles.length; i++){  

      //Step 3: assign the r and cy attributes  
      var radius = calcPropRadius(dataStats[circles[i]]);  
      var cy = 130 - radius;  

      //circle string  
      svg += '<circle class="legend-circle" id="' + circles[i] + '" r="' + radius + '"cy="' + cy + '" fill="#F47821" fill-opacity="0.8" stroke="#000000" cx="65"/>';  
  };  

  //close svg string  
  svg += "</svg>"; 
  
   //Example 3.8 line 4...loop to add each circle and text to SVG string
   for (var i=0; i<circles.length; i++){

    //Step 3: assign the r and cy attributes            
    var radius = calcPropRadius(dataStats[circles[i]]);           
    var cy = 130 - radius;            

    //circle string            
    svg += '<circle class="legend-circle" id="' + circles[i] + '" r="' + radius + '"cy="' + cy + '" fill="#F47821" fill-opacity="0.8" stroke="#000000" cx="65"/>';

    //evenly space out labels            
    var textY = i * 20 + 20;            

    //text string            
    svg += '<text id="' + circles[i] + '-text" x="65" y="' + textY + '">' + Math.round(dataStats[circles[i]]*100)/100 + " million" + '</text>';
};

//close svg string
svg += "</svg>";

//add attribute legend svg to container
container.insertAdjacentHTML('beforeend',svg);

function updatePropSymbols(attribute){
    var year = attribute.split("_")[1];
    //update temporal legend
    document.querySelector("span.year").innerHTML = year;
=======

// Updated updatePropSymbols function
function updatePropSymbols(attribute){
    // Recalculate minValue for the current attribute
    let minValue = Infinity;
    map.eachLayer(function(layer){
        if (layer.feature && layer.feature.properties[attribute]){
            const value = layer.feature.properties[attribute];
            if (value < minValue) minValue = value;
        }
    });

    // Update each layer with the new attribute's proportional symbols
    map.eachLayer(function(layer){
        if (layer.feature && layer.feature.properties[attribute]){
            // Access feature properties
            const props = layer.feature.properties;

            // Calculate new radius based on the updated attribute
            const radius = calcPropRadius(props[attribute], minValue);
            layer.setRadius(radius);

            // Update popup content            
            const popupContent = `<p><b>City:</b> ${props.City}</p><p><b>Population in ${attribute.split("_")[1]}:</b> ${props[attribute]} million</p>`;
            layer.getPopup().setContent(popupContent).update();
        }
    });
}
>>>>>>> 1284685446f798ef4a830925b4843ff8ab6da31f

// Initialize map once the document is fully loaded
document.addEventListener('DOMContentLoaded', createMap);
