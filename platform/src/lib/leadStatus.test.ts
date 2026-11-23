import { test } from "node:test";
import assert from "node:assert/strict";
import { sameContact } from "./leadStatus";

test("sameContact matches phone by last 10 digits or email case-insensitively", () => {
  const a = { phone: "+91 73865 66625", email: "" };
  assert.ok(sameContact(a, { phone: "7386566625", email: "x@y.com" }));
  assert.ok(sameContact({ phone: "", email: "A@B.com " }, { phone: "1", email: "a@b.com" }));
  assert.ok(!sameContact({ phone: "", email: "" }, { phone: "", email: "" }));
  assert.ok(!sameContact({ phone: "12", email: "" }, { phone: "12", email: "" }));
});
