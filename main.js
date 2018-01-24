function loadData() {
	$.get("apartments.csv", function(data) {
		var header;
		var apartments = data.trim().split("\n").map(function(line) {
			var words = line.trim().split(";");
			if(!header) {
				header = words;
				return null;
			}

			var apartment = new Object();
			for(var i = 0; i < header.length; i++)
				apartment[header[i]] = words[i];

			return apartment
		});
		initialize(apartments.splice(1));
	});
}

function initialize(apartments) {
	var myLatlng = new google.maps.LatLng(47.619938, -122.323709); // Add the coordinates
	var mapOptions = {
		zoom: 16, // The initial zoom level when your map loads (0-20)
		minZoom: 6, // Minimum zoom level allowed (0-20)
		maxZoom: 17, // Maximum soom level allowed (0-20)
		zoomControl:true, // Set to true if using zoomControlOptions below, or false to remove all zoom controls.
		zoomControlOptions: {
			style:google.maps.ZoomControlStyle.DEFAULT // Change to SMALL to force just the + and - buttons.
		},
		center: myLatlng, // Centre the Map to our coordinates variable
		mapTypeId: google.maps.MapTypeId.ROADMAP, // Set the type of Map
		scrollwheel: false, // Disable Mouse Scroll zooming (Essential for responsive sites!)
		// All of the below are set to true by default, so simply remove if set to true:
		panControl:false, // Set to false to disable
		mapTypeControl:false, // Disable Map/Satellite switch
		scaleControl:false, // Set to false to hide scale
		streetViewControl:false, // Set to disable to hide street view
		overviewMapControl:false, // Set to false to remove overview control
		rotateControl:false // Set to false to disable rotate control
  	}
	var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions); // Render our map within the empty div
	var markers = [];
	for(var i = 0; i < apartments.length; i++) {
		var marker = new google.maps.Marker({
			position : {lat : parseFloat(apartments[i]["Latitude"]), lng : parseFloat(apartments[i]["Longitude"])},
			map : map,
			title : apartments[i]["Name"],
			content : 	"<h3>" + apartments[i]["Name"] + "</h3>" +
						"Address: " + apartments[i]["Address"] + "<br>" +
						"Rent: " + apartments[i]["Rent"] + "<br>" +
						"Square Footage: " + apartments[i]["Square Footage"] + "<br>"
		});
		markers.push(marker);

		google.maps.event.addListener(marker, "click", function() { // Add a Click Listener to our marker
			var infowindow = new google.maps.InfoWindow({ // Create a new InfoWindow
				content: this.content
			}).open(map, this);
		});
		// google.maps.event.addDomListener(window, "resize", function() { map.setCenter(myLatlng); }); // Keeps the Pin Central when resizing the browser on responsive sites
	}
}

google.maps.event.addDomListener(window, "load", loadData);