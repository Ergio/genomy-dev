import { splitByReg } from '../../utils/re-utils';
import { parseFeatures } from './features-parser';

const RE_MAIN_SECTIONS = /(\n[A-Z]+.+)/g;

export function gbkToJson(fileString: any) {
  // Main sections starts with upper-case letters after /n (in gbk file), 
  // exception is LOCUS(it is first word in the file). Example: ORIGIN, FEATURES, SOURCE etc;
  const mainSections = splitMainSections(fileString);
  const featureText = mainSections["FEATURES"][0];
  const features = parseFeatures(featureText);

  return {...mainSections, "FEATURES":features};
}

// maybe it is incorrect (obj -> array) 
function splitMainSections(fileString: string) {
  return splitByReg(fileString, RE_MAIN_SECTIONS).reduce((ac: any, l) => {
    const newNode = getKeyValueFromLine(l);
    if (newNode.key in ac) {
      ac[newNode.key].push(newNode.value);
      return ac;
    } else {
      return {...ac, [newNode.key]: [newNode.value]};
    }
  }, {});
}

export function getKeyValueFromLine(lineText: string) {
  const line = lineText.trim();
  const firstWhitspace = line.indexOf(' ');
  const key = line.substring(0, firstWhitspace).trim();
  const value = line.substring(firstWhitspace, line.length).trim();
  return {key, value};
}

