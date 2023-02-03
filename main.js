const file = document.querySelector("#send_file");
const downFile = document.querySelector("#donw_file");

file.addEventListener("change", function () {
  const arquivo = this.files[0];
  const leitor = new FileReader();

  leitor.addEventListener("load", function () {
    dados = leitor.result;
    arrayDados = dados.split(/\r?\n/);

    let dadosObj = [];

    for (let i = 0; i <= arrayDados.length - 1; i++) {
      let element = arrayDados[i].split(" ");

      if (
        element[0].slice(-1) !== "i" &&
        element[0] !== "beq" &&
        element[0] !== "bne"
      ) {
        const obj = {
          opcode: "000000",
          regW: binaryToXBitsBinary(anyToBin(element[1]), 5),
          regS: binaryToXBitsBinary(anyToBin(element[2]), 5),
          regT: binaryToXBitsBinary(anyToBin(element[3]), 5),
          shiftamount: "00000",
          opfunction: opToBin(element[0]),
        };

        dadosObj.push(
          binaryToHex(
            obj.opcode +
              obj.regS +
              obj.regT +
              obj.regW +
              obj.shiftamount +
              obj.opfunction
          ) + "\n"
        );
      } else {
        const obj = {
          opcode: opToBin(element[0]),
          a: binaryToXBitsBinary(anyToBin(element[1]), 5),
          b: binaryToXBitsBinary(anyToBin(element[2]), 5),
          imm: binaryToXBitsBinary(anyToBin(element[3]), 16),
        };

        dadosObj.push(binaryToHex(obj.opcode + obj.a + obj.b + obj.imm) + "\n");
      }
    }

    dadosObj.unshift("V2.0 raw\n");

    downFile.addEventListener("click", () => {
      download()(dadosObj.toString().replaceAll(",", ""), "arquivo.txt");
    });
  });

  if (arquivo) {
    leitor.readAsText(arquivo);
  }
});

function opToBin(opCode) {
  const binOpCode = {
    addi: "001000",
    andi: "001100",
    ori: "001101",
    xori: "001110",
    beq: "000100",
    bne: "000101",

    and: "100100",
    or: "100101",
    xor: "100110",
    nor: "100111",
    add: "100000",
    sub: "100010",
    slt: "101010",
  };

  return binOpCode[opCode];
}

function decimalToBinary(num) {
  return num.toString(2);
}

function addBinary(a, b) {
  let result = ""; // string para armazenar o resultado
  let carry = 0; // variável para armazenar o "carry" (vai 1)

  // percorrer os bits dos números a partir do último
  for (let i = a.length - 1; i >= 0; i--) {
    let sum = carry; // inicializar com o "carry"
    sum += parseInt(a[i]); // adicionar o bit do número a
    sum += parseInt(b[i]); // adicionar o bit do número b

    // determinar o bit do resultado e o "carry" para a próxima iteração
    if (sum === 2) {
      result = "0" + result;
      carry = 1;
    } else if (sum === 3) {
      result = "1" + result;
      carry = 1;
    } else {
      result = sum.toString() + result;
      carry = 0;
    }
  }
  if (carry === 1) {
    result = "1" + result;
  }

  return result;
}

function anyToBin(value) {
  if (value[0] === "$") {
    return decimalToBinary(parseInt(value.substr(1)));
  } else if (value < 0) {
    unsignedValue = value.substring(1);
    numBin = anyToBin(unsignedValue);

    invertedBits = numBin
      .replace(/0/g, "a")
      .replace(/1/g, "0")
      .replace(/a/g, "1");

    return addBinary(
      binaryToXBitsBinaryNegative(invertedBits, 16),
      binaryToXBitsBinary("1", 16)
    );
  } else {
    return decimalToBinary(parseInt(value));
  }
}

function binaryToXBitsBinary(num, bits) {
  return num.padStart(bits, "0");
}

function binaryToXBitsBinaryNegative(num, bits) {
  return num.padStart(bits, "1");
}

function binaryToHex(binary) {
  return parseInt(binary, 2).toString(16);
}

const download = function () {
  const a = document.createElement("a");
  a.style = "display: none";
  document.body.appendChild(a);

  return function (conteudo, nomeArquivo) {
    const blob = new Blob([conteudo], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = nomeArquivo;
    a.click();
    window.URL.revokeObjectURL(url);
  };
};
