# maak een dict aan om later bij een postcode de buurtcode te kunnen vinden
postcodeDict = dict()

def main():
    fillPostcodeDict()

def fillPostcodeDict():
    file = open('stratenlijst.txt', 'r')
    stratenlijst = file.read()
    file.close()

    # split de stratenlijst op newlines
    stratenlijst = stratenlijst.split('\n')

    # loop met een while loop omdat je verder moet kunnen kijken (dit is lastig)
    # met een for in loop
    i = 0
    while i < len(stratenlijst):

        # als er een stukje wordt gevonden waarbij er twee opeenvolgende regels
        # bestaan uit 4 nummers (zie stratenlijst.txt, dit duidt op een buurtnummer)
        # gevolgd door een postcode
        if len(stratenlijst[i]) == 4 and stratenlijst[i].isdigit() and len(stratenlijst[i + 1]) and stratenlijst[i + 1].isdigit():

            deelbuurt = stratenlijst[i]
            postcode = stratenlijst[i + 1]

            # kijk of de volgende regel de postcode letters bevat
            if num_there(stratenlijst[i + 2]):
                i += 1
                continue

            # split de postcode letters
            letters = stratenlijst[i + 2].split(' ')

            # als er niet twee letters blijken te zijn kunnen de postcodes nooit
            # gevonden worden, dus deze moeten niet in de dict komen
            if len(letters) != 2:
                i += 1
                continue

            # voeg de eerste letter van de postcode toe aan het nummer van de postcode
            postcode += letters[0]

            # kijk of de tweede letter een enkele letter is
            if len(letters[1]) == 1:
                postcode += letters[1]
                # check eerst even of de postcode er niet toevallig al in zit
                if checkKey(postcode):
                    postcodeDict[postcode] = deelbuurt
                i += 1
                continue
            # of een dubbele of een range van letters
            else:
                if letters[1][1] == '+':
                    postcode1 = postcode + letters[1][0]
                    postcode2 = postcode + letters[1][2]
                    if checkKey(postcode1):
                        postcodeDict[postcode1] = deelbuurt
                    if checkKey(postcode2):
                        postcodeDict[postcode2] = deelbuurt
                    i += 1
                    continue
                elif letters[1][1] == '-':
                    # als het om een range van letters gaat, dan moeten er meerdere
                    # postcodes toegevoegd worden.
                    eindletters = doorloopAlfabet(letters[1][0],letters[1][2])
                    for char in eindletters:
                        postcodeX = postcode + char
                        if checkKey(postcodeX):
                            postcodeDict[postcodeX] = deelbuurt
                    i += 1
                    continue
        i += 1

def checkKey(key):
    if key in postcodeDict.keys():
        return False
    return True

def doorloopAlfabet(beginletter, eindletter):
    alfabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    indexBegin = alfabet.index(beginletter)
    indexEind = alfabet.index(eindletter)
    return alfabet[indexBegin:indexEind]

def indeling(buurtcode):
    wijken = ["","OUDE STAD","SPOORBAAN LEIDEN","HAARLEM-OOST","HAARLEMMERHOUTKWARTIER","WESTOEVER NOORDER BUITEN SPAARNE","TER KLEEF EN TE ZAANEN","OUD-SCHOTEN EN SPAARNDAM","DUINWIJK","SCHALKWIJK"]
    buurten = ["",["Centrum","Stationsbuurt","Spaarnwouderbuurt"],["Zijlweg-oost","Leidsebuurt","Leidsevaartbuurt","Houtvaartkwartier"],["Oude Amsterdamsebuurt","Potgieterbuurt","Van Zeggelenbuurt","Slachthuisbuurt","Parkwijk","Waardepolder","Zuiderpolder"],["Koninginnebuurt","Kleine Hout","Den Hout","Rozenprieel"],["Patrimoniumbuurt","Transvaalbuurt","Indischebuurt-zuid","Indischebuurt-noord","Frans Halsbuurt"],["Kleverpark","Bomenbuurt","Planetenwijk","Sinnevelt","Overdelft"],["Dietsveld","Vogelenbuurt","Delftwijk","Vondelkwartier","Spaarndam-west"],["Ramplaankwartier","Zijlweg-west","Oosterduin"],["Europawijk","Boerhaavewijk","Molenwijk","Meerwijk"]]
    return [buurten[int(buurtcode[0])][int(buurtcode[1])],wijken[int(buurtcode[0])]]

# http://stackoverflow.com/questions/19859282/check-if-a-string-contains-a-number
# checks if there is a number in string s
def num_there(s):
    return any(i.isdigit() for i in s)

if __name__ == '__main__':
	main()