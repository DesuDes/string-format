import { splitTemplate } from "../src";

const TESTCASE_1 = "Hello {{:name}}! Welcome to {{:place}}.";

const TESTCASE_1_EXPECTED_RESULT = [
  "Hello ",
  "{{:name}}",
  "! Welcome to ",
  "{{:place}}",
  ".",
];

const TESTCASE_2 = "{{:name}}{{    :place}}.";
const TESTCASE_2_EXPECTED_RESULT = ["{{:name}}", "{{    :place}}", "."];

test(`Testcase #1: Split template regex => ${TESTCASE_1}`, () => {
  expect(splitTemplate(TESTCASE_1)).toStrictEqual(TESTCASE_1_EXPECTED_RESULT);
});

test(`Testcase #2: Split template regex => ${TESTCASE_2}`, () => {
  expect(splitTemplate(TESTCASE_2)).toStrictEqual(TESTCASE_2_EXPECTED_RESULT);
});

test(`Testcase #3: Split template regex => ${TESTCASE_2}`, () => {
  expect(splitTemplate("{{}}{{:tiger}}!")).toStrictEqual([
    "{{}}",
    "{{:tiger}}",
    "!",
  ]);
});

test(`Testcase #4: Split template regex => ${TESTCASE_2}`, () => {
  expect(splitTemplate("{{}}{{:tiger|somePipe}}!")).toStrictEqual([
    "{{}}",
    "{{:tiger|somePipe}}",
    "!",
  ]);
});
