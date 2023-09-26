import {beforeAll, beforeEach, describe, expect, it} from "vitest";
import {FibonacciHeap, numberComparator, Ordering, stringComparator} from "../src";

// A bunch of tests of this test file are taken from "ts-fibonacci-heap" which is under the MIT license
// Copyright (c) 2014 Daniel Imms, http://www.growingwiththeweb.com
// See https://github.com/gwtw/ts-fibonacci-heap/tree/master/src/test
describe("fibonacci heap", () => {
  let heap: FibonacciHeap<number>
  beforeAll(() => {
    const comparator = (n1: number, n2: number) => {
      if (n1 === n2) return Ordering.EQ
      else if (n1 < n2) return Ordering.LT
      return Ordering.GT
    }
    heap = new FibonacciHeap<number>(comparator)
  })
  beforeEach(() => heap.clear())

  it('should insert strings into heap', () => {
    const heap = new FibonacciHeap<string>(stringComparator)
    const A1 = heap.insert("A")
    const A2 = heap.insert("A")
    const B = heap.insert("B")
    const C = heap.insert("C")
    expect(heap.size).toBe(4)
    expect(heap.extractMin()).toEqual(A1)
    expect(heap.extractMin()).toEqual(A2)
    expect(heap.extractMin()).toEqual(B)
    expect(heap.extractMin()).toEqual(C)
    expect(heap.size).toBe(0)
  });

  it('should create an empty heap', () => {
    expect(heap).not.toBeNull
  });
  it('should be possible to add "null" values to the heap', () => {
    heap.insert(null!)
    expect(heap.size).toBe(1)
    expect(heap.minimum().value).toBeNull()
    expect(heap.extractMin().value).toBeNull()
    expect(heap.size).toBe(0)

    heap.insert(null!)
    heap.insert(null!)
    expect(heap.size).toBe(2)
    expect(heap.minimum().value).toBeNull()
    expect(heap.extractMin().value).toBeNull()
    expect(heap.extractMin().value).toBeNull()
    expect(heap.size).toBe(0)

    heap.insert(null!)
    heap.insert(null!)
    heap.insert(null!)
    expect(heap.size).toBe(3)
    expect(heap.minimum().value).toBeNull()
    expect(heap.extractMin().value).toBeNull()
    expect(heap.extractMin().value).toBeNull()
    expect(heap.extractMin().value).toBeNull()
    expect(heap.size).toBe(0)
  });
  it('should not be possible to add "undefined" values to the heap', () => {
    const undef = heap.insert(undefined!)
    expect(undef).toBeUndefined()
    expect(heap.size).toBe(0)
  });
  describe("extract correct values", () => {
    it('should return correct values (bit bigger heap)', () => {
      heap.insert(-10)
      heap.insert(0)
      heap.insert(-20)
      heap.insert(-30)
      heap.insert(10)
      heap.insert(20)
      heap.insert(30)
      heap.insert(-40)
      heap.insert(40)
      heap.insert(-50)
      heap.insert(50)
      expect(heap.size).toBe(11)
      expect(heap.extractMin().value).toBe(-50)
      expect(heap.extractMin().value).toBe(-40)
      expect(heap.extractMin().value).toBe(-30)
      expect(heap.extractMin().value).toBe(-20)
      expect(heap.extractMin().value).toBe(-10)
      expect(heap.extractMin().value).toBe(0)
      expect(heap.extractMin().value).toBe(10)
      expect(heap.extractMin().value).toBe(20)
      expect(heap.extractMin().value).toBe(30)
      expect(heap.extractMin().value).toBe(40)
      expect(heap.extractMin().value).toBe(50)
      expect(heap.size).toBe(0)
    });
    it('should return the correct values', () => {
      heap.insert(0)
      heap.insert(1)
      heap.insert(2)
      expect(heap.size).toBe(3)
      expect(heap.extractMin().value).toBe(0)
      expect(heap.extractMin().value).toBe(1)
      expect(heap.extractMin().value).toBe(2)
      expect(heap.size).toBe(0)

      heap.insert(-1)
      heap.insert(0)
      heap.insert(-2)
      expect(heap.size).toBe(3)
      expect(heap.extractMin().value).toBe(-2)
      expect(heap.extractMin().value).toBe(-1)
      expect(heap.extractMin().value).toBe(0)
      expect(heap.size).toBe(0)

      heap.insert(-1) // {-1}
      heap.insert(1) // {-1, 1}
      expect(heap.extractMin().value).toBe(-1) // {1}
      heap.insert(-1) // {-1, 1}
      heap.insert(2) // {-1, 1, 2}
      expect(heap.extractMin().value).toBe(-1) // {1, 2}
      heap.insert(10) // {1, 2, 10}
      expect(heap.extractMin().value).toBe(1) // {2, 10}
      heap.insert(-10) // {-10, 2, 10}
      expect(heap.extractMin().value).toBe(-10) // {2, 10}
      expect(heap.extractMin().value).toBe(2) // {10}
      expect(heap.extractMin().value).toBe(10) // {}
    });
    it('should consolidate 8 nodes into a well formed order 2 tree', () => {
      const heap = new FibonacciHeap<number>(numberComparator);
      const node0 = heap.insert(0);
      const node1 = heap.insert(1);
      const node2 = heap.insert(2);
      const node3 = heap.insert(3);
      const node4 = heap.insert(4);

      // Extracting minimum should trigger consolidate.
      //
      //                       1
      //                      /|
      //  0--1--2--3--4  ->  3 2
      //                     |
      //                     4
      //
      expect(heap.extractMin().value).toBe(node0.value);
      expect(heap.size).toBe(4);
      expect(node1.parent).toBeFalsy()
      expect(numberComparator(node2.parent!.value!, node1.value!)).toEqual(Ordering.EQ)
      expect(numberComparator(node3.parent!.value!, node1.value!)).toEqual(Ordering.EQ)
      expect(numberComparator(node4.parent!.value!, node3.value!)).toEqual(Ordering.EQ)
      expect(numberComparator(node1.right!.value!, node1.value!)).toEqual(Ordering.EQ)
      expect(numberComparator(node2.right!.value!, node3.value!)).toEqual(Ordering.EQ)
      expect(numberComparator(node3.right!.value!, node2.value!)).toEqual(Ordering.EQ)
      expect(numberComparator(node4.right!.value!, node4.value!)).toEqual(Ordering.EQ)
      expect(numberComparator(node1.child!.value!, node2.value!)).toEqual(Ordering.EQ)
      expect(node2.child).toBeFalsy()
      expect(numberComparator(node3.child!.value!, node4.value!)).toEqual(Ordering.EQ)
      expect(node4.child).toBeFalsy()
    });
    it('should consolidate after extract min is called on a tree with a single tree in the root node list', () => {
      const heap = new FibonacciHeap<number>(numberComparator);
      const node0 = heap.insert(0);
      const node1 = heap.insert(1);
      const node2 = heap.insert(2);
      const node3 = heap.insert(3);
      heap.insert(4);
      heap.insert(5);
      heap.insert(6);
      heap.insert(7);
      heap.insert(8);

      // Extract minimum to trigger a consolidate nodes into a single Fibonacci tree.
      //
      //                                 __1
      //                                / /|
      //                               2 c d
      //  1--2--3--4--5--6--7--8  ->  /| |
      //                             a b f
      //                             |
      //                             e
      //
      expect(heap.extractMin().value).toBe(node0.value);

      // Delete the 2nd smallest node in the heap which is the child of the single node in the root
      // list. After this operation is performed the minimum node (1) is no longer pointing the minimum
      // child in the node list!
      //
      //      __1
      //     / /|         __1
      //    2 c d        / /|  Note that a in this illustration could also be b, the main thing
      //   /| |    ->   a c d  to take note of here is that a (or b) may not be the minimum child
      //  a b f        /| |    of 1 anymore, despite being the node it's linked to.
      //  |           e b f
      //  e
      //
      heap.delete(node2);

      // Extracting the minimum node at this point must trigger consolidate on the new list, otherwise
      // the next minimum may not be the actual minimum.
      //
      //
      //      __1
      //     / /|       a---c---d
      //    a c d  ->  /|   |      -> Consolidate now to ensure the heap's minimum is correct
      //   /| |       e b   f
      //  e b f
      //
      //
      expect(heap.extractMin().value).toBe(node1.value);
      expect(heap.minimum().value).toBe(node3.value);
    });
  })

  it('should have the correct size', () => {
    expect(() => heap.minimum()).toThrowError("no such element")
    expect(() => heap.extractMin()).toThrowError("no such element")
    expect(heap.size).toBe(0)
    expect(heap.isEmpty()).toBeTruthy()

    heap.insert(0)
    expect(heap.size).toBe(1)
    expect(heap.isEmpty()).toBeFalsy()

    heap.insert(-1)
    expect(heap.isEmpty()).toBeFalsy()
    expect(heap.size).toBe(2)


    heap.insert(-2)
    expect(heap.isEmpty()).toBeFalsy()
    expect(heap.size).toBe(3)

    heap.insert(1)
    expect(heap.isEmpty()).toBeFalsy()
    expect(heap.size).toBe(4)
  });

  it('should clear the heap', () => {
    heap.insert(1)
    heap.insert(2)
    heap.insert(3)
    heap.insert(4)

    expect(heap.minNode).not.toBeUndefined
    expect(heap.rootList).not.toBeUndefined

    expect(heap.size).toBe(4)
    heap.clear()
    expect(heap.size).toBe(0)
    expect(heap.minNode).toBeUndefined()
    expect(heap.rootList).toBeUndefined()
    expect(typeof heap.comparator).toBe('function')
  });

  it('should correctly iterate through the heap', () => {
    let results = [-100, -10, -1, 0, 1, 10, 100]
    heap.insert(0)
    heap.insert(1)
    heap.insert(-1)
    heap.insert(10)
    heap.insert(-10)
    heap.insert(100)
    heap.insert(-100)

    let index = 0
    expect(heap.size).toBe(7)
    for (let heapNode of heap) {
      expect(heapNode.value).toBe(results[index++])
    }
    expect(heap.size).toBe(7)
    index = 0
    for (let heapNode of heap) {
      expect(heapNode.value).toBe(results[index++])
    }
    expect(heap.size).toBe(7)
    index = 0
    for (let heapElement of heap.valuesIterator()) {
      expect(heapElement).toBe(results[index++])
    }
    expect(heap.size).toBe(7)

    heap.clear()
    let iterationCount = 0
    for (let {} of heap) {
      iterationCount++
    }
    expect(iterationCount).toBe(0)
  });

  describe("union", () => {
    it('should union the 2 heaps together given 2 heaps of size 5 with overlapping elements added in order together', () => {
      const heap = new FibonacciHeap<number>(numberComparator);
      heap.insert(0);
      heap.insert(2);
      heap.insert(4);
      heap.insert(6);
      heap.insert(8);
      const other = new FibonacciHeap<number>(numberComparator);
      other.insert(1);
      other.insert(3);
      other.insert(5);
      other.insert(7);
      other.insert(9);
      expect(heap.size).toBe(5);
      expect(other.size).toBe(5);

      heap.union(other);
      expect(heap.size).toBe(10);
      for (let i = 0; i < 10; i++) {
        expect(heap.extractMin().value).toBe(i);
      }
      expect(heap.isEmpty()).toBeTruthy()
    });
    it('should union the 2 heaps together given 2 heaps of size 5 with overlapping elements added in reverse order together', () => {
      const heap = new FibonacciHeap<number>(numberComparator);
      heap.insert(9);
      heap.insert(7);
      heap.insert(5);
      heap.insert(3);
      heap.insert(1);
      const other = new FibonacciHeap<number>(numberComparator);
      other.insert(8);
      other.insert(6);
      other.insert(4);
      other.insert(2);
      other.insert(0);
      expect(heap.size).toBe(5);
      expect(other.size).toBe(5);

      heap.union(other);
      expect(heap.size).toBe(10);
      for (let i = 0; i < 10; i++) {
        expect(heap.extractMin().value).toBe(i);
      }
      expect(heap.isEmpty()).toBeTruthy()
    });

    it('should union the 2 heaps together', () => {
      const heaps = constructJumbledHeaps();
      heaps[0].union(heaps[1]);
      expect(heaps[0].size).toBe(10);
      for (let i = 0; i < 10; i++) {
        expect(heaps[0].extractMin().value).toBe(i);
      }
      expect(heaps[0].isEmpty()).toBeTruthy()
    });

    it('should union the 2 heaps together after extracting the minimum from each', () => {
      const heaps = constructJumbledHeaps();
      expect(heaps[0].extractMin().value).toBe(1);
      expect(heaps[1].extractMin().value).toBe(0);
      heaps[0].union(heaps[1]);
      expect(heaps[0].size).toBe(8);
      for (let i = 2; i < 10; i++) {
        const min = heaps[0].extractMin();
        if (min === null) { expect(true).toBeFalsy(); return; }
        expect(min.value).toBe(i);
      }
      expect(heaps[0].isEmpty()).toBeTruthy()
    });
    it('should union an empty heap with another non empty one', () => {
      const emptyHeap = new FibonacciHeap(numberComparator)
      const otherHeap = new FibonacciHeap(numberComparator)
      const n1 = otherHeap.insert(1)
      const n2 = otherHeap.insert(2)

      expect(emptyHeap.size).toBe(0)
      expect(otherHeap.size).toBe(2)

      emptyHeap.union(otherHeap)
      expect(emptyHeap.size).toBe(2)
      expect(otherHeap.size).toBe(2)
      expect(emptyHeap.extractMin()).toEqual(n1)
      expect(emptyHeap.extractMin()).toEqual(n2)
    });
  });

  describe('delete', () => {
    it('should delete the min value of the heap', () => {
      const heap = new FibonacciHeap(numberComparator);
      const node1 = heap.insert(1);
      const node2 = heap.insert(2);
      expect(heap.delete(node1)).toEqual(node1)
      expect(heap.extractMin()).toEqual(node2);
      expect(heap.isEmpty()).toBeTruthy()
    });

    it('should delete nodes in a heap with multiple elements', () => {
      const heap = new FibonacciHeap<number>(numberComparator);
      const node3 = heap.insert(13);
      const node4 = heap.insert(26);
      const node2 = heap.insert(3);
      const node1 = heap.insert(-6);
      const node5 = heap.insert(27);
      expect(heap.size).toBe(5);
      expect(heap.delete(node1)).toEqual(node1)
      expect(heap.size).toBe(4);
      expect(heap.extractMin()).toEqual(node2);
      expect(heap.delete(node3)).toEqual(node3)
      expect(heap.extractMin()).toEqual(node4);
      expect(heap.extractMin()).toEqual(node5);
      expect(heap.isEmpty());
    });

    it('should delete nodes in a flat Fibonacci heap', () => {
      const heap = new FibonacciHeap(numberComparator);
      const node3 = heap.insert(13);
      const node4 = heap.insert(26);
      const node2 = heap.insert(3);
      const node1 = heap.insert(-6);
      const node5 = heap.insert(27);
      expect(heap.size).toBe(5);
      expect(heap.delete(node3)).toEqual(node3)
      expect(heap.size).toBe(4);
      expect(heap.extractMin()).toEqual(node1);
      expect(heap.extractMin()).toEqual(node2);
      expect(heap.extractMin()).toEqual(node4);
      expect(heap.extractMin()).toEqual(node5);
      expect(heap.isEmpty());
    });

    it('should cut the node from the tree if the node is not the minimum it does not have a grandparent', () => {
      const heap = new FibonacciHeap(numberComparator);
      const node1 = heap.insert(1);
      const node2 = heap.insert(2);
      const node3 = heap.insert(3);
      const node4 = heap.insert(4);
      // Extract the minimum, forcing the construction of an order 2 tree which
      // is changed to an order 0 and order 1 tree after the minimum is extracted.
      //
      //                    1
      //                   /|      3--2
      //  1--2--3--4  ->  3 2  ->  |
      //                  |        4
      //                  4
      //
      expect(heap.extractMin()).toEqual(node1);
      // Deleting the node should trigger a cut and cascadingCut on the heap.
      expect(heap.delete(node4)).toEqual(node4)

      expect(heap.size).toBe(2);
      expect(heap.extractMin()).toEqual(node2);
      expect(heap.extractMin()).toEqual(node3);
      expect(heap.isEmpty()).toBeTruthy()
    });

    it('should cut the node from the tree if the node is not the minimum and it has a grandparent', () => {
      const heap = new FibonacciHeap(numberComparator);
      const node0 = heap.insert(0);
      const node1 = heap.insert(1);
      const node2 = heap.insert(2);
      const node3 = heap.insert(3);
      const node4 = heap.insert(4);
      const node5 = heap.insert(5);
      const node6 = heap.insert(6);
      const node7 = heap.insert(7);
      const node8 = heap.insert(8);

      // extractMinimum on 0 should trigger a cut and cascadingCut on the heap.
      //
      //                                    __1
      //                                   / /|
      //                                  5 3 2
      //  0--1--2--3--4--5--6--7--8  ->  /| |
      //                                7 6 4
      //                                |
      //                                8
      //
      expect(heap.extractMin()).toEqual(node0);

      // Delete node 8
      //
      //      __1
      //     / /|        __1
      //    5 3 2       / /|
      //   /| |    ->  5 3 2
      //  7 6 4       /| |
      //  |          7 6 4
      //  8
      //
      expect(heap.size).toBe(8);
      expect(heap.delete(node8)).toEqual(node8)
      expect(heap.minNode).not.toBeNull()
      expect(heap.minNode).not.toBeUndefined()

      expect(heap.size).toBe(7);
      expect(heap.extractMin()).toBe(node1);
      expect(heap.extractMin()).toBe(node2);
      expect(heap.extractMin()).toBe(node3);
      expect(heap.extractMin()).toBe(node4);
      expect(heap.extractMin()).toBe(node5);
      expect(heap.extractMin()).toBe(node6);
      expect(heap.extractMin()).toBe(node7);
      expect(heap.isEmpty());
    });

    it('should cut the node from the tree if the node is not the minimum, it has a grandparent and its parent is marked', () => {
      const heap = new FibonacciHeap(numberComparator);
      const node0 = heap.insert(0);
      const node1 = heap.insert(1);
      const node2 = heap.insert(2);
      const node3 = heap.insert(3);
      const node4 = heap.insert(4);
      const node5 = heap.insert(5);
      const node6 = heap.insert(6);
      const node7 = heap.insert(7);
      const node8 = heap.insert(8);

      // Extracting minimum should trigger consolidate.
      //
      //                                    __1
      //                                   / /|
      //                                  5 3 2
      //  0--1--2--3--4--5--6--7--8  ->  /| |
      //                                7 6 4
      //                                |
      //                                8
      //
      expect(heap.extractMin()).toEqual(node0);

      // Delete node 6, marking 5
      //
      //      __1         __1
      //     / /|        / /|
      //    5 3 2      >5 3 2
      //   /| |    ->  /  |
      //  7 6 4       7   4
      //  |           |
      //  8           8
      //
      expect(heap.delete(node6)).toEqual(node6)
      expect(node5.marked);

      // Delete node 7, cutting the sub-tree
      //
      //      __1
      //     / /|        1--5
      //   >5 3 2       /|  |
      //   /  |    ->  3 2  8
      //  7   4        |
      //  |            4
      //  8
      //
      expect(heap.delete(node7)).toEqual(node7)

      expect(heap.size).toBe(6);
      expect(heap.extractMin()).toEqual(node1);
      expect(heap.extractMin()).toEqual(node2);
      expect(heap.extractMin()).toEqual(node3);
      expect(heap.extractMin()).toEqual(node4);
      expect(heap.extractMin()).toEqual(node5);
      expect(heap.extractMin()).toEqual(node8);
      expect(heap.isEmpty());
    });

    it('should correctly assign an indirect child when a direct child is cut from the parent', () => {
      const heap = new FibonacciHeap(numberComparator);
      const node0 = heap.insert(0);
      heap.insert(1);
      heap.insert(2);
      heap.insert(3);
      heap.insert(4);
      const node5 = heap.insert(5);
      const node6 = heap.insert(6);
      const node7 = heap.insert(7);
      heap.insert(8);

      // Extracting minimum should trigger consolidate.
      //
      //                                    __1
      //                                   / /|
      //                                  5 3 2
      //  0--1--2--3--4--5--6--7--8  ->  /| |
      //                                7 6 4
      //                                |
      //                                8
      //
      expect(heap.extractMin()).toEqual(node0);

      // Delete node 6, marking 5
      //
      //      __1         __1
      //     / /|        / /|
      //    5 3 2      >5 3 2
      //   /| |    ->  /  |
      //  7 6 4       7   4
      //  |           |
      //  8           8
      //
      expect(heap.delete(node6)).toEqual(node6)
      expect(node5.child).toEqual(node7)
      expect(node5.child).toEqual(node7)
    });
  });

  describe('decreaseKey', () => {
    it('should throw an exception given a non-existent node', () => {
      const heap = new FibonacciHeap(numberComparator);
      expect(() => heap.decreaseKey(<any>undefined, 2)).toThrowError("node to decrease is null!")
      expect(() => heap.decreaseKey(<any>null, 2)).toThrowError("node to decrease is null!")
    });

    it('should throw an exception given a new key larger than the old key', () => {
      const heap = new FibonacciHeap(numberComparator);
      expect(() => {
        const node = heap.insert(1);
        heap.decreaseKey(node, 2);
      }).toThrowError("new value is greater then old one")
    });

    it('should decrease the minimum node', () => {
      const heap = new FibonacciHeap(numberComparator);
      const node1 = heap.insert(1);
      heap.insert(2);
      heap.decreaseKey(node1, -3);
      const value = heap.minimum().value;
      expect(value).toBe(node1.value)
      expect(value).toBe(-3)
    });

    it('should decrease and bubble up a non-minimum node', () => {
      const heap = new FibonacciHeap(numberComparator);
      heap.insert(1);
      const node2 = heap.insert(2);
      heap.decreaseKey(node2, -3);
      const value = heap.minimum().value;
      expect(value).toBe(node2.value)
      expect(value).toBe(-3)
    });

    it('should decrease and bubble up a non-minimum node in a large heap', () => {
      const heap = new FibonacciHeap(numberComparator);
      heap.insert(13);
      heap.insert(26);
      heap.insert(3);
      heap.insert(-6);
      const node5 = heap.insert(27);
      heap.insert(88);
      heap.insert(59);
      heap.insert(-10);
      heap.insert(16);
      expect(heap.minimum().value).toBe(-10)
      heap.decreaseKey(node5, -11);
      expect(heap.minimum().value).toBe(node5.value)
    });

    it('should leave a valid tree on a flat Fibonacci heap', () => {
      const heap = new FibonacciHeap(numberComparator);
      heap.insert(13);
      heap.insert(26);
      heap.insert(3);
      heap.insert(-6);
      heap.insert(27);
      const node6 = heap.insert(88);
      heap.insert(59);
      heap.insert(-10);
      heap.insert(16);
      heap.decreaseKey(node6, -8);
      expect(heap.extractMin().value).toBe(-10)
      expect(heap.extractMin().value).toBe(-8)
      expect(heap.extractMin().value).toBe(-6)
      expect(heap.extractMin().value).toBe(3)
      expect(heap.extractMin().value).toBe(13)
      expect(heap.extractMin().value).toBe(16)
      expect(heap.extractMin().value).toBe(26)
      expect(heap.extractMin().value).toBe(27)
      expect(heap.extractMin().value).toBe(59)
    });

    it('should leave a valid tree on a consolidated Fibonacci heap', () => {
      const heap = new FibonacciHeap(numberComparator);
      const node0 = heap.insert(0);
      const node1 = heap.insert(1);
      const node2 = heap.insert(2);
      const node3 = heap.insert(3);
      const node4 = heap.insert(4);
      const node5 = heap.insert(5);
      const node6 = heap.insert(6);
      const node7 = heap.insert(7);
      const node8 = heap.insert(8);

      // Extracting minimum should trigger consolidate.
      //
      //                                    __1
      //                                   / /|
      //                                  5 3 2
      //  0--1--2--3--4--5--6--7--8  ->  /| |
      //                                7 6 4
      //                                |
      //                                8
      //
      expect(heap.extractMin()).toEqual(node0)

      // Decrease node 8 to 0
      //
      //      __1
      //     / /|        __1--0
      //    5 3 2       / /|
      //   /| |    ->  5 3 2
      //  7 6 4       /| |
      //  |          7 6 4
      //  8
      //
      heap.decreaseKey(node8, 0);
      expect(node1.right).toEqual(node8)

      expect(heap.size).toBe(8)
      expect(heap.extractMin()).toEqual(node8)
      expect(heap.extractMin()).toEqual(node1)
      expect(heap.extractMin()).toEqual(node2)
      expect(heap.extractMin()).toEqual(node3)
      expect(heap.extractMin()).toEqual(node4)
      expect(heap.extractMin()).toEqual(node5)
      expect(heap.extractMin()).toEqual(node6)
      expect(heap.extractMin()).toEqual(node7)
      expect(heap.isEmpty()).toBeTruthy()
    });

    it("should delete the node's parent reference after a cut", () => {
      const heap = new FibonacciHeap(numberComparator);
      const node1 = heap.insert(1);
      heap.insert(2);
      const node3 = heap.insert(3);
      expect(heap.size).toBe(3)

      // Trigger a consolidate
      //
      //               2
      //  1--2--3  ->  |
      //               3
      //
      expect(heap.extractMin()).toEqual(node1)

      // Decrease 3's key such that it's less than its parent
      //
      //  2      1
      //  |  ->  |
      //  3      2
      //
      heap.decreaseKey(node3, 1);

      // Ensure 1's parent is null (the link to 2 has been cut)
      expect(node3.parent).toBeFalsy()
    });
  });
})
function constructJumbledHeaps(): FibonacciHeap<number>[] {
  const first = new FibonacciHeap<number>(numberComparator);
  first.insert(9);
  first.insert(2);
  first.insert(6);
  first.insert(1);
  first.insert(3);
  expect(first.size).toBe(5);
  const second = new FibonacciHeap<number>(numberComparator);
  second.insert(4);
  second.insert(8);
  second.insert(5);
  second.insert(7);
  second.insert(0);
  expect(second.size).toBe(5);
  return [first, second];
}
