const add = (x, y, z) => x + y + z;

const addPartial = (x) =>
  (y, z) => add(x, y, z);

const add1 = addPartial(1);

console.log(add1(10, 11));

/////////////////////////////////////////

const getPropertyWithDefault = (obj, key, defaultValue) => {
  if (obj[key]) {
    return obj[key];
  } else {
    return defaultValue;
  }
}

const getPropertyPartial = (key, defaultValue) =>
  (obj) => getPropertyWithDefault(obj, key, defaultValue);

const getName = getPropertyPartial('displayName', 'Unknown');

getName(person);
getName(person2);
getName(building);