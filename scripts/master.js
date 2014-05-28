// This project was created by Lauren Langley for Chattahoochee Riverkeeper as her thesis project at Georgia Institute of Technology

//global reference for all sites
var sites = [];

//DOCUMENT READY
$(document).ready(function(){
	  
	// bind a click event to the list of sites
	$("#maplist .list").on("click", function(ev){
		
		//find out which label was actually clicked
		var target = $(ev.target);
		
		//if the clicked label isn't "on"
		if(!target.hasClass("on") && target.is("label")){
			//un-"on" all labels
			$("#maplist .list label").removeClass("on");
			
			//add "on" to this label
			target.addClass("on");

			//draw the visualization associated with this label
			drawViz(target.attr("data-key"), target.html());
		}
	});

});

// GOOGLE CHART LOADING GLOBAL FUNCTIONS
google.load('visualization', '1.1', {packages: ['corechart', 'controls']});
// draw Ansley or first on list as default when page loads
google.setOnLoadCallback(getCollectionSites);

/******** GOOGLE UI STUFF ********/
		var dashboard = new google.visualization.Dashboard(document.getElementById('right-column'));

		// SLIDER SETUP
		var control = new google.visualization.ControlWrapper({
			controlType: 'ChartRangeFilter',
			containerId: 'timeline',
			options: {
				'filterColumnIndex': 1,
				'ui': {
					'showRangeValues': true,
					'snapToData': false,
					'chartType': 'LineChart',
					'chartOptions': {
						'backgroundColor': 'E4E3DB',
						'chartArea': {'width': '90%'},
						'colors': ['0285b9', '6ebe4a', 'b4221f', 'f79741'],
						'curveType': 'function',
						'hAxis': {'baselineColor': 'none'}
					},
					'chartView': {'columns': [
						1,
						//rainfall multiplied by 500 to show up in slider
						{'calc': function(dataTable, rowIndex) {return (dataTable.getValue(rowIndex, 2) * 500);},'type': 'number'},
						//e. coli
						{'calc': function(dataTable, rowIndex) {return (dataTable.getValue(rowIndex, 3));},'type': 'number'},
						//turbidity multiplied by 500 to show up in slider
						{'calc': function(dataTable, rowIndex) {return (dataTable.getValue(rowIndex, 4) * 250);},'type': 'number'},
						//specific conductivity
						{'calc': function(dataTable, rowIndex) {return (dataTable.getValue(rowIndex, 5));},'type': 'number'},
						]
					},
					//slider range - 1 day in milliseconds = 24 * 60 * 60 * 1000 = 86,400,000 times (70 days) is 10 weeks of populated data
			        'minRangeSize': 6048000000,
				}
			},

		});

		// Rainfall chart 
		var rain = new google.visualization.ChartWrapper({
			chartType: 'ColumnChart',
			containerId: 'rain',
			options: {
				'title': 'Rainfall (inches)',
				'titleTextStyle': {'color': '08335e'},
				'legend': 'none',
				'backgroundColor': 'E4E3DB',
				'colors': ['0285b9'],
				'hAxis': {'textStyle': {'color': '6b6860'}, 'slantedText': true, 'slantedTextAngle': '75'},
				'vAxis': {'textStyle': {'color': '6b6860'}, 'minValue': 0.00},
			},
			'view': {
				'columns': [
				{'calc': function(dataTable, rowIndex) {return dataTable.getFormattedValue(rowIndex, 1);},'type': 'string'},
				2
				]
			}
		});

		// E. coli chart		
		var chart = new google.visualization.ChartWrapper({
			chartType: 'ColumnChart',
			containerId: 'ecoli',
			options: {
				'title': 'E. coli (MPN/100mL)',
				'titleTextStyle': {'color': '08335e'},
				'legend': 'none',
				'backgroundColor': 'E4E3DB',
				'chartArea': {'width': '87%', 'height': '60%'},
				'colors': ['b4221f'],
				'hAxis': {'textStyle': {'color': '6b6860'}, 'slantedText': true, 'slantedTextAngle': '75'},
				'vAxis': {'textStyle': {'color': '6b6860'}, 'minValue': 0, 'maxValue': 1200, 'viewWindowMode': 'explicit', 'viewWindow': {'max': 9000, 'min': 0}, 'gridlines': {'count': 6},
				},
			},
			'view': {
				'columns': [
				{'calc': function(dataTable, rowIndex) {return dataTable.getFormattedValue(rowIndex, 1);},'type': 'string'},
				3
				],
			}
		});

		// Turbidity chart		
		var turb = new google.visualization.ChartWrapper({
			chartType: 'ColumnChart',
			containerId: 'turbidity',
			options: {
				'title': 'Turbidity (NTU)',
				'titleTextStyle': {'color': '08335e'},
				'legend': 'none',
				'backgroundColor': 'E4E3DB',
				//chartArea to change chart size in div
				'chartArea': {'width': '87%', 'height': '60%'},
				'colors': ['6ebe4a'],
				'hAxis': {'textStyle': {'color': '6b6860'}, 'slantedText': true, 'slantedTextAngle': '75'},
				'vAxis': {'textStyle': {'color': '6b6860'}, 'minValue': 0.00},
			},
			'view': {
				'columns': [
				{'calc': function(dataTable, rowIndex) {return dataTable.getFormattedValue(rowIndex, 1);},'type': 'string'},
				4
				]
			}
		});

		// Specific Conductivity chart
		var conductivity = new google.visualization.ChartWrapper({
			chartType: 'ColumnChart',
			containerId: 'conductivity',
			options: {
				'title': 'Specific Conductivity (uS)',
				'titleTextStyle': {'color': '08335e'},
				'legend': 'none',
				'backgroundColor': 'E4E3DB',
				'colors': ['f79741'],
				'hAxis': {'textStyle': {'color': '6b6860'}, 'slantedText': true, 'slantedTextAngle': '75'},
				'vAxis': {'textStyle': {'color': '6b6860'}, 'minValue': 0.00},
				//928f84
			},
			'view': {
				'columns': [
				{'calc': function(dataTable, rowIndex) {return dataTable.getFormattedValue(rowIndex, 1);},'type': 'string'},
				5
				]
			}
		});

