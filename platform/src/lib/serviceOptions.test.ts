import { test } from "node:test";
import assert from "node:assert/strict";
import { parseServiceOptions, describeSelection } from "./serviceOptions";

test("parseServiceOptions sanitises groups and values", () => {
  assert.deepEqual(parseServiceOptions("not json"), []);
  assert.deepEqual(parseServiceOptions('[{"name":" Size ","values":["Large"," Large","",5]},{"name":"","values":["x"]},{"name":"Empty","values":[]}]'), [
    { name: "Size", values: ["Large"] },
  ]);
  assert.equal(parseServiceOptions(Array.from({ length: 10 }, (_, i) => ({ name: `G${i}`, values: ["a"] }))).length, 6);
});

test("describeSelection joins chosen values", () => {
  assert.equal(describeSelection({ Size: "Large", Finish: "", Colour: "Black" }), "Size: Large · Colour: Black");
});

test("parseServiceOptions keeps safe images and hex colours only for listed values", () => {
  const [g] = parseServiceOptions([{ name: "Colour", values: ["Black", "Red"], colors: { Black: "#111", Red: "red", Ghost: "#fff" }, images: { Black: "https://x.test/a.jpg", Red: "javascript:alert(1)" } }]);
  assert.deepEqual(g.colors, { Black: "#111" });
  assert.deepEqual(g.images, { Black: "https://x.test/a.jpg" });
});
