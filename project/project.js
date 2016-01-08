queue()
    .defer(d3.csv, "dataproject.csv")
    .defer(d3.csv, "indeling.csv")
    .defer(d3.csv, "ICPC.csv")
    .await(ready);

function ready(error, dataproject, indeling, ICPC) {
  if (error) throw error;

  var svgMap = d3.select("body").select("svg")

  console.log(dataproject.length, indeling.length, ICPC.length)

  // Link de data van de wijken en buurten aan de data van de map

  svgMap.selectAll(".buurt, .wijk")
      .data(indeling)
      .each(function(d){console.log(d.naam)})

  console.log(svgMap.selectAll(".buurt, .wijk").size())
  // maak een functie die ervoor kan zorgen dat de map switched tussen wijk en buurt view
  // zorg ervoor dat er een tooltip zichtbaar is op het moment dat je over een wijk hovered

  // maak een box waar de search en select engine in komt.
  // maak alvast een vak voor invoer, een knop voor de tree view, en een selection box

  // maak een box waar de bar chart in moet komen
}
