import {beforeEach, describe, expect, it} from "vitest";
import {IStack, LinkedStack, Stack} from "../src";

function stackTests(stack: IStack<number>) {
  beforeEach(() => {
    stack.clear()
  })
  it("adds items", () => {
    expect(stack.isEmpty()).toBeTruthy()
    expect(() => stack.pop()).toThrowError("no such element")

    stack.push(-1)
    stack.push(0)
    stack.push(1)
    stack.push(2)
    stack.push(3)
    stack.push(4)

    expect(stack.pop()).toBe(4)
    expect(stack.pop()).toBe(3)
    expect(stack.pop()).toBe(2)
    expect(stack.pop()).toBe(1)
    expect(stack.pop()).toBe(0)
    expect(stack.pop()).toBe(-1)
    expect(() => stack.pop()).toThrowError("no such element")

    stack.push(-100)
    stack.push(-10)
    stack.push(-1)

    expect(stack.pop()).toBe(-1)
    expect(stack.pop()).toBe(-10)
    expect(stack.pop()).toBe(-100)
    expect(() => stack.pop()).toThrowError("no such element")

    stack.push(1)
    stack.push(10)
    stack.push(100)

    expect(stack.pop()).toBe(100)
    expect(stack.pop()).toBe(10)
    expect(stack.pop()).toBe(1)
    expect(() => stack.pop()).toThrowError("no such element")
  })
  it('gets items', () => {
    stack.push(0)
    stack.push(1)
    stack.push(2)
    stack.push(3)

    expect(stack.pop()).toBe(3)
    expect(stack.pop()).toBe(2)
    expect(stack.pop()).toBe(1)
    expect(stack.pop()).toBe(0)
  });
  it("has correct size", () => {
    expect(stack.isEmpty()).toBeTruthy()
    expect(stack.size).toBe(0)
    stack.push(1)
    expect(stack.size).toBe(1)
    stack.push(2)
    expect(stack.size).toBe(2)
    stack.push(3)
    expect(stack.size).toBe(3)
    stack.pop()
    expect(stack.size).toBe(2)
    stack.pop()
    expect(stack.size).toBe(1)
    stack.peek()
    expect(stack.size).toBe(1)
    stack.pop()
    expect(stack.size).toBe(0)
    expect(() => stack.pop()).toThrowError("no such element")

    stack.push(-1)
    stack.push(0)
    stack.push(1)
    expect(stack.size).toBe(3)
    stack.pop()
    expect(stack.size).toBe(2)
    stack.peek()
    expect(stack.size).toBe(2)
    stack.pop()
    expect(stack.size).toBe(1)
    stack.pop()
    expect(stack.size).toBe(0)
    expect(() => stack.pop()).toThrowError("no such element")
  })
  it("clears the stack", () => {
    expect(stack.isEmpty()).toBeTruthy()
    expect(() => stack.pop()).toThrowError("no such element")

    stack.push(1)
    stack.push(2)
    stack.push(3)

    expect(stack.size).toBe(3)
    stack.clear()
    expect(stack.isEmpty()).toBeTruthy()
    expect(() => stack.pop()).toThrowError("no such element")
  })
}

function iteratorTest(stack: IStack<number>) {
  it('iterates through stack LIFO', () => {
    stack.push(1)
    stack.push(2)
    stack.push(3)

    const results = [1, 2, 3]
    for (let number of stack) {
      expect(number).toBe(results.pop())
    }
  });
}

describe("stacks", () => {
  describe("stack with native array", () => {
    const stack = new Stack<number>()
    stackTests(stack)
    iteratorTest(stack)
  })
  describe("linked stack", () => {
    const stack = new LinkedStack<number>();
    stackTests(stack)
    iteratorTest(stack)
  })
})
