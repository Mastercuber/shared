import {beforeEach, describe, expect, it} from "vitest";
import {Collection, IStack, LinkedStack, Stack} from "../src";

function stackTests(stack: IStack<number>, stackType: new (collection: Collection<number>) => IStack<number>) {
  beforeEach(() => {
    stack.clear()
  })
  it('should construct a new Stack from a given collection', () => {
    let _stack = new stackType([-1, 0, 1])

    expect(_stack.size).toBe(3)
    expect(_stack.pop()).toBe(1)
    expect(_stack.pop()).toBe(0)
    expect(_stack.pop()).toBe(-1)
    expect(_stack.size).toBe(0)

    _stack = new LinkedStack([-1, 0, 1])
    expect(_stack.size).toBe(3)
    expect(_stack.pop()).toBe(1)
    expect(_stack.pop()).toBe(0)
    expect(_stack.pop()).toBe(-1)
    expect(_stack.size).toBe(0)
  });
  it('should be possible to add "null" values to the stack', () => {
    stack.push(null!)
    expect(stack.size).toBe(1)
    expect(stack.top()).toBeNull()
    expect(stack.pop()).toBeNull()
    expect(stack.size).toBe(0)

    stack.push(null!)
    stack.push(null!)
    expect(stack.size).toBe(2)
    expect(stack.top()).toBeNull()
    expect(stack.pop()).toBeNull()
    expect(stack.pop()).toBeNull()
    expect(stack.size).toBe(0)

    stack.push(null!)
    stack.push(null!)
    stack.push(null!)
    expect(stack.size).toBe(3)
    expect(stack.top()).toBeNull()
    expect(stack.pop()).toBeNull()
    expect(stack.pop()).toBeNull()
    expect(stack.pop()).toBeNull()
    expect(stack.size).toBe(0)
  });
  it('should not be possible to add "undefined" values to the stack', () => {
    stack.push(undefined!)
    expect(stack.size).toBe(0)
  });
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
    stack.top()
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
    stack.top()
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

    let results = [1, 2, 3]
    expect(stack.size).toBe(3)
    for (let number of stack) {
      expect(number).toBe(results.pop())
    }
    expect(stack.size).toBe(3)
    expect(results).toHaveLength(0)
    results = [1, 2, 3]
    for (let number of stack) {
      expect(number).toBe(results.pop())
    }
    expect(stack.size).toBe(3)
    expect(results).toHaveLength(0)
    stack.clear()
  });
}

describe("stacks", () => {
  describe("stack backed by native array", () => {
    const stack = new Stack<number>()
    stackTests(stack, Stack<number>)
    iteratorTest(stack)
  })
  describe("linked stack", () => {
    const stack = new LinkedStack<number>();
    stackTests(stack, LinkedStack<number>)
    iteratorTest(stack)
  })
})
