import { test } from "node:test";
import assert from "node:assert/strict";
import { parseHost } from "./domains";

test("parseHost: loopback is marketing, www custom domain maps to the saved apex", () => {
  assert.deepEqual(parseHost("127.0.0.1:3000"), { kind: "marketing" });
  assert.deepEqual(parseHost("localhost"), { kind: "marketing" });
  assert.deepEqual(parseHost("www.Shop.com"), { kind: "custom", key: "shop.com" });
  assert.deepEqual(parseHost("shop.com"), { kind: "custom", key: "shop.com" });
});
