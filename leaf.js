
	// initialize the map
var geoLayer;
var map = L.map("map").setView([1.2921, 36.8219], 6);

  // load a tile layer
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    {
      attribution: 'BIG_BEN',
      maxZoom: 20,
      minZoom: 1
    }).addTo(map);
	

	
function getColor(d){
	return d > 2000000 ? '#800026':
		   d > 1000000  ? '#BD0026' :
           d > 500000 ? '#E31A1C' :
           d > 250000  ? '#FC4E2A' :
           d > 100000   ? '#FD8D3C' :
           d > 50000  ? '#FEB24C' :
           d > 10000   ? '#FED976' :
                      '#FFEDA0';
}

function feature_style(feature){
	return {
		fillColor: getColor(feature.properties.Total_Pop),
		weight: 2,
		opacity: 1,
		color: '#EEEEEE',
		dashArray: '3',
		fillOpacity: 0.7
	};
}

function highlightFeature(e){
	var layer = e.target;
	
	layer.setStyle({
		weight: 5,
		color: '#31FF00',
		dashArray:'',
		fillOpacity: 0.7
	});
	
	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
	}
	info.update(layer.feature.properties);
}


function resetHighlight(e){
	geoLayer.resetStyle(e.target);
	info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}
		
function features(feature, layer){
	layer.bindPopup('<tr><th><b>  COUNTY NAME:  <b><th><tr>' + feature.properties.COUNTY + 
	'<br><tr> Population:  <tr>' + feature.properties.Total_Pop);
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		//click: zoomToFeature
	});
	
}



var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h4>Kenya Population Data per County</h4>' +  (props ?
        '<b>' + props.COUNTY + '</b><br/>' + props.Total_Pop + ' People'
        : 'Hover over a County');
};

info.addTo(map);


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10000, 50000, 100000, 250000, 500000, 1000000, 2000000],
        labels = [];
    div.innerHTML = '<div><b>Population</b></div>';
    // loop through
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);

geoLayer = L.geoJson(censusData, {onEachFeature:features, style:feature_style}).addTo(map)

