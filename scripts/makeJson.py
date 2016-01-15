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
            icpcJson["children"].append({"name":(code[0] + ": " + code[1]),"code":code[0],"children":[]})
        elif len(code[0]) == 3:
            for hoofdcode in icpcJson["children"]:
                if hoofdcode["code"] == code[0][0]:
                    for codegroep in hoofdcode["children"]:
                        if codegroep["code"] == code[0][:2]:
                            codegroep["children"].append({"name":(code[0] + ": " + code[1]),"code":code[0]})
                            break;
                    else:
                        hoofdcode["children"].append({"name": (code[0][:2]+"0 - "+code[0][:2]+"9"), "code":code[0][:2], "children":[{"name":(code[0] + ": " + code[1]),"code":code[0]}]})

    #https://docs.python.org/2/library/json.html
    #print icpcJson

    with open('icpcJson2.json', 'w') as outfile:
        json.dump(icpcJson, outfile)

if __name__ == '__main__':
	main()
