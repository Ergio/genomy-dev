import {map, pipe, Dictionary, inc, prop } from 'ramda';
// import { pipe } from "../utils/pipe";
import { splitByReg } from '../../utils/re-utils';

const RE_FEATURES_SECTIONS = /(\n\s{5}\w+.+)/g;
const RE_SEQ_VARIABLES_LINE = /\s{21}\/(.+)=(.+)/g;
const RE_SEQ_LOCATION_LINE = /\s{5}(\w+)\s+(.*\d+\.\.(|>)\d+.*)/g;

const RE_SEQ_ANY_VARIABLES = RegExp(RE_SEQ_LOCATION_LINE.source + '|' + RE_SEQ_VARIABLES_LINE.source, 'g');
const RE_INDENTATION = /\s{2,}|\n/g;

// start of line >>> 5 spaces >>> sequence type >>> n spaces >>> location >>> end of line
// location: complement(n..n) | complement(<n..n) | n..n | <n..>n | etc. 


export function parseFeatures(featuresText: string) {
  const start = inc(featuresText.indexOf('\n'));
  const end = featuresText.length;
  const getFeaturesText = (text: string) => text.substring(start, end);

  const getFeatureSections = pipe(
    getFeaturesText,
    splitFeaturesSections,
    mergeSynonymsFeaturesSections,
    map(parseFeatureSection)
  );

  return getFeatureSections(featuresText);
}


const format = (v: string) => v.replace(RE_INDENTATION, '');

function parseFeatureSection(featureSectionText: string) {
  const featureSectionVariables = splitByReg(featureSectionText, RE_SEQ_ANY_VARIABLES);
  const parseVariable = (line:string) => { // NOTE: dont save this regexp to variable
    const mVariable = /\s{21}\/(.+)=\"([^]+)\"/g.exec(line);
    const mLocation = RE_SEQ_LOCATION_LINE.exec(line);
    // TODO: join(location), order(location)
    if(mLocation) {
      const location = mLocation[2];
      const mLocVal = /(\d+)\.\.>?(\d+)/g.exec(location);
      if(mLocVal) {
        return {
          location,
          'location_start': mLocVal[1],
          'location_stop': mLocVal[2],
          'sequence_length': `${Math.abs(parseInt(mLocVal[2], 10) - parseInt(mLocVal[1], 10))}`,
          'incomplete_start': location.includes('<'),
          'incomplete_stop': location.includes('>'),
          'complementary_strand': location.includes('complement'),
          'sequence_type': mLocation[1]
        };
      }
      return {'sequence_type': mLocation[1], location};
    }

    if(mVariable){
      if(mVariable[1] ==="translation") {
        return {[mVariable[1]]: format(mVariable[2]).replace(/\s/g,'')};
      }
      return {[mVariable[1]]: format(mVariable[2])};
    }
  };
  const parseVariabes = (ac: any, cur: string) => {
    const parsedVariable = parseVariable(cur) as any;
  
    // sequence_type
    const st = 'sequence_type';
    const oldSt = prop(st, ac);
    if(oldSt && prop(st, parsedVariable)) {
      parsedVariable[st]+= `, ${oldSt}`
    }
  
    return parsedVariable ? { ...ac, ...parsedVariable} : ac; 
  };
  return featureSectionVariables // .reduce(parseVariabes, {} as any);
}

function mergeSynonymsFeaturesSections(splitedFeatureSections: string[]): Dictionary<string>{
  return splitedFeatureSections.reduce((acc, cur) => {
    
    const locationLine = splitByReg(cur, RE_SEQ_ANY_VARIABLES)[1]; // format
    const location = format(getValueFromLine(locationLine));
    acc[location] = acc[location] ? (acc[location] + cur) : cur;
    return acc;
  }, {} as any)
}

function splitFeaturesSections(featuresText: string) {
  return splitByReg(featuresText, RE_FEATURES_SECTIONS);
}

function getValueFromLine(lineText: string) {
  const line = lineText.trim();
  const firstWhitspace = line.indexOf(' ');
  const value = line.substring(firstWhitspace, line.length).trim();
  return value;
}
