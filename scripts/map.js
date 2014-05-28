// Google map marker locations and names
var markers = [
	{ lat: 33.7938, lng: -84.3762, name: "Ansley Stream at The Dell" },
	{ lat: 33.8166, lng: -84.4200, name: "Beaverbrook Park" },
	{ lat: 34.0061, lng: -84.3495, name: "Big Creek at Riverside Park" },
	{ lat: 33.8315, lng: -84.267, name: "Burnt Fork Creek Near Frazier Rd" },
	{ lat: 33.7964, lng: -84.37, name: "Clear Creek at Piedmont Ave" },
	{ lat: 33.9036, lng: -84.3312, name: "Nancy Creek at Ashford Dunwoody" },
	{ lat: 33.8597, lng: -84.4245, name: "Nancy Creek at Randall Mill Rd" },
	{ lat: 33.7901, lng: -84.5219, name: "Nickajack Creek at Discovery Blvd" },
	{ lat: 33.9153, lng: -84.3264, name: "North Fork Nancy Creek" },
	{ lat: 33.8925, lng: -84.2555, name: "North Fork Peachtree Creek at Lindberg" },
	{ lat: 33.8203, lng: -84.4075, name: "Peachtree Creek at Northside Drive" },
	{ lat: 33.8272, lng: -84.3836, name: "PHENA Duck Pond East"},
	{ lat: 33.8265, lng: -84.3849, name: "PHENA Duck Pond West" },
	{ lat: 33.7718, lng: -84.4299, name: "Proctor Creek at Donald Lee Hollowell" },
	{ lat: 33.7636, lng: -84.4281, name: "Proctor Creek at Joseph E Boone" },
	{ lat: 33.7993, lng: -84.4869, name: "Proctor Creek at Northwest Drive" },
	{ lat: 33.8003, lng: -84.3367, name: "South Fork Peachtree Creek at Briarcliff" },
	{ lat: 33.8081, lng: -84.4022, name: "Tanyard Creek in Tanyard Creek Park" },
	{ lat: 34.281324, lng: -83.830222, name: "Flat Creek at Industrial Blvd" },
	{ lat: 34.281335, lng: -83.832521, name: "Flat Creek at Dorsey Street" },
	{ lat: 34.282101, lng: -83.839500, name: "Flat Creek at Atlanta Hwy"},
	{ lat: 34.271671, lng: -83.848676, name: "Flat Creek at Dixie Drive"},
	{ lat: 34.269163, lng: -83.868528, name: "Flat Creek at Old Flowery Branch Rd"},
    // { lat: 34.269163, lng: -83.868528, name: "New Collection Site Name Here"},
    /**** ADD NEW COLLECTION SITE LAT AND LONG AND NAME USING FORMAT ABOVE ****/ 
    ];

// 
var metaMarker = [
	{ "class": "ansley" },
	{ "class": "beaverbrook" },
	{ "class": "bigcreek" },
	{ "class": "burntfork" },
	{ "class": "clearcreek" },
	{ "class": "nancy_ashford" },
	{ "class": "nancy_randall" },
	{ "class": "nickajack" },
	{ "class": "northfork_nancy" },
	{ "class": "northfork_lindberg" },
	{ "class": "ptreecreek" },
   	{ "class": "phena_east"},
    { "class": "phena_west" },
    { "class": "proctor_hollowell" },
	{ "class": "proctor_boone" },
	{ "class": "proctor_northwest" },
	{ "class": "southfork" },
	{ "class": "tanyard" },
	{ "class": "flat_industrial"},
	{ "class": "flat_dorsey"},
	{ "class": "flat_atlanta"},
    { "class": "flat_dixie"},
    { "class": "flat_flowery"},
    // {"class": "collection_site"},
    /**** ADD NEW COLLECTION SITE LAT AND LONG AND NAME USING FORMAT ABOVE ****/ 
    /**** use underscore _ instead of space for two word site names ****/
    ];

