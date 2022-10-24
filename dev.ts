import { formatString } from "./src";

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

const p = performance.now();
const T = formatString("{{:id}}", {
  id: "155 OR 1=1",
});

console.log(T, performance.now() - p);

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
