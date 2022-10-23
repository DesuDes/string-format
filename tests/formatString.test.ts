import { formatString } from "../src";

const TEST_DATA = {
  greeting: "Hello",
  name: "Tiger",
  place: "Makati",
  bio: {
    age: 11,
    kind: {
      race: "cat",
      type: "tabby",
    },
    activity: "eating",
    playful: {
      word: {
        eat: "enka",
      },
    },
  },
  friends: ["Orange", "Shower", "B1", "B2", "Princess", "Marshaa"],
  enemies: [
    {
      name: "rat",
    },
    {
      name: "ant",
    },
    {
      name: "lizard",
    },
  ],
  numbers: [
    [0, 1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10],
  ],
  numbers2: [
    [
      [0, 1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10],
    ],
    [[11, 12, 13, 14, 15], [16]],
  ],
};

test(`Test case #1 - Basic Replace`, () => {
  expect(
    formatString(
      "{{:greeting}} {{:name}}! How are you doin' in {{:place }}?",
      TEST_DATA
    )
  ).toBe("Hello Tiger! How are you doin' in Makati?");
});

test(`Test case #2 - Basic Nested Replace`, () => {
  expect(formatString("I'm {{:bio.activity}}.", TEST_DATA)).toBe("I'm eating.");
});

test(`Test case #3 - Basic Nested Replace`, () => {
  expect(
    formatString(
      "I'm going to {{:bio.playful.word.eat}} {{:bio.playful.word.eat}} in {{:place}} and I'm a {{:bio.kind.type}} {{:bio.kind.race}}.",
      TEST_DATA
    )
  ).toBe("I'm going to enka enka in Makati and I'm a tabby cat.");
});

test("Test Case #4 - Basic Nested Array Replace", () => {
  expect(
    formatString(
      "I'm {{:name}} and I'm with {{:friends.@0}}, and {{:friends.@1}}.",
      TEST_DATA
    )
  ).toBe("I'm Tiger and I'm with Orange, and Shower.");
});

test("Test Case #5 - Basic Nested Array Replace: Display all elements of an Array", () => {
  expect(
    formatString(
      "I'm {{:name}} and I'm with my friends! {{:friends.@0-}}.",
      TEST_DATA
    )
  ).toBe(
    "I'm Tiger and I'm with my friends! Orange Shower B1 B2 Princess Marshaa."
  );
});

test("Test Case #5 - Basic Nested Array Replace: Display all elements of an Array", () => {
  expect(
    formatString(
      "I'm {{:name}} and I'm with my enemy {{:enemies.@0.name}}.",
      TEST_DATA
    )
  ).toBe("I'm Tiger and I'm with my enemy rat.");
});

test("Test Case #6 - Basic Nested Array Replace: Deep Display all elements of an Array", () => {
  expect(
    formatString(
      "I'm a {{:bio.kind.race}} and these are my enemies: {{ :enemies.@0-.name}}.",
      TEST_DATA
    )
  ).toBe("I'm a cat and these are my enemies: rat ant lizard.");
});

test("Test Case #7 - Basic Nested Array Replace: Deep Display all elements of an Array", () => {
  expect(formatString("{{:numbers.@0-.@0}}.", TEST_DATA)).toBe("0 6.");
});

test("Test Case #8 - Basic Nested Array Replace: Deep Display all elements of an Array", () => {
  expect(formatString("{{:numbers2.@0-.@0-.@0-}}.", TEST_DATA)).toBe(
    "0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16."
  );
});

test("Test Case #9 - Basic Nested Array Replace: Deep Display all elements of an Array", () => {
  expect(formatString("{{:numbers2.@0-.@1.@0-}}.", TEST_DATA)).toBe(
    "6 7 8 9 10 16."
  );
});
