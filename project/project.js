// queue de asynchrone requests, deze worden na elkaar afgehandeld
queue()
    .defer(d3.csv, "dataproject.csv")
    .defer(d3.csv, "indeling.csv")
    .defer(d3.csv, "ICPC.csv")
    .defer(d3.json, "icpcJson.json")
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

    var width = 500,
        height = 4000;

    var cluster = d3.layout.cluster()
        .size([height, width - 160]);

    var diagonal = d3.svg.diagonal()
        .projection(function(d) { return [d.y, d.x]; });

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(40,0)");

    var nodes = cluster.nodes(icpcJson),
        links = cluster.links(nodes);

    var link = svg.selectAll(".link")
        .data(links)
      .enter().append("path")
        .attr("class", "link")
        .attr("d", diagonal);

    var node = svg.selectAll(".node")
        .data(nodes)
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

    node.append("circle")
        .attr("r", 4.5);

    node.append("text")
        .attr("dx", function(d) { return d.children ? -8 : 8; })
        .attr("dy", 3)
        .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
    .text(function(d) {
        if (d.name.length > 35) {
          var split = splitString(d.name, 35)
          console.log(d.code + ": "+ split)
          return (d.code + ": "+ split)
        }
        return d.code+": "+d.name;
    });

  }

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
