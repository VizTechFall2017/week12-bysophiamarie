var width = document.getElementById('svg1').clientWidth;
var height = document.getElementById('svg1').clientHeight;

var marginLeft = 0;
var marginTop = 0;

var links;
var nodes;

var svg = d3.select('svg')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2))
    .alpha(0.2);

//import the data from the .csv file
d3.csv('./GOT_houses_final2.csv', function(error, dataIn){
  graph = {"nodes" : [], "links" : []};

  nodes=[];

  dataIn.forEach(function(d){
    nodes.push({ "id": d.source});
    nodes.push({ "id": d.target });
  });

  console.log (nodes);

  var nodes= d3.nest ()
   .key(function(d) {return d.id})
   .entries (nodes);

   console.log (nodes);


dataIn.forEach(function (d) {
    graph.links.push({ "source": d.source,
                      "target": d.target,
                      "value": d.value });
 });

 nodes.forEach (function (d) {
   graph.nodes.push({ "id": d.key });
 });


if (error) throw error;
  console.log (graph);


    //console.log(graph.links);
    //console.log(graph.nodes);

    simulation.nodes(graph.nodes)
              .on("tick", ticked);


    simulation.force("link")
              .links(graph.links);

    link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter()
        .append("line")
        .style('stroke','black')
        .style("stroke-width", function(d) { return Math.sqrt(d.value); });

    node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("r", 5)
        .attr("fill", function(d) {
          if (d.id=="Dorne"){return "yellow";}
          else if (d.id=="The Iron Islands") {return "blue";}
          else if (d.id=="The Crownlands") {return "red";}
          else if (d.id=="The Riverlands") {return "green";}
          else if (d.id=="The The North") {return "burgundy";}
          else if (d.id=="The Westerlands") {return "purple";}
          else if (d.id=="The Stormlands") {return "orange";}
          else if (d.id=="The Reach") {return "brown";}
          else if (d.id=="The Neck") {return "pink";}
          else if (d.id=="The Vale") {return "coral";}
          else {return "black";}})
         .call(d3.drag()
            .on("start", dragstarted)
           .on("drag", dragged)
           .on("end", dragended));

    node.append("title")
        .text(function(d) { return d.id; });

    function ticked() {
      // console.log('ticked');

        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("cx", function(d) { return d.x = Math.max(5, Math.min (width - 5, d.x)); })
            .attr("cy", function(d) { return d.y = Math.max(5, Math.min (height - 5, d.y))});
    }

    //d3.select('.svgBox').html('testing testing');

});


function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}
