var width = window.innerWidth;
var height = window.innerHeight;


var marginLeft = 0;
var marginTop = 0;
var svg = d3.select('svg')
    // .attr("width",width)
    .attr("height",height);
    // .append('g');
    //.attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');
//set up the projection for the map
var mercatorProjection = d3.geoMercator()  //tell it which projection to use
    .scale(500)                           //tell it how big the map should be
    .translate([0, height/2]);  //set the center of the map to show up in the center of the screen

    // .translate([(width/2), (height/2)]);  //set the center of the map to show up in the center of the screen

//set up the path generator function to draw the map outlines
path = d3.geoPath()
    .projection(mercatorProjection);        //tell it to use the projection that we just made to convert lat/long to pixels

var stateLookup = d3.map();

var colorScale = d3.scaleLinear().range(['white','blue']);

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    //.style("opacity", 0);



// declare map variable
var map = L.map('map', {
                  zoomControl: false,
                  center: [10.5,28],
                  zoom: 4
                  });

        // add basemap
        L.tileLayer('https://cartocdn-ashbu.global.ssl.fastly.net/ramirocartodb/api/v1/map/named/tpl_756aec63_3adb_48b6_9d14_331c6cbc47cf/all/{z}/{x}/{y}.png',
        {attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CARTO</a>'})
        .addTo(map);

d3.queue()
    .defer(d3.json, "./GOT_mapfiles/Locations.geojson")
    .defer(d3.json, "./GOT_mapfiles/Regions.geojson")
    .defer(d3.json, "./GOT_mapfiles/Mountains_and_lakes.geojson")
    .defer(d3.json, "./GOT_mapfiles/Continents_and_islands.geojson")
    .defer(d3.json, "./GOT_mapfiles/Ripples.geojson")
    .defer(d3.json, "./GOT_mapfiles/Rivers_and_roads.geojson")
    .defer(d3.json, "./GOT_mapfiles/The_Ice_Wall.geojson")
    .defer(d3.json, "./GOT_tooltipscopy.json")
    //.defer(d3.csv, "./statePop.csv")
    .await(function(err, Locations, Regions, Mountains, Continents, Ripples, Rivers, Ice_Wall, Tooltips){
      console.log(Locations);
      console.log(Regions);
      console.log(Mountains);
      console.log(Continents);
      console.log(Ice_Wall);
      console.log(Tooltips);



      var styleRegion = {
        weight: 1,
        opacity: 1,
        color: 'gold',
        dashArray: '3',
        fillOpacity: 0
    };
      var styleContinents = {
        weight: 1,
        opacity: 1,
        color: 'blue',
        dashArray: '3',
        fillOpacity: 0
    };
      var styleIceWall = {
        weight: 5,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.8
    };


      // L.geoJSON(Mountains).addTo(map);
      L.geoJSON(Continents, styleContinents).addTo(map);
      L.geoJSON(Ice_Wall, styleIceWall).bindPopup('Ice Wall').addTo(map);

      var region = L.geoJSON(Regions, {
        style: styleRegion,
        onEachFeature: onEachFeature
      }).addTo(map);

      Locations.features.forEach(function (d) {
        var latlng = [d.geometry.coordinates[1], d.geometry.coordinates[0]];
        L.circle(latlng, {
            color: 'gray',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 200})
          .bindPopup(d.properties.name)
          .addTo(map);
      });


      var info = L.control();

      info.onAdd = function (map) {
          this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
          this.update();
          return this._div;
      };

      var dataMap = d3.map(Tooltips, function(d) {
        return d.Kingdom;
      });

      // method that we will use to update the control based on feature properties passed
      info.update = function (obj) {
        // this._div.innerHTML = '<h4>Game of Thrones</h4>';
        console.log(obj);

        this._div.innerHTML = '<h4>Game of Thrones</h4>' +  (obj ?
        '<b>' + obj.Kingdom + '</b><br />' + obj.Rulers
        : 'Hover over a state');
      };

      info.addTo(map);


      function onEachFeature(feature, layer, tooltip) {
          layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
      }

      d3.select ('.tooltip')
        .append ('p')
        .text('abc');
      function highlightFeature(e) {

          var layer = e.target;

          var name = layer.feature.properties.name;
          var kingdom = dataMap.get(name);


          info.update(kingdom);

          console.log(kingdom);
          layer.setStyle({
              weight: 5,
              color: '#666',
              dashArray: '',
              fillOpacity: 0.7
          });
      }
      function resetHighlight(e) {
          region.resetStyle(e.target);
          info.update();
      }
      function zoomToFeature(e) {
          map.fitBounds(e.target.getBounds());
      }


  //     L.circle([10.5,28], {radius: 200}).addTo(map);
  //   svg.selectAll(".path_Continents")               //make empty selection
  //       .data(Continents.features)          //bind to the features array in the map data
  //       .enter()
  //       .append("path")                 //add the paths to the DOM
  //       .attr("d", path)                //actually draw them
  //       .attr("class", "path_Continents");
  //
  //       svg.selectAll(".path_Regions")               //make empty selection
  //           .data(Regions.features)          //bind to the features array in the map data
  //           .enter()
  //           .append("path")                 //add the paths to the DOM
  //           .attr("d", path)                //actually draw them
  //           .attr("class", "path_Regions");
  //
  //           svg.selectAll(".path_Mountains")               //make empty selection
  //               .data(Mountains.features)          //bind to the features array in the map data
  //               .enter()
  //               .append("path")                 //add the paths to the DOM
  //               .attr("d", path)                //actually draw them
  //               .attr("class", "path_Mountains");
  //           svg.selectAll(".path_Locations")               //make empty selection
  //                   .data(Locations.features)          //bind to the features array in the map data
  //                   .enter()
  //                   .append("path")                 //add the paths to the DOM
  //                   .attr("d", path)                //actually draw them
  //                   .attr("class", "path_Locations");
  //
  //             svg.selectAll(".path_Ripples")               //make empty selection
  //                   .data(Mountains.features)          //bind to the features array in the map data
  //                   .enter()
  //                   .append("path")                 //add the paths to the DOM
  //                   .attr("d", path)                //actually draw them
  //                   .attr("class", "path_Ripples");
  //             svg.selectAll(".path_Rivers")               //make empty selection
  //                   .data(Mountains.features)          //bind to the features array in the map data
  //                     .enter()
  //                     .append("path")                 //add the paths to the DOM
  //                     .attr("d", path)                //actually draw them
  //                     .attr("class", "path_Rivers");
  //                     svg.selectAll(".path_Ice_Wall")               //make empty selection
  //                           .data(Ice_Wall.features)          //bind to the features array in the map data
  //                             .enter()
  //                             .append("path")                 //add the paths to the DOM
  //                             .attr("d", path)                //actually draw them
  //                             .attr("class", "path_Ice_Wall");
  //
  });