// display last collection e.coli result
function displayLastResult(data) {
	var element = document.getElementById('last-collected');
	// get total rows
	var row_count = data.getNumberOfRows();
	// get last row
	var last = row_count - 1;
	// get value for last row of column 4
	element.innerHTML = data.getValue(last, 4);
}

// display last collection date
function displayLastDate(data) {
	var element = document.getElementById('last-date');
	// get total rows
	var row_count = data.getNumberOfRows();
	// get last row
	var last = row_count - 1;
	// get value for last row of column 1
	element.innerHTML = data.getFormattedValue(last, 1);
}



//*********** APP SETUP **************//

//Query for Collection Site Master List
	function getCollectionSites() {
	
		var querySites = new google.visualization.Query('http://spreadsheets.google.com/tq?key=0AiCvi3B8ANGfdFZwZjMybTAteHA5bFVPSjhBamVhN1E&pub=1');
		
		//if want to refresh query every minute...
		//querySites.setRefreshInterval(60);

		//selected each column in spreadsheet
		querySites.setQuery('SELECT A, B, C, D');
		querySites.send(responseHandler);
		
		function responseHandler(responseSites) {
			if (responseSites.isError()) {
				//console.log(responseSites);
	   			//alert('Error in query: ' + responseSites.getMessage() + ' ' + responseSites.getDetailedMessage());
	  			return;
			}else{
				//set a local variable to store this crazy table data datatable
				var data = responseSites.getDataTable();

				//sort the sites alphabetically by name (first column)
				data.sort([{column: 0}]);

				//first for loop loops through each row in the table, effectively one site
				for(var i=0; i<data.getNumberOfRows(); i++){
					
					//set up an object for each site, looks at columns in REQUIRED order from master collection site list spreadsheet
					var site = {
						name: data.getFormattedValue(i, 0),
						lat: data.getFormattedValue(i, 1),
						long: data.getFormattedValue(i, 2),
						key: data.getFormattedValue(i, 3)
					}

					sites.push(site);
				}

				//now that we have all the site data, let's make buttons and load a map
				generateRadioButtons();
				loadMapScript();
			}		
		}	
	}

	//generate all the buttons for the sites

	function generateRadioButtons() {
		for(var i=0; i<sites.length; i++){
			var radioButton = '<label class="" data-key="'+sites[i].key+'">'+sites[i].name+'</label><br>';
			$("#maplist .list").append(radioButton);
		}

		$($("#maplist .list label")[0]).click();
	}

	//create the map

	function initialize() {

		// Google map style customization
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
		// End Google map style customization
		
		var mapOptions = {
			zoom: 10,
			//center the map
			center: new google.maps.LatLng(33.8272, -84.3836),
			mapTypeId: google.maps.MapTypeId.TERRAIN,
			streetViewControl: false,
		}
	    
		var map = new google.maps.Map(document.getElementById("map"), mapOptions);
	 
	 	map.setOptions({styles: ucrStyle});
		
		var content = document.createElement("DIV");
	    var title = document.createElement("DIV");
	    content.appendChild(title);
		
	    var infowindow = new google.maps.InfoWindow({
			content: content,
	    });
		
		var icon1URL = 'images/BlueWaterDrop_20x30.png';
		var icon2URL = 'images/GreenWaterDrop_20x30.png';
		
		var iconSize = new google.maps.Size(20,30);
		var iconOrigin = new google.maps.Point(0,0);
		var iconAnchor = new google.maps.Point(10,30);

		var icon1 = new google.maps.MarkerImage(icon1URL, iconSize, iconOrigin, iconAnchor);
		var icon2 = new google.maps.MarkerImage(icon2URL, iconSize, iconOrigin, iconAnchor);

	    for (index in sites) addMarker(sites[index], index);
			
	    function addMarker(data, index) {
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(data.lat, data.long),
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
	  			$("label[data-key="+data.key+"]").click();
	   		});
			
			google.maps.event.addListener(map, "click", function() {
				infowindow.close(marker);
			});
			
			$("#maplist").click(function() {
				infowindow.close(marker);
			});

		}

	    var bounds = new google.maps.LatLngBounds();
	    for (index in sites) {
	   		var data = sites[index];
	   		bounds.extend(new google.maps.LatLng(data.lat, data.long));
	 	}
	 	map.fitBounds(bounds);
	    
		function openInfoWindow(marker) {
	   		title.innerHTML = marker.getTitle();
	   		infowindow.open(map, marker);
	    }
	}

	function loadMapScript() {
	  var script = document.createElement("script");
	  script.type = "text/javascript";
	  /**** Enter the Google Map API that you registered, here... ****/
	  script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyAsElTFTEp2pQEErOtSx8L22RtHFU9AcQU&sensor=false&callback=initialize";
	  document.body.appendChild(script);
	}

