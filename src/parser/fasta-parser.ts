


export function fileToJson(fileString: any, options = <any>{}) {
  let resultArray = <any>[];
  let result = <any>null;
  try {
    const lines = splitStringIntoLines(fileString);

    for (let i = 0; i < lines.length; i++) {
      parseLine(lines[i]);
    }
    if (result) {
      resultArray.push(result);
      result = null;
      return {
        description: <string[]>[],
        features: null,
        name: '',
        genes: resultArray,
        success: true,
        messages: <string[]>[],
        metrics: null
      };
    }
  } catch (e) {
    console.error('error:', e);
    console.error('error.stack: ', e.stack);
    resultArray = [{
      success: false,
      messages: ['Import Error: Invalid File'],
      description: [],
      features: null,
      name: '',
      sequence: '',
      metrics: null
    }];
  }


  function parseLine(line: string) {
    line = line.trim();
    if (';' === line[0]) {
      // first instace is title, afterwards comments are ignored
      if (result) {
        return;
      }
      result = createInitialSequence(options);
      parseTitle(line);
    } else if ('>' === line[0]) {
      // header line
      if (result) {
        resultArray.push(result);
        result = null;
      }
      result = createInitialSequence(options);
      parseTitle(line);
    } else {
      // sequence line
      if (!result) {
        result = createInitialSequence(options);
      }
      if ('*' === line[line.length - 1]) {
        // some resultArray are ended with an asterisk
        parseSequenceLine(line.substring(0, line.length - 1));
        resultArray.push(result);
        result = null;
      } else {
        parseSequenceLine(line);
      }
    }
  }


  function parseTitle(line: string) {
    const pipeIndex = line.indexOf('|');
    if (pipeIndex > -1) {
      result.name = line.slice(1, pipeIndex);
      result.description = line.slice(pipeIndex + 1);
      result.features = getFeaturesFromDescription(result.description);
    } else {
      result.name = line.slice(1);
    }
  }


  function parseSequenceLine(line: string) {
    result.sequence += line;
  }


  function splitStringIntoLines(string: string) {
    let lines = <any>[];
    if (string === '') {
      return lines;
    } else {
      lines = string.split(/\r?\n/);
      if (lines.length === 1) {
        // tnr: not sure why this check is being made... but keeping it in because it is probably doing something
        lines = string.split('\\n');
      }
      return lines;
    }
  }


  function createInitialSequence(opt = <any>{}) {
    return {
      description: '',
      features: null,
      name: '',
      sequence: '',
      success: true,
      messages: [],
      metrics: null
    };
  }


  function getFeaturesFromDescription(str: string) {
    const TEXT_BETWEEN_SQUARE_BRACKETS = /(?<=\[).+?(?=\])/gm;
    const FIRST_WORD = /[^\s]*/gm;
    const textInBrackets = str.match(TEXT_BETWEEN_SQUARE_BRACKETS);
    const firstWord = (str.match(FIRST_WORD) as any)[0];

    const features = (textInBrackets as any)
      .map((el: any) => el.split('='))
      .reduce((accum: any, [key, value]: [any,any]) => {accum[key] = value; return accum; }, {});
    features['info'] = firstWord;
    return features;
  }
}



