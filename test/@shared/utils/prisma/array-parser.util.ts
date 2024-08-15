export function stringArraytoString(array: string[]) {
  return array.join(';;');
}

export function stringToStringArray(str: string) {
  return str.split(';;').filter((item) => item);
}
