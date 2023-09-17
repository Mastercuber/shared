import {beforeEach, describe, expect, it} from "vitest";
import {CyclicDoublyLinkedList, DoublyLinkedList, ILinkedList, IList, LinkedList, List} from "../src";

function linkedListTests(list: ILinkedList<number>) {
  commonListTests(list)
  describe("first/last element", () => {
    beforeEach(() => {
      list.clear()
    })
    it("adds first and last elements correctly", () => {
      expect(list.size).toBe(0)
      list.addFirst(5)
      expect(list.getLast()).toBe(5)
      list.addFirst(4)
      list.addFirst(3)
      list.addFirst(2)
      list.addFirst(1)
      expect(list.size).toBe(5)
      expect(list.getFirst()).toBe(1)
      expect(list.get(0)).toBe(1)
      expect(list.get(1)).toBe(2)
      expect(list.get(2)).toBe(3)
      expect(list.get(3)).toBe(4)
      expect(list.get(4)).toBe(5)
      expect(list.getLast()).toBe(5)
      list.clear()

      expect(list.size).toBe(0)
      list.addLast(1)
      list.addLast(2)
      list.addLast(3)
      list.addLast(4)
      list.addLast(5)
      expect(list.size).toBe(5)
      expect(list.getFirst()).toBe(1)
      expect(list.get(0)).toBe(1)
      expect(list.get(1)).toBe(2)
      expect(list.get(2)).toBe(3)
      expect(list.get(3)).toBe(4)
      expect(list.get(4)).toBe(5)
      expect(list.getLast()).toBe(5)
      list.clear()

      expect(list.size).toBe(0)
      list.add(3)
      list.add(4)
      list.addFirst(2)
      list.addFirst(1)
      list.addLast(5)
      list.addFirst(0)
      list.addLast(6)
      expect(list.size).toBe(7)
      expect(list.getFirst()).toBe(0)
      expect(list.get(0)).toBe(0)
      expect(list.get(1)).toBe(1)
      expect(list.get(2)).toBe(2)
      expect(list.get(3)).toBe(3)
      expect(list.get(4)).toBe(4)
      expect(list.get(5)).toBe(5)
      expect(list.get(6)).toBe(6)
      expect(list.getLast()).toBe(6)
    })
    it("removes first and last items correctly", () => {
      list.add(1)
      list.add(2)
      list.add(3)
      list.add(4)
      list.add(5)
      expect(list.size).toBe(5)
      expect(list.removeFirst()).toBeTruthy()
      expect(list.size).toBe(4)
      expect(list.getFirst()).toBe(2)
      expect(list.removeFirst()).toBeTruthy()
      expect(list.getFirst()).toBe(3)
      expect(list.removeFirst()).toBeTruthy()
      expect(list.getFirst()).toBe(4)
      expect(list.getLast()).toBe(5)
      expect(list.removeFirst()).toBeTruthy()
      expect(list.getFirst()).toBe(5)
      expect(list.getLast()).toBe(5)
      expect(list.removeFirst()).toBeTruthy()
      expect(list.removeFirst()).toBeFalsy()
      expect(() => list.getFirst()).toThrowError("no such element")
      expect(() => list.getLast()).toThrowError("no such element")
      expect(list.size).toBe(0)

      list.add(1)
      list.add(2)
      list.add(3)
      list.add(4)
      list.add(5)
      expect(list.size).toBe(5)
      expect(list.removeLast()).toBeTruthy()
      expect(list.getLast()).toBe(4)
      expect(list.removeLast()).toBeTruthy()
      expect(list.getLast()).toBe(3)
      expect(list.removeLast()).toBeTruthy()
      expect(list.getLast()).toBe(2)
      expect(list.removeLast()).toBeTruthy()
      expect(list.getLast()).toBe(1)
      list.add(2)
      expect(list.getLast()).toBe(2)
      expect(list.removeLast()).toBeTruthy()
      expect(list.removeLast()).toBeTruthy()
      expect(list.removeLast()).toBeFalsy()
      expect(() => list.getFirst()).toThrowError("no such element")
      expect(() => list.getLast()).toThrowError("no such element")
      expect(list.size).toBe(0)
      list.clear()

      list.add(1)
      list.add(2)
      expect(list.size).toBe(2)
      expect(list.removeLast()).toBeTruthy()
      expect(list.size).toBe(1)
      expect(list.removeLast()).toBeTruthy()
      expect(list.size).toBe(0)
      expect(list.removeLast()).toBeFalsy()
      list.clear()

      list.add(1)
      list.add(2)
      expect(list.size).toBe(2)
      expect(list.removeFirst()).toBeTruthy()
      expect(list.size).toBe(1)
      expect(list.removeFirst()).toBeTruthy()
      expect(list.size).toBe(0)
      expect(list.removeFirst()).toBeFalsy()
    })
  })
}

