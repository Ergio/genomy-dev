const fs = require('fs');
let genomy = require("../dist/genomy.umd");


const gbkText = fs.readFileSync("dev-tests/data/small-data/gbk.gbk", "utf8");
const result = genomy.testGbkParser({filetext:gbkText});


// const fastaText = fs.readFileSync("dev-tests/data/small-data/fasta.txt", "utf8");
// genomy.testFastaParser({filetext:fastaText});

function wrightResponseToFile(obj) {
  fs.writeFileSync(`result.txt`, JSON.stringify(obj, null, 2));
}

wrightResponseToFile(result);
