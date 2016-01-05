# Design

## Componenten Visualisatie
Hieronder staan de componenten van de visualisatie uitgewerkt

### Map
De map geeft een visuele weergave van haarlem.

- Interactie: 
  - Hover: Hover over een wijk om een tooltip te laten zien met het aantal patienten in die wijk, de gemiddelde leeftijd van de patienten in die wijk en, mits er een ICPC code geselecteerd is, het aantal patienten (absoluut en relatief) die in die wijk die code als episode hebben. Hover over een wijk om de bar van de desbtreffende wijk op te laten lichten. 
  - Click: click op een wijk om deze toe te voegen aan de wijk selectie. De wijk selectie bepaald de weergave in de barchart. Click op een reeds geselecteerde wijk om deze uit de selectie te halen.
- Benodigdheden:
  - Map: Een map van Haarlem is een must. Wat voor een soort map moet kies ik op basis van beschibaarheid, maar mijn voorkeur zou uit gaan naar een simpele zwart witte map, met misschien de hoofdwegen van haarlem benoemd, als referentiepunt. De verschillende wijken moeten gescheiden zijn, en het zou mooi zijn als deze ook al zo getekend/outlined zijn.

### Window 1, Search and Select window

#### Search bar
De search bar maakt het zoeken naar aandoeningen klachten mogelijk op basis van hun naam of ICPC code.

- Interactie: 
  - Zoeken: Logischer wijs moet je kunnen zoeken in de search bar. Je kunt het begin van de ICPC code in typen en vervolgens verschijnt er onder/naast het invoerveld een selectie met opties waar je tussen kunt kiezen. 
  - Selecteren: Je kunt vervolgens één van de opties selecteren. De opties zijn in ieder geval twee, en misschien drie categorieen. Het moet mogelijk zijn om op de hoofdcategorie te zoeken, bijvoorbeeld op het geheel van endocriene aandoeningen (ICPC hoofdcategorie T). Daarnaast is het een goed idee om op subcategorieen te kunnen zoeken, bijvoorbeeld T90 (ICPC categorie diabetes). Ik ben nog aan het twijfelen of nog gedetailleerdere informatie noodzakelijk is. Voor sommige aandoeningen is het handig (zoals verschillende soort psychische aandoeningen), maar in verband met de privacy is het misschien beter om niet heel gedetailleerde informatie te verstrekken.
- Benodigdheden:
  - Search engine: Er is een search engine nodig die de voorkant van de search kan herkennen in de gehele ICPC codes. Daarnaast is het misschien wel een idee om op de namen behorend bij de ICPC codes te kunnen zoeken, bijvoorbeeld dat een zoekopdracht naar angst de verschillende ICPC codes geeft voor de verschillende angststoornissen. Het zoeken zie ik het liefste realtime gebeuren, maar als dit te veel vereist van de browser snelheid hoeft het niet.
  - Aanvul opties: Het aanvullen van de meest gelijkende ICPC code met de zoekopdracht is in principe een uitbreiding van wat hierboven al beschreven staat, alleen staat nu de beste optie niet onder de zoekopdracht, maar overlapt deze de zoekopdracht. 

#### Tree view structure
Ik bedoel met deze structure een lijst van mapjes met hoofd categorieen, met een plusje ernaast. Als je dan op het plusje klikt, dan komt er een rijtje met sub mapjes die geindent zijn. 

- Interactie: 
  - Expand/Collapse: Klik op het plusje naast een map, of dubbelklik op een map, om de map uit te klappen. Je kunt uitgeklapte mapjes ook weer inklappen. Zo kun je alle mogelijke categorieen in hun hierarchische structuur exploreren. 
  - Selecteren: Als je op een mapje klikt zonder hem te expanden, dan selecteer je deze map als categorie en veranderd de barchart en de map op basis van de geselecteerde categorie.
- Benodigdheden: Deze structuur als een tooltip, het vervangt als het ware de zoekfunctie. Ze zouden ook samen in één window kunnen met de optie om tussen deze twee te switchen.

#### Options field
Het options field bevat de geselecteerde aandoeningen. Meerdere codes kunnen geselecteerd worden om een gecombineerde QUERY te doen (maximaal 2 om de privacy van de patienten te waarborgen (een grotere gecombineerde QUERY zou kunnen lijden tot informatie over de wijk waarin een bepaalde patient woont)). 

