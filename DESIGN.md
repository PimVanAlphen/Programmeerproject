# Design

## Componenten Visualisatie:

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

#### Expanding/Collapsing map structure
Ik bedoel met deze map structure een lijst van mapjes met hoofd categorieen, met een plusje ernaast. Als je dan op het plusje klikt, dan komt er een rijtje met sub mapjes die geindent zijn. 

- Interactie: 
  - Expand/Collapse: Klik op het plusje naast een map, of dubbelklik op een map, om de map uit te klappen. Je kunt uitgeklapte mapjes ook weer inklappen. Zo kun je alle mogelijke categorieen in hun hierarchische structuur exploreren. 
  - Selecteren: Als je op een mapje klikt zonder hem te expanden, dan selecteer je deze map als categorie en veranderd de barchart en de map op basis van de geselecteerde categorie.
- Benodigdheden: Deze structuur als een tooltip, het vervangt als het ware de zoekfunctie. Ze zouden ook samen in één window kunnen met de optie om tussen deze twee te switchen.

#### Options field

- Interactie:
  - Click: 
- Benodigdheden:
##### Interactie:
##### Benodigdheden:

### Window 2
#### Bar chart
##### Interactie: 
##### Benodigdheden:

#### Checkbox
##### Interactie: 
##### Benodigdheden:

### Componenten Dataset:
