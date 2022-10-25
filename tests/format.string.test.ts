import { formatString } from "../src";
import { TEST_DATA } from "./data";

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

test("Test Case #4 - Basic Nested Pipe with Macro To Lowercase", () => {
  expect(formatString("{{ :data | !toLowerCase }}.", { data: "HELLO" })).toBe(
    "hello."
  );
});

test("Test Case #5 - Empty Data", () => {
  expect(formatString("{{ :data | !toLowerCase }}.", {})).toBe("undefined.");
});

test("Test Case #6 - No Template", () => {
  /**
   * Test for exception. The string parser we have for accessing array props automatically
   * converts `undefined` (if it couldn't find the props like the example below) to string "undefined".
   */
  expect(
    formatString("Team 5.", {
      a: 5,
    })
  ).toBe("Team 5.");
});

test("Test Case #6 - Null, Undefined, and Invalid Values", () => {
  /**
   * Test for exception.
   * converts `undefined` (if it couldn't find the props like the example below) to string "undefined".
   */
  expect(formatString("{{ :someValue }}", null)).toBe("null");
  expect(formatString("{{ :someValue }}", undefined)).toBe("undefined");
  expect(formatString("{{ :someValue }}", 0)).toBe("0");
});
