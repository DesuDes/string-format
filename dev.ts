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

const T = formatString("{{:numbers2.@0-.@1.@0-}}.", null);

console.log(T);

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
