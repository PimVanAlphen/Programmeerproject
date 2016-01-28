# Aandoeningen en Klachten in Haarlem
## een weergave voor patiënten van het Therapeuticum Haarlem, door Pim van Alphen, Assistent-Kwaliteitscoordinator aan het Therapeuticum Haarlem

### Doel van de visualisatie:
De visualisatie geeft van aandoeningen weer in welke welke wijken of buurten van Haarlem zij (relatief) het meest voorkomen. De informatie is genomen uit het huisarts informatie systeem (HIS) van de huisartsen van huisartsenpraktijk het Therapeuticum in Haarlem, en de gegevens zullen dan ook alleen betrekking hebben op de patientenpopulatie van deze praktijk. Het is relevant om zichtbaar te maken waar in Haarlem de prevalentie van (met name chronische) aandoeningen relatief groot is, er kan dan specifiek in dat gebied actie ondernomen worden. Het doel van mijn visualisatie is om van een gekozen aandoening in één oogopslag weer te geven waar deze het meeste voorkomt.

### Gebruik van de visualisatie:
De visualisatie is gemaakt in javascript en heeft een lokale server nodig om te draaien, aangezien er lokale bestanden opgehaald moeten worden. Een voorbeeld van een lokale server is bijvoorbeeld de python SimpleHTTPServer. Geef deze als root de "project" map mee, laadt de hoofdpagina van de lokale server om te visualisatie te bekijken. Een handleiding van de visualisatie zoals gegeven in de visualisatie zelf:<br /> **Gebruiksaanwijzing**: In het zoekveld kunt u zoeken op de naam van een klacht of aandoening, of op de door het huisartseninformatiesysteem gebruikte ICPC code. De knoppen hieronder geven de geselecteerde weergave opties weer. Klik op de knoppen om de weergave van de kaart en de staafgrafiek aan te passen. Hiermee is het mogelijk om de kaart van Haarlem weer te geven in wijken of in buurten, en om of het totaal aantal van de episodes in een gebied weer te geven, of het aantal episodes in het gebied per patiënt die in dat gebied woont (in de grafische weergave ook wel ‘ratio’ genoemd).

### Componenten van de visualisatie:
De visualisatie bestaat uit een schematische kaart van de wijken en buurten van Haarlem, een zoekregel en een tweetal optieknoppen. In de zoekregel kan gezocht worden naar namen en ICPC codes van aandoeningen of klachten (dus niet van administratieve verrichtingen etc.). Als er één van deze aandoeningen gekozen wordt, dan kleuren de gebieden op de kaart zich en verschijnt er naast de kaart ook nog een staafgrafiek. De kleuren op de kaart staan voor het aantal patienten dat in dat specifieke gebied woont en de geselecteerde aandoening als episode in het patientendossier heeft staan. De staafgrafiek geeft gedetailleerd de aantallen weer. De knoppen zijn er om te wisselen tussen een kaart van Haarlem die verdeeld is in zeven wijken en een kaart die verdeeld is in 42 buurten, en om te wisselen tussen weergave van het totaal aantal van de geselecteerde episodes of een weergave van het aantal episodes per patient die in het gebied op de kaart woont. 
   
### De dataset:
Patientendata is verkregen uit het HIS van het therapeuticum Haarlem. Postcodes van patienten zijn genomen en buiten de visualisatie verwerkt naar buurtcodes, gebruik makende van de referentie van de Gemeeente Haarlem (zie Bronnen). De episodes zijn gereduceerd tot een ICPC code met alleen de eerste letter en het eerste getal, dit om de privacy van patienten te waarborgen. Gegevens over de namen bij de ICPC codes zijn overgenomen van de daarover beschikbare data van het NHG.

### De visualisatie:
![het eindproduct] (https://github.com/PimVanAlphen/Programmeerproject/blob/master/doc/finalProduct.PNG)

### Bronnen:
- http://www.haarlem.buurtmonitor.nl/report/stratenlijst2013nw.pdf: Een lijst van de Gemeente Haarlem met daarop gegevens van alle straten en postcodes van Haarlem, inclusief gegevens over de buurt waartoe deze behoren. Gebruikt om postcodes om te kunnen schrijven naar buurtcodes. 
- https://www.nhg.org/themas/publicaties/icpc-online: Voor het overnemen van de naamgeving bij ICPC codes. Deze site had als enige ook een naamgeving bij de ICPC codes die bestonden uit alleen de eerste letter en het eerste getal.
- https://www.nhg.org/sites/default/files/content/nhg_org/uploads/icpc-versie-4-inkijkexemplaar_0.pdf: Gebruikt voor de naamgeving van de ICPC hoofdcategorieen (alleen de eerste letter).
- http://bl.ocks.org/mbostock/3885304: voor het maken van een  barchart
- http://bl.ocks.org/RandomEtc/cff3610e7dd47bef2d01: voor het updaten van een barchart
- http://bl.ocks.org/mbostock/3887051: voor het maken van een grouped barchart
- http://bl.ocks.org/Caged/6476579: voor het maken van een tooltip op de barchart
- https://upload.wikimedia.org/wikipedia/commons/1/1b/Map_-_NL_-_Haarlem_-_Wijk_01_Oude_stad.svg: voor het verkrijgen van een kaart van Haarlem verdeeld in de wijken van Haarlem.
- https://upload.wikimedia.org/wikipedia/commons/4/48/Map_-_NL_-_Haarlem_-_Wijk_01_Oude_stad_-_Buurt_00_Centrum.svg: voor het verkrijgen van een kaart van Haarlem verdeeld in de buurten van Haarlem.
- https://twitter.github.io/typeahead.js/examples/: voor het zoekveld en een automatisch aanvul- en zoekfunctie hierin.
- https://github.com/bassjobsen/typeahead.js-bootstrap-css/blob/master/typeaheadjs.css: voor styling van het zoekveld zoals hierboven beschreven.
- http://bl.ocks.org/mbostock/1086421: voor het maken van een gradient als legenda bij de map

### Copyright Statement:
Copyright 2016 P.A. van Alphen

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
