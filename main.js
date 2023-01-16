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

      const obj = {
        opcode: opCodeToBin(element[0]),
        a: toAnyBitBinary(anyToBin(element[1]), 5),
        b: toAnyBitBinary(anyToBin(element[2]), 5),
        imm: toAnyBitBinary(anyToBin(element[3]), 16),
      };

      dadosObj.push(binaryToHex(obj.opcode + obj.a + obj.b + obj.imm) + "\n");
    }

    downFile.addEventListener("click", () => {
      download()(dadosObj.toString().replaceAll(",", ""), "arquivo.txt");
    });
  });

  if (arquivo) {
    leitor.readAsText(arquivo);
  }
});

function opCodeToBin(opCode) {
  const binOpCode = {
    addi: "001000",
    andi: "001100",
    beq: "000100",
    bne: "000101",
    ori: "001101",
    xori: "001110",
  };

  return binOpCode[opCode];
}

function decimalToBinary(decimal) {
  return decimal.toString(2);
}

function anyToBin(value) {
  if (value[0] === "$") {
    return decimalToBinary(parseInt(value.substr(1)));
  } else {
    return decimalToBinary(parseInt(value));
  }
}

function toAnyBitBinary(num, bits) {
  return num.toString(2).padStart(bits, "0");
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
