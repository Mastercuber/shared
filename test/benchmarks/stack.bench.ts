import { bench, describe, expect } from 'vitest'
import c from 'chalk'
import { IStack, LinkedStack, Stack } from '../../src'

const options = {
  time: 50,
  iterations: 1000,
  warmupTime: 100,
  warmupIterations: 1000,
}
function fill(stack: IStack<number>) {
  stack.push(5)
  stack.push(4)
  stack.push(3)
  stack.push(2)
  stack.push(1)
}
describe(c.blue('stack (push)'), () => {
  function stackPushTest(stackType: new(options?: any) => IStack<number>) {
    const stack = new stackType()
    fill(stack)
  }

  bench('Stack', () => {
    stackPushTest(Stack)
  }, options)
  bench('LinkedStack', () => {
    stackPushTest(LinkedStack)
  }, options)
})
describe(c.blue('stack (pop)'), () => {
  function stackPopTest(stackType: new(options?: any) => IStack<number>) {
    const stack = new stackType()
    fill(stack)
    expect(stack.pop()).toBe(1)
    expect(stack.pop()).toBe(2)
    expect(stack.pop()).toBe(3)
    expect(stack.pop()).toBe(4)
    expect(stack.pop()).toBe(5)
  }

  bench('Stack', () => {
    stackPopTest(Stack)
  }, options)
  bench('LinkedStack', () => {
    stackPopTest(LinkedStack)
  }, options)
})