function commonListTests(list: IList<number>) {
  describe("common list tests", () => {
    beforeEach(() => {
      list.clear()
    })
    describe("add items", () => {
      it('should add "null" items', () => {
        list.add(null!)
        list.add(undefined!)
        expect(list.size).toBe(1)
        expect(list.get(0)).toBeNull()
      });
      it('should not add "undefined"', () => {
        list.add(undefined!)
        expect(list.size).toBe(0)
      });
      it("adds items (3 elements)", () => {
        list.add(-100)
        list.add(-10)
        list.add(-1)

        expect(list.get(0)).toBe(-100)
        expect(list.get(1)).toBe(-10)
        expect(list.get(2)).toBe(-1)
        expect(list.size).toBe(3)
        list.clear()

        list.add(1)
        list.add(10)
        list.add(100)

        expect(list.get(0)).toBe(1)
        expect(list.get(1)).toBe(10)
        expect(list.get(2)).toBe(100)
        expect(list.size).toBe(3)
      })
      it('adds items (6 elements)', () => {
        expect(list.isEmpty()).toBeTruthy()
        expect(() => list.get(0)).toThrowError("no such element")

        list.add(-1)
        list.add(0)
        list.add(1)
        list.add(2)
        list.add(3)
        list.add(4)

        expect(list.get(0)).toBe(-1)
        expect(list.get(1)).toBe(0)
        expect(list.get(2)).toBe(1)
        expect(list.get(3)).toBe(2)
        expect(list.get(4)).toBe(3)
        expect(list.get(5)).toBe(4)
        expect(list.size).toBe(6)
      });
      it('adds items (alternating list)', () => {
        expect(list.isEmpty()).toBeTruthy()
        expect(() => list.get(0)).toThrowError("no such element")

        list.add(-1)
        list.add(1)
        list.add(0)
        list.add(-2)
        list.add(2)
        list.add(-3)
        list.add(3)
        list.add(-4)
        list.add(4)
        list.add(-5)
        list.add(5)
        list.add(-6)
        list.add(6)

        expect(list.get(0)).toBe(-1)
        expect(list.get(1)).toBe(1)
        expect(list.get(2)).toBe(0)
        expect(list.get(3)).toBe(-2)
        expect(list.get(4)).toBe(2)
        expect(list.get(5)).toBe(-3)
        expect(list.get(6)).toBe(3)
        expect(list.get(7)).toBe(-4)
        expect(list.get(8)).toBe(4)
        expect(list.get(9)).toBe(-5)
        expect(list.get(10)).toBe(5)
        expect(list.get(11)).toBe(-6)
        expect(list.get(12)).toBe(6)
        expect(list.size).toBe(13)
      });
    })
    describe("get items", () => {
      it('should get items', () => {
        list.add(1)
        list.add(2)
        list.add(3)
        expect(list.get(0)).toBe(1)
        expect(list.get(1)).toBe(2)
        expect(list.get(2)).toBe(3)
        list.clear()

        list.add(-1)
        list.add(0)
        list.add(1)
        expect(list.get(0)).toBe(-1)
        expect(list.get(1)).toBe(0)
        expect(list.get(2)).toBe(1)
        list.clear()

        list.add(-1)
        list.add(-2)
        list.add(-3)
        expect(list.get(0)).toBe(-1)
        expect(list.get(1)).toBe(-2)
        expect(list.get(2)).toBe(-3)
      });
      it('should get "null" values', () => {
        list.add(null!)
        list.add(null!)
        list.add(2)
        list.add(null!)
        list.add(null!)
        expect(list.size).toBe(5)
        expect(list.get(0)).toBeNull()
        expect(list.get(1)).toBeNull()
        expect(list.get(2)).toBe(2)
        expect(list.get(3)).toBeNull()
        expect(list.get(4)).toBeNull()
      });
    })
    describe("set items", () => {
      it('should set "null" values', () => {
        list.add(10)
        list.add(-10)
        expect(list.set(0, null!)).toBeTruthy()
        expect(list.get(0)).toBeNull()
        expect(list.size).toBe(2)
      });
      it('should not set "undefined" values', () => {
        list.add(0)
        list.add(-1)
        expect(list.set(1, undefined!)).toBeFalsy()
        expect(list.size).toBe(2)
        expect(list.get(1)).toBe(-1)
      });
      it('should set items', () => {
        list.add(-2)
        list.add(-1)
        list.add(0)
        list.add(1)
        list.add(2)

        expect(list.set(2, 10)).toBeTruthy()
        expect(list.set(1, 1)).toBeTruthy()
        expect(list.set(0, -4)).toBeTruthy()

        expect(list.get(2)).toBe(10)
        expect(list.get(1)).toBe(1)
        expect(list.get(0)).toBe(-4)
      });
      it('should return false on unknown index', () => {
        expect(list.set(-1, null!)).toBeFalsy()
        expect(list.set(0, null!)).toBeFalsy()
        expect(list.set(1, null!)).toBeFalsy()
      });
    })
    describe("remove items", () => {
      it("should remove items", () => {
        list.add(1)
        expect(list.size).toBe(1)
        expect(list.remove(0)).toBeTruthy()
        expect(list.size).toBe(0)

        list.add(1)
        list.add(2)
        expect(list.size).toBe(2)
        expect(list.remove(0)).toBeTruthy()
        expect(list.remove(0)).toBeTruthy()
        expect(list.remove(0)).toBeFalsy()
        expect(list.size).toBe(0)

        list.add(1)
        list.add(2)
        expect(list.size).toBe(2)
        expect(list.get(1)).toBe(2)
        expect(list.remove(1)).toBeTruthy()
        expect(list.get(0)).toBe(1)
        list.add(2)
        expect(list.get(0)).toBe(1)
        expect(list.get(1)).toBe(2)
        expect(list.remove(1)).toBeTruthy()
        expect(list.get(0)).toBe(1)
        expect(list.size).toBe(1)
        expect(list.remove(0)).toBeTruthy()
        expect(() => list.get(0)).toThrowError("no such element")

        list.add(1)
        list.add(2)
        list.add(3)
        expect(list.size).toBe(3)
        expect(list.remove(2)).toBeTruthy()
        expect(list.get(0)).toBe(1)
        expect(list.get(list.size - 1)).toBe(2)
        expect(list.remove(0)).toBeTruthy()
        expect(list.size).toBe(1)
        list.clear()

        list.add(1)
        list.add(2)
        list.add(3)
        list.add(4)
        expect(list.size).toBe(4)
        expect(list.get(0)).toBe(1)
        expect(list.get(list.size - 1)).toBe(4)
        expect(list.remove(2))
        expect(list.get(0)).toBe(1)
        expect(list.get(list.size - 1)).toBe(4)
        expect(list.remove(1))
        expect(list.get(0)).toBe(1)
        expect(list.get(list.size - 1)).toBe(4)
        expect(list.size).toBe(2)
      })
    })
    it("should have correct size", () => {
      expect(list.isEmpty()).toBeTruthy()
      expect(list.size).toBe(0)
      list.add(1)
      expect(list.size).toBe(1)
      list.add(2)
      expect(list.size).toBe(2)
      list.add(3)
      expect(list.size).toBe(3)
      list.remove(0)
      expect(list.size).toBe(2)
      list.remove(0)
      expect(list.size).toBe(1)
      list.get(0)
      expect(list.size).toBe(1)
      list.remove(0)
      expect(list.size).toBe(0)
      expect(list.remove(0)).toBeFalsy()

      list.add(-1)
      list.add(0)
      list.add(1)
      expect(list.size).toBe(3)
      list.remove(0)
      expect(list.size).toBe(2)
      list.get(0)
      expect(list.size).toBe(2)
      list.remove(0)
      expect(list.size).toBe(1)
      list.remove(0)
      expect(list.size).toBe(0)
      expect(() => list.get(0)).toThrowError("no such element")
    })
    it("should clear the list", () => {
      expect(list.size).toBe(0)
      expect(() => list.get(0)).toThrowError("no such element")

      list.add(1)
      list.add(2)
      list.add(3)

      expect(list.size).toBe(3)
      list.clear()
      expect(list.isEmpty()).toBeTruthy()
      expect(() => list.get(0)).toThrowError("no such element")
    })
  })
}

