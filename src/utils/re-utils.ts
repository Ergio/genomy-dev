// returns all indexes of matches.
export function getIndexesByReg(str: string, re: RegExp): number[] {
  let match;
  const indexes = [];
  while ((match = re.exec(str)) != null) {
      indexes.push(match.index)
  }
  return indexes;
}

// Split by reg without removing reg-parts from string.
export function splitByReg(text: string, re: RegExp): string[] {
  const indexes = getIndexesByReg(text, re);
  indexes.push(text.length);
  return indexes.reduce((accum, cur, index, arr) => {
    const part = text.substring(+arr[index-1], +arr[index]);
    accum.push(part);
    return accum;
  }, [] as string[]);
}
