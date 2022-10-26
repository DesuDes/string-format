export const TEST_DATA = {
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
  numbers3: [[[[1, 2]]]],
  arrBool: [true, true, false, true],
  undef: [undefined, null, true, false, "b"],
};

const JSON_CHILD_2 = {
  team: "Team 3&5 - GSW",
  year: [2014, 2019],
  members: ["Steph", "Dray", "Klay", "Durant", true, undefined, false, null], //json.stringify converts `undefined` to `null`
  complexChild: [
    { data: JSON.stringify(TEST_DATA) },
    { data: JSON.stringify(TEST_DATA) },
  ],
};

const JSON_CHILD_1 = {
  randomNumber: 69,
  child: JSON.stringify(JSON_CHILD_2),
};

const JSON_MAIN = {
  name: "Tiger",
  age: 30,
  city: "New York",
  child: JSON.stringify(JSON_CHILD_1),
};

export const JSON_TEST_DATA = { raw: JSON.stringify(JSON_MAIN) };