function iteratorTests(list: IList<number>) {
  describe("iterator tests", () => {
    beforeEach(() => list.clear())
    it('iterates through list like a queue (FIFO)', () => {
      list.add(1)
      list.add(2)
      list.add(3)

      let results = [1, 2, 3]
      for (let number of list) {
        expect(number).toBe(results.shift())
      }
      expect(list.size).toBe(3)
      expect(results).toHaveLength(0)

      results = [1, 2, 3]
      for (let number of list) {
        expect(number).toBe(results.shift())
      }
      expect(list.size).toBe(3)
      expect(results).toHaveLength(0)

      list.clear()
      list.add(30)
      list.add(-30)
      list.add(10)
      list.add(40)

      expect(list.size).toBe(4)
      results = [30, -30, 10, 40]
      for (let number of list) {
        expect(number).toBe(results.shift())
      }
      expect(list.size).toBe(4)
      expect(results).toHaveLength(0)
    });
    it('iterates through list like a stack (LIFO) with a reverse iterator', () => {
      list.add(-1)
      list.add(-2)
      list.add(-3)
      let results = [-1, -2, -3]
      expect(list.size).toBe(3)
      for (let number of list.reverseIterator()) {
        expect(number).toBe(results.pop())
      }
      expect(list.size).toBe(3)
      expect(results).toHaveLength(0)

      list.clear()
      list.add(30)
      list.add(-30)
      list.add(10)
      list.add(40)

      results = [30, -30, 10, 40]
      expect(list.size).toBe(4)
      for (let number of list.reverseIterator()) {
        expect(number).toBe(results.pop())
      }
      expect(list.size).toBe(4)
      expect(results).toHaveLength(0)
    });
  })
}

