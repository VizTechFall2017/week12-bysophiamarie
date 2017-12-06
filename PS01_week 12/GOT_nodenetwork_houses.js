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
        .attr("r", 7)
        .attr("fill", function(d) {
          if (d.id=="Dorne"){return "darkgoldenrod";}
          else if (d.id=="The Iron Islands") {return "lightseagreen";}
          else if (d.id=="The Crownlands") {return "firebrick";}
          else if (d.id=="The Riverlands") {return "darkgreen";}
          else if (d.id=="The North") {return "lightslategray";}
          else if (d.id=="The Westerlands") {return "plum";}
          else if (d.id=="The Stormlands") {return "cornflowerblue";}
          else if (d.id=="The Reach") {return "olive";}
          else if (d.id=="The Neck") {return "indianred";}
          else if (d.id=="The Vale") {return "indigo";}
          else {return "honeydew";}})
          .attr("stroke", "black")
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

// svg.append("rect")
//     .attr("width", "30%")
//     .attr("height", "30%")
//     .attr("fill", "ghostwhite")
//     .attr("stroke", "black");
//
//     var legend = d3.append('svg')
//     .append("g")
//     .selectAll("g")
//     .data(color.domain())
//     .enter()
//     .append('g')
//       .attr('class', 'legend')
//       .attr('transform', function(d, i) {
//         var height = legendRectSize;
//         var x = 0;
//         var y = i * height;
//         return 'translate(' + x + ',' + y + ')';
    // });

//     legend.append('rect')
//     .attr('width', legendRectSize)
//     .attr('height', legendRectSize)
//     .text("Game of Thrones")
//     .style('fill', color)
//     .style('stroke', color);
//
// legend.append('text')
//     .attr('x', legendRectSize + legendSpacing)
//     .attr('y', legendRectSize - legendSpacing)
//     .text(function(d) { return d.node;});