//********* VISUALIZATION CALLS **********//

	function drawViz(key, name){
		//displays selected collection site name above charts
		$("#whichSite p").html(name);
		
		//query and parameters for the site
		var query = new google.visualization.Query('http://spreadsheets.google.com/tq?key='+key+'&pub=1');
		//select each column in spreadsheet
		query.setQuery('SELECT A, B, C, D, E, F');

		query.send(visualizationCallback);

		// link to public spreadsheet
    	var hrefKey = '<a target="_blank" href="https://docs.google.com/spreadsheet/pub?key='+key+'&output=html"><span>View data as spreadsheet</span><img alt="spreadsheet" src="images/spreadsheet-icon.png"></a>';
		$("#dataLink").html(hrefKey);
	}

	function visualizationCallback(response){
		if (response.isError()) {
			//console.log(responseSites);
			//alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
			return;
		}

		var data = response.getDataTable();	

    	// call function to display last e.coli collection result and date
    	displayLastResult(data);
    	displayLastDate(data);

    	// resets/snaps timeline slider thumbs back to far left and right
    	control.setState({'range': {'lowThumbAtMinimum': true, 'highThumbAtMaximum': true} });

    	// draw charts and controls
		dashboard.bind(control, chart);
		dashboard.bind(control, turb);
		dashboard.bind(control, rain);
		dashboard.bind(control, conductivity);
    	dashboard.draw(data);
	}

	