- Interactie:
  - Click: Als je op een categorie klikt, dan verdwijnt deze weer uit de het optie veld.
  - Check box: Er is een check box bij de tweede regel van het veld om aan te vinken of je juist een combinatie wilt, of dat je wilt dat ze een andere bepaalde aandoening niet hebben (AND/OR/NOT operator). 
- Benodigdheden: Weinig, dit lijkt mij basis programmeer werk.

### Window 2, Comparing Data in a bar chart

#### Bar chart
De bar chart geeft voor elke geselecteerde wijk een bar met als hoogte het aantal patienten wat voldoet aan de kriteria in de options field in die bepaalde wijk. 

- Interactie: 
  - Click: klik op een bar om deze te laten verdwijnen uit de bar chart en de selectie van de betreffende wijk op te heffen. Daarnaast moet er ook een knop komen om weer de waarde van geheel haarlem weer te geven. Ook moet er een checkbox of een knop komen om te kunnen selecteren of je absolute of relatieve data wilt zien  (dus het aantal mensen, of het percentage van de patienten in de betreffende wijk).
  - Hover: Hover over een bar om te zien wat de waarde van de bar is. De wijk van de bar licht ook op in de map.
- Benodigdheden: Basis programmeren.

## Componenten Dataset:
De data set bestaat uit een lijst van alle patienten uit de praktijk. Van deze patienten staat genoteerd in welke wijk ze wonen, wat hun leeftijd is en  welke episodes ze hebben. Een episode representeerd in het huisarts informatie systeem (HIS) een klacht of aandoening waarmee een patient naar de dokter gekomen is. Komt een patient meermaals met dezelfde klacht, dan valt dat onder dezelfde episode. Episodes zijn dynamisch, wat inhoudt dat als iemand generieke klachten komt en het blijkt vervolgens om een specifiekere aandoening te gaan, dat de episode veranderd. 
De data wordt door de HIS gegenereerd op basis van een in het HIS ingevoerde QUERY, waar de output een tab seperated value (TSV) lijst is. Deze data is makkelijk te importeren in D3. 

## Overwegingen Design keuzes:
- Map: als er in het optie wveld een mini QUERY is opgesteld, dan wordt vervolgens de map aangepast op basis van deze QUERY, zodat er in één oogopslag duidelijk is in welke wijk de meeste patienten aan deze criteria voldoen. Er zijn nu twee keuzes die gemaakt moetne worden:
  1. codeer je absoluut of relatief: Het is voor mij nu nog lastig om in te zien wat handiger is. Ik kan mij voorstellen dat het handig is om te weten waar de meeste patienten wonen die aan de kriteria voldoen, om zo te kijken waar hulp het meeste nodig is. Maar als je niet weet hoeveel % dit van de totale patientenpopulatie in die wijk is, dan mis je misschien de ernst van het probleem. Ik denk dat het niet mogelijk is om beide in dezelfde map weer te geven, zonder de duidelijkheid in de weg te zitten. Dus dan moet er ergens een optie gegeven worden om tussen de twee mogelijkheden te switchen.
  2. Hoe codeer je deze waardes: Er zijn verschillende mogelijkheden om de grootste waarde te coderen in de map. Ik zou het met kleur kunnen coderen en dan vervolgens er een legenda bij kunnen geven, die zich dynamisch aanpast op het moment dat er een nieuwe QUERY wordt gemaakt. Die legenda moet er eigenlijk sowieso komen. Dus de vraag is of ik het dan met kleur, of in zwart wit wil coderen. Ik denk dat een single hue color scheme het beste werkt, aangezien het aantal patienten maar 1 kant uit gaat (het kan niet negatief zijn). Daarnaast moet het in een aantal stappen gaan, anders is er moeilijk onderscheid te maken tussen de verschillende categorieen. Maar als ik dat doe, dan maak ik het wel weer minder gedatailleerd en esthetisch minder pleasing. Het is dan duidelijkheid in aflezen, maar met minder gradient dus verlies van detail. Het verlies van detail wordt opgeheven door de tooltip die je te zien krijgt als je over de map hovered. 
