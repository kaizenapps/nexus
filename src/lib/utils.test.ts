import { test } from "node:test";
import assert from "node:assert";
import { cn } from "./utils.ts";

test("cn merges classes correctly", () => {
    assert.strictEqual(cn("a", "b"), "a b");
});

test("cn handles conditional classes", () => {
    assert.strictEqual(cn("a", false && "b", "c"), "a c");
    assert.strictEqual(cn("a", true && "b", "c"), "a b c");
});

test("cn handles object inputs", () => {
    assert.strictEqual(cn("a", { b: true, c: false }), "a b");
});

test("cn handles array inputs", () => {
    assert.strictEqual(cn(["a", "b"], "c"), "a b c");
});

test("cn handles tailwind conflicts", () => {
    // Note: conflict resolution depends on tailwind-merge
    assert.strictEqual(cn("p-4", "p-2"), "p-2");
    assert.strictEqual(cn("text-red-500", "text-blue-500"), "text-blue-500");
});

test("cn handles complex combinations", () => {
    assert.strictEqual(
        cn("base", { "is-active": true }, ["extra"], undefined, null, false),
        "base is-active extra"
    );
});
