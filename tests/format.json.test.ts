import { formatString } from "../src";
import { JSON_TEST_DATA } from "./data";

test(`Test case #1 - Direct JSON Access`, () => {
  expect(formatString("Hello {{:!raw.name}}.", JSON_TEST_DATA)).toBe(
    "Hello Tiger."
  );
});

test(`Test case #2 - Direct JSON Access with pipe`, () => {
  expect(
    formatString("Hello {{:!raw.name | !toUpperCase }}.", JSON_TEST_DATA)
  ).toBe("Hello TIGER.");
});

test(`Test case #3 - Deep JSON Access`, () => {
  expect(
    formatString(
      "A random number: {{:!raw.!child.randomNumber | !toUpperCase }}.",
      JSON_TEST_DATA
    )
  ).toBe("A random number: 69.");
});

test(`Test case #4 - Deep JSON Access with pipe`, () => {
  expect(
    formatString(
      "Favorite team: {{:!raw.!child.!child.team | !toUpperCase }}.",
      JSON_TEST_DATA
    )
  ).toBe("Favorite team: TEAM 3&5 - GSW.");
});

test(`Test case #5 - Deep JSON Access with Array and Piped`, () => {
  expect(
    formatString(
      "Favorite team: {{:!raw.!child.!child.members.@0- | !toUpperCase }}.",
      JSON_TEST_DATA
    )
  ).toBe("Favorite team: STEPH DRAY KLAY DURANT true null false null."); //JSON stringify converts `undefined` into a `null` value
});

test(`Test case #6 - Accessing Complex Deep JSON Data With Array Range`, () => {
  expect(
    formatString(
      "Don't forget to {{ :!raw.!child.!child.complexChild.@0-.!data.bio.playful.word.eat | !toUpperCase }} if you have time.",
      JSON_TEST_DATA
    )
  ).toBe("Don't forget to ENKA ENKA if you have time."); //JSON stringify converts `undefined` into a `null` value
});
