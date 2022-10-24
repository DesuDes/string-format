import { formatString } from "../src";
import { TEST_DATA } from "./data";

test("Test Case #1 - Basic Nested Array Replace", () => {
  expect(
    formatString(
      "I'm {{:name}} and I'm with {{:friends.@0}}, and {{:friends.@1}}.",
      TEST_DATA
    )
  ).toBe("I'm Tiger and I'm with Orange, and Shower.");
});

test("Test Case #2 - Basic Nested Array Replace: Display all elements of an Array", () => {
  expect(
    formatString(
      "I'm {{:name}} and I'm with my friends! {{:friends.@0-}}.",
      TEST_DATA
    )
  ).toBe(
    "I'm Tiger and I'm with my friends! Orange Shower B1 B2 Princess Marshaa."
  );
});

test("Test Case #3 - Basic Nested Array Replace: Display all elements of an Array", () => {
  expect(
    formatString(
      "I'm {{:name}} and I'm with my enemy {{:enemies.@0.name}}.",
      TEST_DATA
    )
  ).toBe("I'm Tiger and I'm with my enemy rat.");
});

test("Test Case #4 - Basic Nested Array Replace: Deep Display all elements of an Array", () => {
  expect(
    formatString(
      "I'm a {{:bio.kind.race}} and these are my enemies: {{ :enemies.@0-.name}}.",
      TEST_DATA
    )
  ).toBe("I'm a cat and these are my enemies: rat ant lizard.");
});

test("Test Case #5 - Basic Nested Array Replace: Deep Display all elements of an Array", () => {
  expect(formatString("{{:numbers.@0-.@0}}.", TEST_DATA)).toBe("0 6.");
});

test("Test Case #6 - Basic Nested Array Replace: Deep Display all elements of an Array", () => {
  expect(formatString("{{:numbers2.@0-.@0-.@0-}}.", TEST_DATA)).toBe(
    "0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16."
  );
});

test("Test Case #7 - Basic Nested Array Replace: Deep Display all elements of an Array", () => {
  expect(formatString("{{:numbers2.@0-.@1.@0-}}.", TEST_DATA)).toBe(
    "6 7 8 9 10 16."
  );
});

test("Test Case #8 - Array + Undefined with Piping Boundaries", () => {
  /**
   * Test for exception. The string parser we have for accessing array props automatically
   * converts `undefined` (if it couldn't find the props like the example below) to string "undefined".
   */
  expect(
    formatString("{{:arr.@0-.a|!toUpperCase}}", {
      arr: [1, 2, { a: "b" }],
    })
  ).toBe("undefined undefined B");
});

test("Test Case #9 - Custom Pipes", () => {
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
  expect(
    formatString(
      "{{ :arr.@0-.a | replaceX --> !toLowerCase }}",
      {
        arr: [1, 2, { a: "B" }],
      },
      OPTS
    )
  ).toBe("undefined undefined x");
});

test("Test Case #10 - Very Deep Array Access", () => {
  // numbers3: [[[[1,2]]]],
  expect(formatString("{{ :numbers3.@0.@0.@0.@0}}", TEST_DATA)).toBe("1");
});

test("Test Case #11 - Array with boolean", () => {
  expect(formatString("{{ :arrBool.@0-}}", TEST_DATA)).toBe(
    "true true false true"
  );
});

test("Test Case #12 - Array with boolean + Pipe", () => {
  //boolean values should not be affected by pipes
  expect(formatString("{{ :arrBool.@0- | !toUpperCase }}", TEST_DATA)).toBe(
    "true true false true"
  );
});

test("Test Case #13 - Array with boolean, null and undefined types", () => {
  //undefined, null, and boolean values should not be affected by pipes
  expect(formatString("{{ :undef.@0- | !toUpperCase }}", TEST_DATA)).toBe(
    "undefined null true false B"
  );
});
