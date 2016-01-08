import csv
import os
import codecs
SCRIPT_DIR = os.path.split(os.path.realpath(__file__))[0]

def main():
    file = open('indeling.txt', 'r')
    indeling = file.read()
    file.close()

    text = indeling.split('\n')
    rows = []

    for line in text[:-1]:
        print line
        line = line.split(' ', 1)
        print line
        rows.append([line[0], line[1]])

    save_csv(os.path.join(SCRIPT_DIR, 'indeling.csv'), rows)

def save_csv(filename, rows):
    with open(filename, 'wb') as f:
        writer = csv.writer(f)  # implicitly UTF-8
        writer.writerow([
            'buurtcode','naam'
        ])

        writer.writerows(rows)

if __name__ == '__main__':
	main()
