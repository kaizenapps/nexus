import { expect, test } from "vitest";
import { cn } from "./utils";

test("cn merges classes correctly", () => {
    expect(cn("a", "b")).toBe("a b");
});

test("cn handles conditional classes", () => {
    expect(cn("a", false && "b", "c")).toBe("a c");
    expect(cn("a", true && "b", "c")).toBe("a b c");
});

test("cn handles object inputs", () => {
    expect(cn("a", { b: true, c: false })).toBe("a b");
});

test("cn handles array inputs", () => {
    expect(cn(["a", "b"], "c")).toBe("a b c");
});

test("cn handles tailwind conflicts", () => {
    // Test that twMerge correctly resolves tailwind class conflicts
    expect(cn("p-4", "p-2")).toBe("p-2");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
});

test("cn handles complex combinations", () => {
    expect(
        cn("base", { "is-active": true }, ["extra"], undefined, null, false)
    ).toBe("base is-active extra");
});
