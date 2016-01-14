import json

def main():
    file = open('ICPC.txt', 'r')
    ICPC = file.read()
    file.close()

    text = ICPC.split('\n')
    icpcJson = {"name":"ICPC codes","children":[]}
    for row in text:
        code = row.split(' ', 1)
        if len(code[0]) == 1:
            icpcJson["children"].append({"name":code[1],"code":code[0],"children":[]})
        elif len(code[0]) == 3:
            for parent in icpcJson["children"]:
                if parent["code"] == code[0][0]:
                    parent["children"].append({"name":code[1],"code":code[0]})

    #https://docs.python.org/2/library/json.html
    with open('icpcJson.json', 'w') as outfile:
        json.dump(icpcJson, outfile)

if __name__ == '__main__':
	main()
