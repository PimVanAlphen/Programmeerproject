// queue de asynchrone requests, deze worden na elkaar afgehandeld
queue()
    .defer(d3.csv, "dataproject.csv")
    .defer(d3.csv, "indeling.csv")
    .defer(d3.csv, "ICPC.csv")
    .defer(d3.json, "icpcJson2.json")
    .await(ready);

// als de csv files in de queue zijn geladen wordt de "main" uitgevoerd
function ready(error, dataproject, indeling, ICPC, icpcJson) {
  if(error) { console.log(error); }

  //console.log(indeling)
  console.log(icpcJson)
  //console.log(d3.json(icpcJson))

  // maak variabelen voor bepaalde veelgebruikte selecties
  var svgMap = d3.select("body").select("svg");
  var tooltip = d3.select("body").select("div");

  // maak een archief voor berekende totalen
  var archiveTotals = {};
  archiveTotals["one"] = "First";

  // maak variabelen voor bepaalde veelgebruikte opties
  var hoverInfo = {}; // variabele voor de wijk waar je met je muis over hovered
  hoverInfo["name"] = ""; hoverInfo["patientsTotal"] = 0; hoverInfo["patientsSelected"] = 0;
  var mapOption = "#wijk_2008_gen"; // variabele voor welke map je ziet: wijk of buurt

  // Link de data van de wijken en buurten aan de data van de map
  var fillDefault = "#FFFFFF";
  var fillHighlight = "#FF0000";
  svgMap.selectAll(".buurt, .wijk")
      .data(indeling)
      .on("mouseout", function(){
        d3.select(this).style("fill",fillDefault);
        hoverInfo.name = "";
      })
      .on("mouseover", function(d){
        d3.select(this).style("fill",fillHighlight);
        hoverInfo.name = d.naam;
        var code = d.buurtcode;
        if (!(code in archiveTotals)) {
          archiveTotals[code] = getTotal(dataproject, "buurtcode", code)
        }
        hoverInfo.patientsTotal = archiveTotals[code]
      })

  // voeg een knop toe om te kunnen wisselen tussen overzicht op de buurten
  // of de wijken
  var buttonMap = svgMap.append("rect")
      .style("height","20")
      .style("width","20")
      .style("fill","blue")
      .on('click', function(){
        if (mapOption == "#brt_2008_gen"){
          svgMap.select("#brt_2008_gen").style("visibility", "hidden");
          mapOption = "#wijk_2008_gen";
        }
        else if (mapOption == "#wijk_2008_gen"){
          svgMap.select("#brt_2008_gen").style("visibility", "visible");
          mapOption = "#brt_2008_gen";
        };
        console.log("blue/map button clicked")
      })

    var buttonSelect = svgMap.append("rect")
        .style("height","20")
        .style("width","20")
        .style("fill","orange")
        .attr("x", 0)
        .attr("y", 50)
        .on('click', function(){
          console.log("orange/select button clicked");
          showDatatree();
        })
  // voeg een mousemove event aan op de gehele svg om de tooltip aan te kunnen passen,
  // dit hoeft alleen te gebeuren als je met de muis beweegt!
  svgMap.on("mousemove", function(d){
        if (hoverInfo.name == ""){
          tooltip.style("visibility", "hidden");
        }
        else {
          var mouseXY = d3.mouse(this)
          tooltip.style("visibility", "visible")
            .style("left", (event.clientX + 20) + "px")
            .style("top", (event.clientY + 20) + "px")
            .text(hoverInfo.name);
        };
      })

  // http://bl.ocks.org/mbostock/4339184
  showDatatree = function() {
    //svgMap.style("visibility","hidden")
    d3.select("body").append("div").attr("id","tree-container")

    // Calculate total nodes, max label length
    var totalNodes = 0;
    var maxLabelLength = 0;
    // panning variables
    var panSpeed = 200;
    var panBoundary = 20; // Within 20px from edges will pan when dragging.
    // Misc. variables
    var i = 0;
    var duration = 750;
    var root;

    // size of the diagram
    var viewerWidth = $(document).width();
    var viewerHeight = $(document).height();

    var tree = d3.layout.tree()
        .size([viewerHeight, viewerWidth]);

    // define a d3 diagonal projection for use by the node paths later on.
    var diagonal = d3.svg.diagonal()
        .projection(function(d) {
            return [d.y, d.x];
        });

    // A recursive helper function for performing some setup by walking through all nodes
    function visit(parent, visitFn, childrenFn) {
        if (!parent) return;

        visitFn(parent);

        var children = childrenFn(parent);
        if (children) {
            var count = children.length;
            for (var i = 0; i < count; i++) {
                visit(children[i], visitFn, childrenFn);
            }
        }
    }

    // Call visit function to establish maxLabelLength
    visit(icpcJson, function(d) {
        totalNodes++;
        maxLabelLength = Math.max(d.name.length, maxLabelLength);

    }, function(d) {
        return d.children && d.children.length > 0 ? d.children : null;
    });

    // TODO: Pan function, can be better implemented.

    function pan(domNode, direction) {
        var speed = panSpeed;
        if (panTimer) {
            clearTimeout(panTimer);
            translateCoords = d3.transform(svgGroup.attr("transform"));
            if (direction == 'left' || direction == 'right') {
                translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
                translateY = translateCoords.translate[1];
            } else if (direction == 'up' || direction == 'down') {
                translateX = translateCoords.translate[0];
                translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
            }
            scaleX = translateCoords.scale[0];
            scaleY = translateCoords.scale[1];
            scale = zoomListener.scale();
            svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
            d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
            zoomListener.scale(zoomListener.scale());
            zoomListener.translate([translateX, translateY]);
            panTimer = setTimeout(function() {
                pan(domNode, speed, direction);
            }, 50);
        }
    }

    // Define the zoom function for the zoomable tree
    function zoom() {
        svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }

    // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
    var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

    // define the baseSvg, attaching a class for styling and the zoomListener
    var baseSvg = d3.select("#tree-container").append("svg")
        .attr("width", viewerWidth)
        .attr("height", viewerHeight)
        .attr("class", "overlay")
        .call(zoomListener);

    // Helper functions for collapsing and expanding nodes.
    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }

    function expand(d) {
        if (d._children) {
            d.children = d._children;
            d.children.forEach(expand);
            d._children = null;
        }
    }

    // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.
    function centerNode(source) {
        scale = zoomListener.scale();
        x = -source.y0;
        y = -source.x0;
        x = x * scale + viewerWidth / 2;
        y = y * scale + viewerHeight / 2;
        d3.select('g').transition()
            .duration(duration)
            .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
        zoomListener.scale(scale);
        zoomListener.translate([x, y]);
    }

    // Toggle children function
    function toggleChildren(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else if (d._children) {
            d.children = d._children;
            d._children = null;
        }
        return d;
    }

    // Toggle children on click.
    function click(d) {
        if (d3.event.defaultPrevented) return; // click suppressed
        d = toggleChildren(d);
        update(d);
        centerNode(d);
    }

    function update(source) {
        // Compute the new height, function counts total children of root node and sets tree height accordingly.
        // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
        // This makes the layout more consistent.
        var levelWidth = [1];
        var childCount = function(level, n) {

            if (n.children && n.children.length > 0) {
                if (levelWidth.length <= level + 1) levelWidth.push(0);

                levelWidth[level + 1] += n.children.length;
                n.children.forEach(function(d) {
                    childCount(level + 1, d);
                });
            }
        };
        childCount(0, root);
        var newHeight = d3.max(levelWidth) * 25; // 25 pixels per line
        tree = tree.size([newHeight, viewerWidth]);

        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

        // Set widths between levels based on maxLabelLength.
        nodes.forEach(function(d) {
            d.y = (d.depth * (maxLabelLength * 10)); //maxLabelLength * 10px
            // alternatively to keep a fixed scale one can set a fixed depth per level
            // Normalize for fixed-depth by commenting out below line
            // d.y = (d.depth * 500); //500px per level.
        });

        // Update the nodes…
        node = svgGroup.selectAll("g.node")
            .data(nodes, function(d) {
                return d.id || (d.id = ++i);
            });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
            // check this later: .call(dragListener)
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            })
            .on('click', click);

        nodeEnter.append("circle")
            .attr('class', 'nodeCircle')
            .attr("r", 0)
            .style("fill", function(d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

        nodeEnter.append("text")
            .attr("x", function(d) {
                return d.children || d._children ? -10 : 10;
            })
            .attr("dy", ".35em")
            .attr('class', 'nodeText')
            .attr("text-anchor", function(d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function(d) {
                return d.name;
            })
            .style("fill-opacity", 0);

        // phantom node to give us mouseover in a radius around it
        nodeEnter.append("circle")
            .attr('class', 'ghostCircle')
            .attr("r", 10)
            .attr("opacity", 0.5) // change this to zero to hide the target area
        .style("fill", "black")

        // Update the text to reflect whether node has children or not.
        node.select('text')
            .attr("x", function(d) {
                return d.children || d._children ? -10 : 10;
            })
            .attr("text-anchor", function(d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function(d) {
                return d.name;
            });

        // Change the circle fill depending on whether it has children and is collapsed
        node.select("circle.nodeCircle")
            .attr("r", 4.5)
            .style("fill", function(d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

          // Transition nodes to their new position.
          var nodeUpdate = node.transition()
              .duration(duration)
              .attr("transform", function(d) {
                  return "translate(" + d.y + "," + d.x + ")";
              });

          // Fade the text in
          nodeUpdate.select("text")
              .style("fill-opacity", 1);

          // Transition exiting nodes to the parent's new position.
          var nodeExit = node.exit().transition()
              .duration(duration)
              .attr("transform", function(d) {
                  return "translate(" + source.y + "," + source.x + ")";
              })
              .remove();

          nodeExit.select("circle")
              .attr("r", 0);

          nodeExit.select("text")
              .style("fill-opacity", 0);

          // Update the links…
          var link = svgGroup.selectAll("path.link")
              .data(links, function(d) {
                  return d.target.id;
              });

          // Enter any new links at the parent's previous position.
          link.enter().insert("path", "g")
              .attr("fill","none")
              .attr("stroke","black")
              .attr("class", "link")
              .attr("d", function(d) {
                  var o = {
                      x: source.x0,
                      y: source.y0
                  };
                  return diagonal({
                      source: o,
                      target: o
                  });
              });

          // Transition links to their new position.
          link.transition()
              .duration(duration)
              .attr("d", diagonal);

          // Transition exiting nodes to the parent's new position.
          link.exit().transition()
              .duration(duration)
              .attr("d", function(d) {
                  var o = {
                      x: source.x,
                      y: source.y
                  };
                  return diagonal({
                      source: o,
                      target: o
                  });
              })
              .remove();

          // Stash the old positions for transition.
          nodes.forEach(function(d) {
              d.x0 = d.x;
              d.y0 = d.y;
          });
      }

      // Append a group which holds all nodes and which the zoom Listener can act upon.
      var svgGroup = baseSvg.append("g");

      // Define the root
      root = icpcJson;
      root.x0 = viewerHeight / 2;
      root.y0 = 0;

      // Layout the tree initially and center on the root node.
      update(root);
      centerNode(root);
  };

  // maak een box waar de search en select engine in komt.
  // maak alvast een vak voor invoer, een knop voor de tree view, en een selection box

  // maak een box waar de bar chart in moet komen
}

// deze functie pakt een dataset en een variabele naam uit die dataset (bv: buurtcode
// uit de dataset dataproject). De derde waarde die je in moet vullen is waar op
// gezocht moet worden. Vervolgens kijkt deze functie hoeveel variabelen uit de
// categorie uit de dataset beginnen met de waarde.
getTotal = function(dataset, dataname, itemname){ // eg. (dataproject, "buurtcode", 12)
  var total = 0;
  var chars = itemname.length
  for (var i = 0, l = dataset.length; i < l; i++){
    var comparison = dataset[i][dataname].substring(0, chars);
    if (comparison == itemname) {total++};
  }
  return total
}

splitString = function(string, slen){
  var splitname = string.split(' ');
  var counter = 0, split1 = "", split2 = "";
  for (var i = 0, l = splitname.length; i < l; i++){
    counter += splitname[i].length;
    if (counter < slen) {split1 = split1 + splitname[i] + " "}
    else {split2 = split2 + splitname[i] + " "};
  }
  return (split1 + "\n" + split2);
}
