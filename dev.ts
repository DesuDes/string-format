import { formatString } from "./src";
import { JSON_TEST_DATA } from "./tests/data";

const OPTS = {
  pipes: [
    {
      name: "replaceX",
      action: () => {
        return "X";
      },
    },
  ],
};

// console.time("Bench marking start");
console.log("---");
const p = performance.now();
const J = {
  name: "Tiger",
  age: 30,
  city: "New York",
  e: '{"city": "Makati City", "age" : 28}',
};

const JSON_SAMPLE = {
  id: "sample",
  json: JSON.stringify(J),
};
// console.log(JSON_SAMPLE);
const T = formatString(
  "Favorite team: {{:!raw.!child.!child.members.@0- }}.",
  JSON_TEST_DATA
);
// console.timeEnd("Bench marking start");
const pe = performance.now();

console.log(T, pe - p);
// // console.log("----");
// const FORMATTED_STRING = formatString("Sample: {{:hello }}", {
//   hello: "Hello",
//   name: "Tiger",
//   world: "world",
//   place: "Makati",
//   deep: {
//     info: {
//       welcome: "Huhu.",
//     },
//   },
//   func: () => {
//     return "orange";
//   },
//   arr: [
//     1,
//     {
//       name: ["success"],
//     },
//     {
//       name: "Tiger",
//     },
//     {
//       name: "Shower",
//     },
//   ],
//   arr2: [
//     [0, 1, 2, 3],
//     [4, 5, 6, 7],
//   ],
//   arr3: [
//     [
//       {
//         name: "Ayala",
//       },
//       {
//         name: "BGC",
//       },
//     ],
//     [
//       {
//         name: "Cainta",
//       },
//       {
//         name: "Pasig",
//       },
//       {
//         name: "Marikina",
//       },
//       {
//         name: "Quezon City",
//       },
//     ],
//   ],

//   query: {
//     q1: "QUERY",
//   },
//   objTest: {
//     param: "1",
//   },
// });

// console.log("RESULT", FORMATTED_STRING);
