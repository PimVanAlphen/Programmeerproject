import csv
import os
import codecs
# maak een dict aan om later bij een postcode de buurtcode te kunnen vinden
icpcDict = dict()
SCRIPT_DIR = os.path.split(os.path.realpath(__file__))[0]


def main():
    file = open('ICPC.txt', 'r')
    data = file.read()
    file.close()

    fillIcpcDict()
    rows = []
    counterHaarlem = 0
    counterBuiten = 0
    with open('UT.csv', 'rb') as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            tmprow = []
            text = row[0].split(';')

            # kijk of de postcode in de database (dict) van postcodes zit,
            # dus of het een postcode in haarlem is.
            if text[1] in postcodeDict:
                text[1] = postcodeDict[text[1]][:2]
                counterHaarlem += 1
            else:
                counterBuiten += 1
                continue

            # kijk of de episode code een administratieve verrichting is, dus
            # niet gaat over een klacht of aandoening maar over een handeling
            if int(text[0][1:3]) >= 30 and int(text[0][1:3]) < 70:
                continue

            for t in text[:-2]:
                tmprow.append(t)
            rows.append(tmprow)

    print "done"
    print "In Haarlem:", counterHaarlem
    print "Buiten Haarlem",  counterBuiten
    save_csv(os.path.join(SCRIPT_DIR, 'dataproject.csv'), rows)

def fillIcpcDict():
    file = open('ICPC.txt', 'r')
    data = file.read()
    file.close()

    data = data.split(";", 1)

def save_csv(filename, rows):
    with open(filename, 'wb') as f:
        writer = csv.writer(f)  # implicitly UTF-8
        writer.writerow([
            'episode','buurtcode'
        ])

        writer.writerows(rows)

if __name__ == '__main__':
	main()