// Initialize entire project
function initialize() {

	// Google map customization
	var ucrStyle = [
	  {
	    featureType: "road.highway",
	    stylers: [
	      { visibility: "on" },
	      { hue: "#ff7700" },
	      { lightness: 2 },
	      { gamma: 1.37 },
	      { saturation: -77 }
	    ]
	  },{
	    featureType: "road.arterial",
	    stylers: [
	      { hue: "#55ff00" },
	      { saturation: -69 }
	    ]
	  },{
	    featureType: "landscape.natural",
	    stylers: [
	      { saturation: -39 },
	      { hue: "#ffc300" }
	    ]
	  },{
	    featureType: "poi.park",
	    stylers: [
		  { hue: "#00ff88" },
	      { saturation: -45 },
	      { lightness: -5 }
	    ]
	  },{
	    featureType: "water",
	    stylers: [
	      { hue: "#00d4ff" }
	    ]
	  },{
	  }
	]
	// End Google map customization
	
	var mapOptions = {
		zoom: 10,
		center: new google.maps.LatLng(33.8272, -84.3836),
		mapTypeId: google.maps.MapTypeId.TERRAIN,
		streetViewControl: false,
	}
    
	var map = new google.maps.Map(document.getElementById("map"), 
	mapOptions);
 
 	map.setOptions({styles: ucrStyle});
	
	var content = document.createElement("DIV");
    var title = document.createElement("DIV");
    content.appendChild(title);
	
    var infowindow = new google.maps.InfoWindow({
		content: content,
    });
	
	//infowindow.setOptions({maxWidth:200}); 
	
	var icon1URL = 'images/BlueWaterDrop_20x30.png';
	var icon2URL = 'images/GreenWaterDrop_20x30.png';
	
	var iconSize = new google.maps.Size(20,30);
	var iconOrigin = new google.maps.Point(0,0);
	var iconAnchor = new google.maps.Point(10,30);

	var icon1 = new google.maps.MarkerImage(icon1URL, iconSize, iconOrigin, iconAnchor);
	var icon2 = new google.maps.MarkerImage(icon2URL, iconSize, iconOrigin, iconAnchor);

    for (index in markers) addMarker(markers[index], index);
		
    function addMarker(data, index) {
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(data.lat, data.lng),
			map: map,
			icon: icon1,
			title: data.name
		});
		
		google.maps.event.addListener(marker, "mouseover", function() {
		    	marker.setIcon(icon2URL);
	    });
		
		google.maps.event.addListener(marker, "mouseout", function() {
		    	marker.setIcon(icon1URL);
	    });
		
		google.maps.event.addListener(marker, "click", function() {
  			openInfoWindow(marker);
			$("input:radio").removeAttr("checked");
			updateLabel(metaMarker[index]["class"]);
			//marker.setIcon(icon2URL);
			
			if (index == 0) {
				drawViz1();
			} else if (index == 1) {
				drawViz2();
			} else if (index == 2) {
				drawViz3();
			} else if (index == 3) {
				drawViz4();
			} else if (index == 4) {
				drawViz5();
			} else if (index == 5) {
				drawViz6();
			} else if (index == 6) {
				drawViz7();
			} else if (index == 7) {
				drawViz8();
			} else if (index == 8) {
				drawViz9();
			} else if (index == 9) {
				drawViz10();
			} else if (index == 10) {
				drawViz11();
			} else if (index == 11) {
				drawViz12();
			} else if (index == 12) {
				drawViz13();
			} else if (index == 13) {
				drawViz14();
			} else if (index == 14) {
				drawViz15();
			} else if (index == 15) {
				drawViz16();
			} else if (index == 16) {
				drawViz17();
			} else if (index == 17) {
				drawViz18();
			} else if (index == 18) {
				drawViz19();
			} else if (index == 19) {
				drawViz20();
			} else if (index == 20) {
				drawViz21();
			} else if (index == 21) {
				drawViz22();
			} else if (index == 22) {
				drawViz23();
			}
   		});
		
		google.maps.event.addListener(map, "click", function() {
			infowindow.close(marker);
		});
		
		$("#maplist").click(function() {
			infowindow.close(marker);
		});
		/*
		$("#tanyard").parent('label').click(function() {
		//$("#tanyard").click(function() {
			openInfoWindow(marker)
		});
		*/
	}

    var bounds = new google.maps.LatLngBounds();
    for (index in markers) {
   		var data = markers[index];
   		bounds.extend(new google.maps.LatLng(data.lat, data.lng));
 	}
 	map.fitBounds(bounds);
    
	function openInfoWindow(marker) {
   		title.innerHTML = marker.getTitle();
		//title.innerHTML = marker.getTitle() + "<br>" + " word";
   		infowindow.open(map, marker);
    }
}

function loadMapScript() {
  var script = document.createElement("script");
  script.type = "text/javascript";
  /**** Enter the Google Map API that you registered, between 'key=' and '&sensor' ****/
  script.src = "http://maps.googleapis.com/maps/api/js?key=&sensor=false&callback=initialize";
  document.body.appendChild(script);
}
