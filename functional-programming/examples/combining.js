const people = [
  { name: "John Doe", jobTitle: "Software Engineer", salary: 80000 },
  { name: "Jane Smith", jobTitle: "Marketing Manager", salary: 75000 },
  { name: "Robert Johnson", jobTitle: "Software Engineer", salary: 85000 },
  { name: "Emily Davis", jobTitle: "Data Scientist", salary: 95000 },
  { name: "Michael Brown", jobTitle: "Software Engineer", salary: 90000 },
  { name: "Linda Wilson", jobTitle: "Product Manager", salary: 92000 },
  { name: "David Martinez", jobTitle: "Marketing Manager", salary: 70000 },
  { name: "Sarah Lee", jobTitle: "Data Analyst", salary: 65000 },
  { name: "James White", jobTitle: "Product Manager", salary: 88000 },
  { name: "Lisa Green", jobTitle: "HR Specialist", salary: 72000 }
];

const softwareEngineers = people.filter(p => p.jobTitle === "Software Engineer")

const avgSalary = softwareEngineers
  .map(p => p.salary)
  .reduce((result, x) => result + x)
  / softwareEngineers.length;

console.log(avgSalary);