describe("lists", () => {
  describe("list backed by native array", () => {
    const list = new List<number>()
    commonListTests(list)
    describe("iterator tests", () => {
      beforeEach(() => list.clear())
      it("iterates through list like a stack (LIFO)", () => {
        list.add(1)
        list.add(2)
        list.add(3)
        const results = [1, 2, 3]
        expect(list.size).toBe(3)
        for (let number of list) {
          expect(number).toBe(results.pop())
        }
        expect(list.size).toBe(3)
        expect(results).toHaveLength(0)
      })
      it('iterates through list like a queue (FIFO) with a reverse iterator', () => {
        list.add(1)
        list.add(2)
        list.add(3)
        let results = [1, 2, 3]
        expect(list.size).toBe(3)
        for (let number of list.reverseIterator()) {
          expect(number).toBe(results.shift())
        }
        expect(list.size).toBe(3)
        expect(results).toHaveLength(0)
        results = [1, 2, 3]
        for (let number of list.reverseIterator()) {
          expect(number).toBe(results.shift())
        }
        expect(list.size).toBe(3)
        expect(results).toHaveLength(0)
      });
    })
  })
  describe("linked list", () => {
    const list = new LinkedList<number>()
    linkedListTests(list)
    iteratorTests(list)
  })
  describe("doubly linked list", () => {
    const list = new DoublyLinkedList<number>()
    linkedListTests(list)
    iteratorTests(list)
  })
  describe("cyclic linked list", () => {
    const list = new CyclicDoublyLinkedList<number>()
    linkedListTests(list)
    iteratorTests(list)
  })
})
