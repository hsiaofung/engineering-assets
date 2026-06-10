getPropertyWithDefault('name', 'N/A', { name: 'Shaun', age: 123 })


function getName(object) {
  return getPropertyWithDefault('name', 'N/A', object);
}


getName({ name: 'Shaun', age: 123 })