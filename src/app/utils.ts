export const filter = (data: any[], selected: any, attributes: any[]): any[] => data.filter(item => condition(selected, attributes, item));

function condition(selected: any, attributes: any[], item: any): boolean {
  for (const attribute of attributes) {
    if (!test(selected[attribute.filterAttr], item[attribute.attr])) return false;
  }
  return true;
}

const test = (array: string[], value: any): boolean => !array || array.length === 0 || array.includes(value);
