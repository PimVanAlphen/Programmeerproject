# Programmeerproject

### doel van de visualisatie:
Mijn visualisatie is een weergave van welke aandoeningen er in welke wijken in Haarlem voorkomen. Als de prevalentie van (met name chronische) aandoeningen in bepaalde wijken in Haarlem relatief groot is, dan kan er specifiek in dat gebied actie ondernomen worden. Het doel van mijn visualisatie is om van gekozen aandoeningen in één oogopslag weer te geven waar deze het meeste voorkomen.

### hoe ziet de visualisatie eruit:
De visualisatie bestaat uit een map met daarop de wijken van Haarlem in ongeveer het midden-rechts van het scherm, met dan aan de linkerkant een kleine box en een verticaal langwerpige box. 
   In de box staat een zoekveld om te zoeken op ICPC code (codes die door huisartsen worden gebruikt om bepaalde klachten/ziektes te classificeren). Daarnaast is er ook een optie om deze codes weer te geven in een tooltip als een boom, waarbij de hoofdgroepen als uitklapbare mappen worden weergegeven, met de kleinere groepen als mapjes daaronder. Als je een ICPC code of hogere groep aanklikt, dan wordt deze geselecteerd. De geselecteerde code bepaald hoe de map en de langwerpige box eruit komen te zien. 
   De map laat de verschillende wijken van Haarlem zien. Als je over een wijk hovered met je muis, dan verschijnt de naam van de wijk en het aantal patienten in die wijk in een tooltip. Daarnaast zie je ook het aantal patienten met een aandoening of klacht in de categorie die je eerder hebt geselecteerd. De wijken krijgen ook een kleur op basis van het aantal patienten met de geselecteerde aandoening, zodat in één oogopslag zichtbaar is waar de aandoening het meeste voorkomt. 
   In de langwerpige box staat een barchart met daarop een bar die weergeeft hoeveel patienten er met de geselecteerde aandoening zijn. Daarnaast kun je op wijken klikken om ze te selecteren, deze verschijnen dan als bars ook in de bar chart. 
   
### de dataset:
De data haal ik van de huisartsenpraktijk waar ik werk. Deze praktijk bestaat uit vier huisartsen, met een totale patientenpopulatie van over de 10000 patienten. Data is makkelijk te verkrijgen vanuit het Huisarts Informatie Systeem dat door elke praktijk gebruikt wordt. Ik heb toegang tot deze data, en mag deze gebruiken zolang het niet mogelijk is dat de informatie naar specifieke personen kan leiden. 

### de initiele schets:

