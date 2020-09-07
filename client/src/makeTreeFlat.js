export default function makeTreeFlat(data, nested) {
  const flatData = [];
  data.forEach((item) => {
    if (item.children) {
      flatData.push({
        type: item.type,
        name: item.name,
        nested: nested ? nested : 0,
      }, ...makeTreeFlat(item.children, nested ? nested+1 : 1));
    } else {
      flatData.push({
        type: item.type,
        name: item.name,
        nested: nested ? nested : 0,
      })
    }
  })
  return flatData;
}