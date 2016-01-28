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

  // maak variabelen voor bepaalde veelgebruikte selecties
  var svgMap = d3.select("body").select("svg");
  var tooltip = d3.select("body").select(".map-hoverover");

  // color specifications by Cynthia Brewer (http://colorbrewer.org/).
  // range van kleuren die worden gebruikt voor de map.
  var colorScheme = ["#f0f9e8","#08589e"]

  // maak een archief voor berekende totalen en berekende ratios. Twee verschillende objecten,
  // omdat er twee staten zijn van de map.
  // "aantal"["buurtcode"] geeft het aantal patienten in een wijk (zie indeling.csv)
  // "highest/lowest wijk/buurt"["icpcCode"] geeft de laagste en hoogste waardes van de geselecteerde aandoening
  // archive*["buurtcode"]["icpcCode"] geeft van de buurt het aantal patienten met de geselecteerde klacht
  var archiveTotals = {"aantal":{},"highestBuurt":{},"lowestBuurt":{},"highestWijk":{},"lowestWijk":{}};
  var archiveRatios = {"highestBuurt":{},"lowestBuurt":{},"highestWijk":{},"lowestWijk":{}};
  var archiveNames = {}
  for ( var i = 0, l = indeling.length; i < l; i++ ){
    archiveTotals[indeling[i].buurtcode] = {};
    archiveTotals["aantal"][indeling[i].buurtcode] = indeling[i].aantal;
    archiveRatios[indeling[i].buurtcode] = {};
    archiveNames[indeling[i].buurtcode] = indeling[i].naam;
  }

  // maak variabelen voor bepaalde veelgebruikte opties
  var hoverInfo = {}; // variabele voor de wijk waar je met je muis over hovered
  hoverInfo["name"] = ""; hoverInfo["patientsTotal"] = 0; hoverInfo["patientsSelected"] = 0;
  var mapOption = "#wijk_2008_gen"; // variabele voor welke map je ziet: wijk of buurt
  var codeOption = "" // variabele voor welke icpcCode er geselecteerd is
  var mapRatio = false // variabele voor welke waardes je wilt zien (absoluut/relatief)
  var nameBarchart = ""

  // maak variabelen aan voor het bijhouden van kleuren op de map
  var fillPreviousMap = "#FFFFFF";
  var fillPreviousBar = "#FFFFFF";
  var fillHighlight = "#FF0000";

  // Link de data van de wijken en buurten aan de data van de map
  svgMap.selectAll(".buurt, .wijk")
      .data(indeling)
      .on("mouseout", function(d){
        // ga weer terug naar de onspronkelijke kleur
        d3.select(this).style("fill",fillPreviousMap);
        // reset de info van de tooltip
        hoverInfo.name = "";
        hoverInfo.patientsTotal = 0;
        hoverInfo.patientsSelected = "";
        var barSubSelector = mapRatio ? "ratio" : "totaal"
        var barSelector = "#bar" + d.buurtcode + barSubSelector
        d3.select(barSelector).style("fill",fillPreviousBar)
      })
      .on("mouseover", function(d){
        // onthoud de kleur en geef highlight
        fillPreviousMap = (d3.select(this).style("fill"));
        d3.select(this).style("fill",fillHighlight);
        // geef gegevens van de map door aan de tooltip variabelen
        hoverInfo.name = d.naam;
        hoverInfo.patientsTotal = d.aantal;
        if (codeOption != "") {
          if (mapRatio == false) {hoverInfo.patientsSelected = archiveTotals[d.buurtcode][codeOption]}
          else {hoverInfo.patientsSelected = archiveRatios[d.buurtcode][codeOption]}
        }
        var barSubSelector = mapRatio ? "ratio" : "totaal"
        var barSelector = "#bar" + d.buurtcode + barSubSelector
        fillPreviousBar = d3.select(barSelector).style("fill")
        d3.select(barSelector).style("fill",fillHighlight)
      })

  // voeg een knop toe om te kunnen wisselen tussen overzicht op de buurten
  // of de wijken
  buttonMap = function(){
        var button = document.getElementById('mapButton')
        if (mapOption == "#brt_2008_gen"){
          svgMap.select("#brt_2008_gen").style("visibility", "hidden");
          mapOption = "#wijk_2008_gen";
          button.innerHTML = "Wijken van Haarlem"
        }
        else if (mapOption == "#wijk_2008_gen"){
          svgMap.select("#brt_2008_gen").style("visibility", "visible");
          mapOption = "#brt_2008_gen";
          button.innerHTML = "Buurten van Haarlem"
        };
        // als er een code is geselecteerd worden de wijken of buurten ingekleurd
        if (codeOption != "") {
          var archive = mapRatio == false ? archiveTotals : archiveRatios;
          fillColor(archive)
        }
        if (codeOption != "") {
          showBarchart()
          mapLegend()
        }
      }

  // wissel tussen een absolute of een relatieve weergave van het aantal van de
  // geselecteerde episodes.
  buttonRatio = function(){
        mapRatio = !(mapRatio)
        console.log("mapratio is: " + mapRatio)
        // kleur de wijken en buurten
        var archive = mapRatio == false ? archiveTotals : archiveRatios;
        fillColor(archive)
        var button = document.getElementById('ratioButton')
        if (mapRatio) {button.innerHTML = "Episoden per Patient"} else {button.innerHTML = "Totaal aantal Episoden"}
        if (codeOption != "") {
          showBarchart()
          mapLegend()
        }
      }

  // Deze functie neemt als input de geselecteerde code, het kleurenschema, of de
  // buurten of wijken weergegeven moeten worden en het archief. Vervolgens maakt
  // het een schaal op basis van de minimale en maximale waardes en kleurt de wijken
  // of buurten naargelang de schaal in.
  fillColor = function(archive){
    if (mapOption == "#brt_2008_gen"){var rangeSelection = ["lowestBuurt","highestBuurt",".buurt"]}
    else {var rangeSelection = ["lowestWijk","highestWijk",".wijk"]}
    var colorScale = d3.scale.linear().range(colorScheme);
        colorScale.domain([archive[rangeSelection[0]][codeOption], archive[rangeSelection[1]][codeOption]])
    svgMap.selectAll(rangeSelection[2]).style("fill", function(d){return colorScale(archive[d.buurtcode][codeOption])})

  }

  legendMade = false
  mapLegend = function(){
    if (!legendMade) {
      var width = 100,
          height = 350;

      var svg = d3.select(".mapLegend")
          .style("visibility","visible")
        .append("svg")
          .attr("width", width)
          .attr("height", height);

      var gradient = svg.append("defs")
        .append("linearGradient")
          .attr("id", "gradient")
          .attr("x1", "0%")
          .attr("y1", "100%")
          .attr("x2", "0%")
          .attr("y2", "0%")
          .attr("spreadMethod", "pad");

      gradient.append("stop")
          .attr("offset", "0%")
          .attr("stop-color", colorScheme[0])
          .attr("stop-opacity", 1);

      gradient.append("stop")
          .attr("offset", "100%")
          .attr("stop-color", colorScheme[1])
          .attr("stop-opacity", 1);

      svg.append("rect")
          .attr("width", 20)
          .attr("height", 250)
          .attr("transform", "translate( 0," + 10 + ")")
          .style("fill", "url(#gradient)")
          .style("stroke", "black")
          .style("stroke-width", "2");

      legendMade = true
    }

    if (mapOption == "#brt_2008_gen"){var rangeSelection = ["lowestBuurt","highestBuurt",".buurt"]}
    else {var rangeSelection = ["lowestWijk","highestWijk",".wijk"]}
    var archive = mapRatio == false ? archiveTotals : archiveRatios;
    var y = d3.scale.linear().range([250, 0]).domain([archive[rangeSelection[0]][codeOption], archive[rangeSelection[1]][codeOption]]);
		var yAxis = d3.svg.axis().scale(y).orient("right").tickValues(y.domain());
    var axisText = mapRatio == false ? "Totaal aantal episodes" : "Episodes per patient";

    d3.select("#mapLegendAxis").remove()

		d3.select(".mapLegend").select("svg").append("g").attr("id","mapLegendAxis").attr("class", "y axis").attr("transform", "translate(" + 30 + " ," + 10 + ")").call(yAxis)
      .append("text").attr("transform", "rotate(-90)").attr("y", 10).attr("x", -50).attr("dy", ".71em").style("text-anchor", "end").style("font-size", "14px").text(axisText);
  }

  // voeg een mousemove event aan op de gehele svg om de tooltip aan te kunnen passen,
  // dit hoeft alleen te gebeuren als je met de muis beweegt!
  svgMap.on("mousemove", function(d){
        if (hoverInfo.name == ""){
          tooltip.style("visibility", "hidden");
        }
        else {
          tooltip.style("visibility", "visible")
            // neem de absolute waardes zodat de tooltip altijd mooi achter de muis beweegt.
            .style("left", (event.clientX + 20) + "px")
            .style("top", (event.clientY + 20) + "px")
            .html( function(){
              // pas de tekst op de tooltip aan op basis van de weergave van de waardes
              if (hoverInfo.patientsSelected != "") {
                if (mapRatio == false) {return "naam: " + hoverInfo.name + "<br/>" + "aantal patienten: " + hoverInfo.patientsTotal + "<br/>" + "geselecteerde episoden " + codeOption + ": " + hoverInfo.patientsSelected}
                else {return "naam: " + hoverInfo.name + "<br/>" + "aantal patienten: " + hoverInfo.patientsTotal + "<br/>" + "episoden " + codeOption + " per patient: " + hoverInfo.patientsSelected}
              }
              else {return "naam: " + hoverInfo.name + "<br/>" + "aantal patienten: " + hoverInfo.patientsTotal}
            });
        };
      })

    // http://bl.ocks.org/mbostock/3885304
    // http://bl.ocks.org/RandomEtc/cff3610e7dd47bef2d01
  var barShown = false

  var barMargin = {top: 50, right: 100, bottom: 200, left: 70},
    barWidth = 960 - barMargin.left - barMargin.right,
    barHeight = 500 - barMargin.top - barMargin.bottom;

  var barX0 = d3.scale.ordinal()
      .rangeRoundBands([0, barWidth], .1);
  var barX1 = d3.scale.ordinal();
  var barY0 = d3.scale.linear()
      .range([barHeight, 0]);
  var barY1 = d3.scale.linear()
      .range([barHeight, 0]);
  var barColor = d3.scale.ordinal()
      .range(["#98abc5", "#8a89a6"])
  var barXAxis = d3.svg.axis()
      .scale(barX0)
      .orient("bottom");
  var barY0Axis = d3.svg.axis()
      .scale(barY0)
      .orient("left").ticks(5)
  var barY1Axis = d3.svg.axis()
      .scale(barY1)
      .orient("right").ticks(5)
  var barSvg = d3.select("body").append("svg")
      .attr("width", barWidth + barMargin.left + barMargin.right)
      .attr("height", barHeight + barMargin.top + barMargin.bottom)
    .append("g")
      .attr("transform", "translate(" + barMargin.left + "," + barMargin.top + ")");

  var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<strong>" + d.name + "</strong> <span style='color:red'>" + d.value + "</span>";
      })

  barSvg.call(tip);

  barSvg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + barHeight + ")")

  var yAxisLeft = barSvg.append("g")
      .attr("class", "y0 axis")

  var yAxisRight = barSvg.append("g")
      .attr("class", "y1 axis")

  var axesMade = false

  showBarchart = function() {
    if (codeOption == "") {return}

    var optionNames = ["totaal","ratio"]

    var dataObject = []
    var codeLength = mapOption == "#wijk_2008_gen" ? 1 : 2
    var archiveKeys = Object.keys(archiveTotals);
    for ( var i = 0, l = archiveKeys.length; i < l; i++ ){
      if (archiveKeys[i].length == codeLength) {
        var key = archiveKeys[i]
        dataObject.push({"naam": archiveNames[key] ,"totaal": archiveTotals[key][codeOption], "ratio":archiveRatios[key][codeOption], "code":key})
      }
    }

    if (mapRatio) {
      dataObject = dataObject.sort(function (a, b) {
        return d3.ascending(a.ratio, b.ratio);
      })
    }
    else {
      dataObject = dataObject.sort(function (a, b) {
          return d3.descending(a.totaal, b.totaal);
      })
    }

    dataObject.forEach(function(d) {
      d.option = optionNames.map(function(name) { return {name: name, value: +d[name]}; });
    });

    var yDomainOption = mapOption == "#wijk_2008_gen" ? "highestWijk" : "highestBuurt"
    var xDomainBounds = mapOption == "#wijk_2008_gen" ? [0,8] : [9,48]
    barX0.domain(dataObject.map(function(d) { return d.naam}) )
    barX1.domain(optionNames).rangeRoundBands([0, barX0.rangeBand()]);
    barY0.domain([0, archiveTotals[yDomainOption][codeOption]]);
    barY1.domain([0, archiveRatios[yDomainOption][codeOption]]);

    barSvg.select('.x.axis').transition().duration(300).call(barXAxis);
    barSvg.select('.x.axis').selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)" )
    yAxisLeft.transition().duration(300)
        .attr("transform", "translate(" + (-15) + " ,0)")
        .call(barY0Axis)
    yAxisRight.transition().duration(300)
        .attr("transform", "translate(" + (barWidth + 15) + " ,0)")
        .call(barY1Axis)

    if (!axesMade){
      yAxisLeft.insert("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Totaal aantal Episodes");
      yAxisLeft.insert("text")
          .attr("id","chartName")
          .attr("transform", "translate(0,-30)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "begin")
          .style("font-size","16px")
          .style("font-weight","bold")
      yAxisRight.append("text")
          .attr("transform", "rotate(90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "begin")
          .text("Episodes per Patient");

      axesMade = true;
    }

    yAxisLeft.select("#chartName").text(nameBarchart);

    var state = barSvg.selectAll(".state")
        .data(dataObject)

    state.exit()
       .transition()
         .duration(300)
       .attr("y", barY0(0))
       .attr("height", barHeight - barY0(0))
       .style('fill-opacity', 1e-6)
       .remove();

    state.enter().append("g")
      .attr("class", "state")

    state.transition().duration(300).attr("x", function(d) { return barX0(d.naam); })
        .attr("transform", function(d) { return "translate(" + barX0(d.naam) + ",0)"; });

    var bars = state.selectAll("rect")
        .data(function(d) { return d.option; })

    bars.exit()
        .transition()
          .duration(300)
        .attr("y", barY0(0))
        .attr("height", barHeight - barY0(0))
        .style('fill-opacity', 1e-6)
        .remove();

    bars.enter().append("rect")
        .attr("class", "bar")
        .style("fill", function(d) { return barColor(d.name); })
        .on('mouseover', function(d){
          d3.select(this).style("fill",fillHighlight)
          var mapCode = "#B" + d3.select(this.parentNode).datum().code
          fillPreviousMap = d3.select(mapCode).style("fill")
          d3.select(mapCode).style("fill",fillHighlight)
          tip.show(d);
        })
        .on('mouseout', function(d){
          d3.select(this).style("fill",function(){
            if (d.name == "totaal") {return "#98abc5"}
            else {return "#8a89a6"}
          })
          var mapCode = "#B" + d3.select(this.parentNode).datum().code
          d3.select(mapCode).style("fill",fillPreviousMap)
          tip.hide(d);
        })

    bars.transition().duration(300)
        .attr("x", function(d) { return barX1(d.name); })
        .attr("width", barX1.rangeBand())
        .attr("y", function(d) {
           if (d.name == "totaal") {return barY0(d.value)}
           else {return barY1(d.value)};
         })
        .attr("height", function(d) {
           if (d.name == "totaal") {return barHeight - barY0(d.value)}
           else {return barHeight - barY1(d.value)};
         })

    bars.attr("id", function(d){console.log(("bar" + (d3.select(this.parentNode).datum().code) + (d.name))); return ("bar" + (d3.select(this.parentNode).datum().code) + (d.name))})

    var legend = barSvg.selectAll(".legend")
         .data(optionNames.slice().reverse())
       .enter().append("g")
         .attr("class", "legend")
         .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

     legend.append("rect")
         .attr("x", barWidth + 87)
         .attr("width", 18)
         .attr("height", 18)
         .style("fill", barColor);

     legend.append("text")
         .attr("x", barWidth + 85)
         .attr("y", 9)
         .attr("dy", ".35em")
         .style("text-anchor", "end")
         .text(function(d) { return d; })
         .style("font-size", "13px")
         .style("font-weight", "bold")

  }


  // https://twitter.github.io/typeahead.js/examples/
  var substringMatcher = function(strs) {
    return function findMatches(q, cb) {
      var matches, substringRegex;

      // an array that will be populated with substring matches
      matches = [];

      // regex used to determine if a string contains the substring `q`
      substrRegex = new RegExp(q, 'i');

      // iterate through the pool of strings and for any string that
      // contains the substring `q`, add it to the `matches` array
      $.each(strs, function(i, str) {
        if (substrRegex.test(str)) {
          matches.push(str);
        }
      });

      cb(matches);
    };
  };

  var searchIcpcCodes = [];
  for (var i = 0, l = ICPC.length; i < l; i++) {
    if (ICPC[i].ICPCcode.length > 3) {continue}
    var tmpString = ICPC[i].ICPCcode + ": " + ICPC[i].naam
    searchIcpcCodes.push(tmpString)
  }

  $('#scrollable-dropdown-menu .typeahead').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    name: 'searchIcpcCodes',
    limit: 30,
    source: substringMatcher(searchIcpcCodes)
  }).on('typeahead:selected', function(event, data){
        nameBarchart = data
        var tmpString = data.split(':', 1)
        codeOption = tmpString[0]
        if (!(codeOption in archiveTotals[1])) {
          getTotalCode(archiveTotals, codeOption, dataproject)
          getTotalRatio(archiveTotals, archiveRatios, codeOption)
        }
        // kleur de wijken en buurten aan de hand van de code
        var archive = mapRatio == false ? archiveTotals : archiveRatios;
        fillColor(archive)
        showBarchart()
        mapLegend()
    });

}
// deze functie neemt als argumenten het archief object (hier dict genoemd), de
// geselecteerde code en de dataset waarin deze code gezocht moet worden. De functie
// telt vervolgens hoe vaak de code in combinatie met de buurtcode in de dataset voorkomt,
// waarbij alles na de code getrunceerd wordt (dus code A geeft A*).
getTotalCode = function(dict, icpcCode, dataset){ // eg. (archiveTotals, 'A', dataproject)
  var dictKeys = Object.keys(dict);
  var lowestWijk = 1000, highestWijk = 0, lowestBuurt = 1000, highestBuurt = 0;
  for (var i = 0, lk = dictKeys.length; i < lk; i++) {
    if (dictKeys[i].length > 2) {continue}
    var total = 0;
    // loop door de hele dataset en zoek naar regels waarbij zowel de buurt als
    // getrunceerde icpcCode overeenkomen
    for (var j = 0, ld = dataset.length; j < ld; j++){
      var buurtcodeComparison = dataset[j]["buurtcode"].substring(0, dictKeys[i].length);
      var icpcCodeComparison = dataset[j]["episode"].substring(0, icpcCode.length);
      if (buurtcodeComparison == dictKeys[i] && icpcCodeComparison == icpcCode) {total++};
    }
    // rond getallen onder de 5 af naar 5
    if (total < 5) {total = 5};
    dict[dictKeys[i]][icpcCode] = total;
    // stel de laagste een hoogste waarden voor zowel de buurten als de wijken bij
    if (dictKeys[i].length == 2) {
      if (total < lowestBuurt){lowestBuurt = total};
      if (total > highestBuurt){highestBuurt = total};
    }
    else if (dictKeys[i].length == 1) {
      if (total < lowestWijk){lowestWijk = total};
      if (total > highestWijk){highestWijk = total};
    }
  }
  // voer de laagste en hoogste waarden voor de buurten en wijken in in het
  // archief object. Deze zijn nodig om later het domein voor de kleurschalen
  // te bepalen.
  dict["highestBuurt"][icpcCode] = highestBuurt;
  dict["lowestBuurt"][icpcCode] = lowestBuurt;
  dict["highestWijk"][icpcCode] = highestWijk;
  dict["lowestWijk"][icpcCode] = lowestWijk;
}


