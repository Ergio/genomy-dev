

export function locationParser(locationText: string){

  // const mLocation = RE_SEQ_LOCATION_LINE.exec(line);
  // TODO: join(location), order(location)

  const location = locationText;

  // join(location,location, ... location) 
 // "join(16181398..16181687,16231056..16231115)"

  const RE_JOIN = /join\((.*)\)/g;
  const RE_COMPLEMENT = /complement\((.*)\)/g;
  // const 
  // 1 remove new lines
  //
  //
  //
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
    };
  }
  return {
    location
  };

}

//
// {
//  'location_start': mLocVal[1],
//  'location_stop': mLocVal[2],
//  'sequence_length': `${Math.abs(parseInt(mLocVal[2], 10) - parseInt(mLocVal[1], 10))}`,
//  'incomplete_start': location.includes('<'),
//  'incomplete_stop': location.includes('>'),
//  'complementary_strand': location.includes('complement'),
// }
//
//
//
//
//