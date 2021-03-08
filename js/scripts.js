mapboxgl.accessToken = 'pk.eyJ1Ijoia2hvd2V6IiwiYSI6ImNrbDFkNXE0dTBsZWkydnBkMXB0MjJ2ejEifQ.TSlGl3vZSESGCLo2de5Zwg';

var map = new mapboxgl.Map({
    container: 'mapContainer', // container ID
    style: 'mapbox://styles/mapbox/dark-v10', // style URL
    center: [-74.006106,40.714434], // starting position [lng, lat]
    zoom: 10 // starting zoom
})

map.on('style.load', function () {

  // we need to load the data manually because the lanecounts are strings and not numbers
  $.getJSON('./data/bicycle-routes.geojson', function(routesCollection) {

    // iterate over each feature in the routesCollection and convert the lanecount property to a number
    routesCollection.features.forEach(function(feature) {
      feature.properties.lanecount = parseInt(feature.properties.lanecount)
    })

// Define a source before using it to create a new layer
  map.addSource('routes', {
    type: 'geojson',
    data: './data/bicycle-routes.geojson'
  });

  // add a layer to style and display the source
  map.addLayer({
    'id': 'routes-line',
    'type': 'line',
    'source': 'routes',
    'paint': {
      'line-width': 2,
      'line-opacity': 0.9,
      'line-color': [
        'match',
        ['get', 'lanecount'],
        '1', '#fff200',
        '2', '#ff6a00',
        /* other */ '#ccc'
      ],
      },
    });

  // listen for a click on the map and show info in the sidebar
    map.on('click', function(e) {
      // query for the features under the mouse, but only in the routes layer
      var features = map.queryRenderedFeatures(e.point, {
          layers: ['routes-line'],
      });

      if (features.length > 0 ) {
        var hoveredFeature = features[0]
        var routeFromStreet = hoveredFeature.properties.fromstreet
        var routeToStreet = hoveredFeature.properties.tostreet

        $('#fromStreet').text(routeFromStreet)
        $('#toStreet').text(routeToStreet)

      }
    })
  })
})