// Neemt als argumenten de beide archieven en de geselecteerde code. Berekent vervolgens
// de verhouding van het aantal geselecteerde aandoeningen in de wijk of buurt ten opzichte
// van het totaal aantal patienten in de wijk of buurt. Dit aantal kan dus hoger zijn dan 1,
// bv in het geval dat gezocht wordt op groepen aandoeningen (mensen kunnen bv meerdere malen
// zijn geweest voor een algemen klacht)
getTotalRatio = function(dictTotal, dictRatio, icpcCode) {
  var dictKeys = Object.keys(dictTotal);
  var lowestWijk = 1000, highestWijk = 0, lowestBuurt = 1000, highestBuurt = 0;
  for (var i = 0, lk = dictKeys.length; i < lk; i++) {
    if (dictKeys[i].length > 2) {continue}
    var ratioValue = dictTotal[dictKeys[i]][icpcCode] / dictTotal["aantal"][dictKeys[i]]
    dictRatio[dictKeys[i]][icpcCode] = ratioValue.toFixed(2)
    if (dictKeys[i].length == 2) {
      if (ratioValue < lowestBuurt){lowestBuurt = ratioValue};
      if (ratioValue > highestBuurt){highestBuurt = ratioValue};
    }
    else if (dictKeys[i].length == 1) {
      if (ratioValue < lowestWijk){lowestWijk = ratioValue};
      if (ratioValue > highestWijk){highestWijk = ratioValue};
    }
  }
  dictRatio["highestBuurt"][icpcCode] = highestBuurt;
  dictRatio["lowestBuurt"][icpcCode] = lowestBuurt;
  dictRatio["highestWijk"][icpcCode] = highestWijk;
  dictRatio["lowestWijk"][icpcCode] = lowestWijk;
}
