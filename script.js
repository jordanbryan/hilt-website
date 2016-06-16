
function createMap(data) {

// ** MAP

  var map = L.map('map');

  var layer = L.tileLayer('https://api.mapbox.com/styles/v1/jbryan/ciph6ppal000jatmcki9zyx4v/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamJyeWFuIiwiYSI6ImNpcGg2bXRzbTAxMXF0ZW00bTU1NzI1ejcifQ.8-i96MoLaDpMt9kY83PcoA');

  map.addLayer(layer);

  map.setView([0, 0], 3);

  var markers = [];

  _.each(data.features, function(feature) {

    var lat = feature.geometry.coordinates[1];
    var lon = feature.geometry.coordinates[0];

    var marker = L.circleMarker([lat, lon], {
      className: 'toponym',
      offset: Number(feature.properties.offset),
    });

    marker.bindPopup(feature.properties.toponym);

    markers.push(marker);
    map.addLayer(marker);

  });

  // ** SLIDER

  var input = $('#slider input');

  var max = _.last(data.features).properties.offset;
  input.attr('max', max);

  input.on('input', function() {

    var offset = Number(input.val());

    _.each(markers, function(marker) {

      if (marker.options.offset < offset) {
        map.addLayer(marker);
      }

      else {
        map.removeLayer(marker);
      }

    });

  });

  input.trigger('input');

  // ** Marker clusters

  var clusters = L.markerClusterGroup();

  _.each(markers, function(marker) {
    clusters.addLayer(marker);
  });

  map.addLayer(clusters);

  // ** heatmap

  var points = _.map(data.features, function(feature) {

    var lat = feature.geometry.coordinates[1];
    var lon = feature.geometry.coordinates[0];

    return [lat, lon, 1];

  });

  var heat = L.heatLayer(points, {
    minOpacity: 0.3
  });

  map.addLayer(heat);

}

  //On page start
$(function() {
  $.getJSON('80-days.geojson', function(data) {
    createMap(data);
  });
})
