import { formatString } from "../src";
import { TEST_DATA } from "./data";

test(`Test case #1 - SQLQ`, () => {
  expect(
    formatString("{{:id | sqlq}}.", {
      id: "155 OR 1=1",
    })
  ).toBe("'155 OR 1=1'.");

  expect(
    formatString("{{:id | sqlStringEscape }}.", {
      id: "155 OR 1=1",
    })
  ).toBe("'155 OR 1=1'.");
});

test(`Test case #2 - Pipe chaining`, () => {
  expect(
    formatString("{{:id | sqlStringEscape --> !toLowerCase }}.", {
      id: "155 OR 1=1",
    })
  ).toBe("'155 or 1=1'.");

  expect(
    formatString(
      "{{:id | sqlStringEscape --> !toLowerCase --> reverseString }}.",
      {
        id: "155 OR 1=1",
      }
    )
  ).toBe("'1=1 ro 551'.");
});

test(`Test case #3 - Pipe chaining + Custom chain`, () => {
  expect(
    formatString(
      "{{:msg | aReplacer --> !toLowerCase }}.",
      {
        msg: "helLo a!",
      },
      {
        pipes: [
          {
            name: "aReplacer",
            action: (value: any) => (value + "").replace("a", "sheeba"),
          },
        ],
      }
    )
  ).toBe("hello sheeba!.");
});
