import {fileToJson} from './parser/fasta-parser';
import {gbkToJson} from './parser/gbk-parser';

export default class Genomy {
  public a = 1;

  public static test() {
    console.log("Tests are running");
    console.log("END");
  }

  public static testFastaParser(params: {filetext: string}) {
    const text = params.filetext;
    // console.log(text);
    // console.log(JSON.stringify(fileToJson(text)), {})
    console.log(JSON.stringify(fileToJson(text)), {})
  }

  public static testGbkParser(params: {filetext: string}) {
    const text = params.filetext;
    // console.log(text);
    // console.log(JSON.stringify(gbkToJson(text)), {})
    return gbkToJson(text);
  }
}
