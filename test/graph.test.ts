import {beforeEach, describe, expect, it} from "vitest";
import {AGraph, Edge, FibonacciHeap, Graph, GraphProperties, Ordering, Vertex} from "../src";
import {GraphFactory} from './graph-factory.ts'

describe("Graph Testsuite", () => {
    let graph: Graph
    let v1: Vertex, v2: Vertex, v3: Vertex
    beforeEach(() => {
        graph = new Graph({
            uuid: "1"
        })
        v1 = new Vertex({
            title: 'v1'
        })
        v2 = new Vertex({
            title: 'v2'
        })
        v3 = new Vertex({
            title: 'v3'
        })
    })
    describe("edges", () => {
        it("add an edge to the graph", () => {
            graph.addVertex(v1)
            graph.addVertex(v2)
            const e = graph.createEdge(v1, v2, "new edge")
            expect(e.title).toBe("new edge")
            expect(graph.edges.size).toBe(1)
            expect(graph.vertices.size).toBe(2)
        })
        it("add an undirected edge to the graph", () => {
            graph.addVertex(v1)
            graph.addVertex(v2)
            const e = graph.createEdge(v1, v2, 'undirected edge', false)
            expect(e.title).toBe("undirected edge")
            expect(e.isDirected()).toBeFalsy()
            expect(graph.edges.size).toBe(2)
            expect(graph.vertices.size).toBe(2)
        })
        it("remove an edge from the graph", () => {
            const edge = graph.createEdge(v1, v2, 'new edge')
            expect(graph.edges.size).toBe(1)
            graph.removeEdge(edge)
            expect(graph.edges.size).toBe(0)
        })
    })

    describe("vertices", () => {
        it("add an vertex to the graph", () => {
            const v = new Vertex()
            expect(v.title).toBe("new vertex")
            graph.addVertex(v)
            expect(graph.vertices.size).toBe(1)
            expect(graph.edges.size).toBe(0)
        })
        it("remove an vertex from the graph", () => {
            const v = new Vertex()
            graph.addVertex(v)
            expect(graph.vertices.size).toBe(1)
            graph.removeVertex(v);
            expect(graph.vertices.size).toBe(0);
        })
    })

    describe("common graph properties", () => {
        it("create a graph with default values", () => {
            expect(graph.title).toBe("new graph")
            expect(graph.uuid).toBe("1")
            expect(graph.edges.size).toBe(0)
            expect(graph.vertices.size).toBe(0)
            expect(graph.cycleCount).toBe(0)
            expect(graph.hasCycles).toBeFalsy()
            expect(graph.mixed).toBeFalsy()
            expect(graph.connected).toBeFalsy()
            expect(graph.directed).toBeFalsy()
        })

        it("isConnected", () => {
            const g1 = GraphFactory.createDirectedWeightedGraphG()
            expect(g1.isConnected()).false
            const g2 = GraphFactory.createDirectedGraph118()
            expect(g2.isConnected()).false
            const g3 = GraphFactory.createDirectedGraphA()
            expect(g3.isConnected()).true
            const g4 = GraphFactory.createDirectedGraphB()
            expect(g4.isConnected()).false
        })
    })

    describe("graph algorithms", () => {
        it("k shortest paths", () => {
            const g = GraphFactory.createDirectedWeightedGraphG()
            // @ts-ignore
            const vertices = [...g.vertices]
            const C = vertices.find(v => v.title === 'C')
            const H = vertices.find(v => v.title === 'H')
            const shortestPaths = g.kShortestPaths(C!, H!, 3)
            const sp1 = shortestPaths[0]
            const sp2 = shortestPaths[1]
            const sp3 = shortestPaths[2]

            expect(shortestPaths).toHaveLength(3)

            expect(sp1[0].title).toBe("C")
            expect(sp1[1].title).toBe("E")
            expect(sp1[2].title).toBe("F")
            expect(sp1[3].title).toBe("H")

            expect(sp2[0].title).toBe("C")
            expect(sp2[1].title).toBe("E")
            expect(sp2[2].title).toBe("G")
            expect(sp2[3].title).toBe("H")

            expect(sp3[0].title).toBe("C")
            expect(sp3[1].title).toBe("D")
            expect(sp3[2].title).toBe("F")
            expect(sp3[3].title).toBe("H")
        })
        it("shortest path", () => {
            const g = GraphFactory.createDirectedGraph118()
            // @ts-ignore
            const c = [...g.vertices]
            const v1 = c[0]
            const v2 = c[1]
            const sp = g.shortestPath(v1, v2)
            expect(sp).toHaveLength(3)
            expect(sp[0].title).toBe("1")
            expect(sp[1].title).toBe("4")
            expect(sp[2].title).toBe("2")
        })
        it("depthFirstSearch | breadthFirstSearch", () => {
            graph.addVertex(v1);
            graph.addVertex(v2);
            graph.addVertex(v3);

            graph.addEdge(new Edge({
                from: v1,
                to: v2
            }))
            graph.addEdge(new Edge({
                from: v2,
                to: v3
            }))
            const mv = graph.depthFirstSearch(v1)
            const mv2 = graph.breadthFirstSearch(v1)
            expect(mv[0]).toBe(v1)
            expect(mv[1]).toBe(v2)
            expect(mv[2]).toBe(v3)
            expect(mv2[0]).toBe(v1)
            expect(mv2[1]).toBe(v2)
            expect(mv2[2]).toBe(v3)

            const mv3 = graph.depthFirstSearch(v2)
            const mv4 = graph.breadthFirstSearch(v2)
            expect(mv3[0]).toBe(v2)
            expect(mv3[1]).toBe(v3)
            expect(mv4[0]).toBe(v2)
            expect(mv4[1]).toBe(v3)

            const mv5 = graph.depthFirstSearch(v3)
            const mv6 = graph.breadthFirstSearch(v3)
            expect(mv5[0]).toBe(v3)
            expect(mv6[0]).toBe(v3)
        })

        it.skip("infer cycles", () => {
            const g = GraphFactory.createUndirectedWeightedC()
            const cycles = g.inferCycles()
            console.debug(cycles)
            expect(cycles).toHaveLength(3)
        })

        describe("minimal spanning tree", () => {
            it("example graph A not processable", () => {
                const g = GraphFactory.createDirectedGraphA()
                expect(() => g.minimalSpanningTree()).toThrowError("graph must be undirected, connected and weighted")
            })
        })

        describe("topological sorting", () => {
            it("topological sorting", () => {
                const g = GraphFactory.createDirectedGraph118()
                const sorting = g.topologicalSorting()
                expect(sorting).toHaveLength(7)
                expect(sorting[0].title).toBe("1")
                expect(sorting[1].title).toBe("5")
                expect(sorting[2].title).toBe("7")
                expect(sorting[3].title).toBe("4")
                expect(sorting[4].title).toBe("6")
                expect(sorting[5].title).toBe("2")
                expect(sorting[6].title).toBe("3")
            })
            it("parallel topological sorting", () => {
                const g = GraphFactory.createDirectedGraph118()
                expect(g.vertices).toHaveLength(7)
                expect(g.edges).toHaveLength(7)
                const lists = g.parallelTopologicalSorting()
                expect(g.vertices).toHaveLength(7)
                expect(g.edges).toHaveLength(7)
                expect(g.title).toEqual('example graph 118')
                expect(lists).toHaveLength(4)
                expect(lists[0][0].title).toBe('1')
                expect(lists[0][1].title).toBe('5')
                expect(lists[0][2].title).toBe('7')
                expect(lists[1][0].title).toBe('4')
                expect(lists[2][0].title).toBe('2')
                expect(lists[2][1].title).toBe('6')
                expect(lists[3][0].title).toBe('3')
            })
        })

        describe("strong connected components", () => {
            it("example self constructed Graph", () => {
                graph.addVertex(v1)
                graph.addVertex(v2)
                graph.addVertex(v3)

                expect(v1.outgoingEdges.size).toBe(0)
                expect(v2.incomingEdges.size).toBe(0)
                const e = new Edge({
                    from: v1,
                    to: v2,
                    directed: false
                })
                const r = new Edge({
                    from: v2,
                    to: v1,
                    directed: false
                })
                graph.addEdge(e)
                graph.addEdge(r)
                expect(v1.outgoingEdges.size).toBe(1)
                expect(v1.incomingEdges.size).toBe(1)
                expect(v2.incomingEdges.size).toBe(1)
                expect(v2.outgoingEdges.size).toBe(1)

                const ccs = graph.strongConnectedComponents()
                expect(ccs.length).toBe(2)
                expect(ccs[0].vertices!.size).toBe(2)
                expect(ccs[0].edges!.size).toBe(2)
                const vals = ccs[0].vertices!.values()
                expect(vals.next().value.title).toBe("v1")
                expect(vals.next().value.title).toBe("v2")
                expect(ccs[0].vertices!.values().next().value.title).toBe("v1")

                expect(ccs[1].vertices!.size).toBe(1)
                expect(ccs[1].vertices!.values().next().value.title).toBe("v3")
                expect(ccs[1].edges!.size).toBe(0)
            })
            it("Example Graph A", () => {
                // Graph A
                const ga = GraphFactory.createDirectedGraphA()
                const ccsA = ga.strongConnectedComponents()
                expect(ccsA.length).toBe(1)
                expect(ccsA[0].vertices!.size).toBe(5)
                expect(ccsA[0].edges!.size).toBe(7)
            })
            it("Example Graph B", () => {
                // Graph B
                const gb = GraphFactory.createDirectedGraphB()
                const ccsB = gb.strongConnectedComponents()
                expect(ccsB.length).toBe(5)
                expect(ccsB[0].vertices!.size).toBe(4)
                expect(ccsB[1].vertices!.size).toBe(3)
                expect(ccsB[2].vertices!.size).toBe(4)
                expect(ccsB[3].vertices!.size).toBe(1)
                const _v1 = Array.from(ccsB[3].vertices!)[0]
                expect(_v1.title).toBe("12")
                expect(ccsB[4].vertices!.size).toBe(1)
                const _v2 = Array.from(ccsB[4].vertices!)[0]
                expect(_v2.title).toBe("13")
            })
        })
    })

    it("custom graph and vertex", () => {
        const g = new Graph2({title: 'g', uuid: '22'})
        g.addVertex(new Vertex2({title: 'A'}))
        expect(g.vertices).toHaveLength(1)
        expect(g.newGraphProp).toEqual("gprop")

        const v = [...g.vertices][0]
        expect(v.newProp).toEqual("prop")
        expect(v.title).toEqual("A")
    })

    it('should return edges in min order', () => {
        const g = new Graph({})
        const A = new Vertex({title: 'A'})
        const B = new Vertex({title: 'B'})
        const C = new Vertex({title: 'C'})
        const D = new Vertex({title: 'D'})
        const E = new Vertex({title: 'E'})
        const F = new Vertex({title: 'F'})
        const G = new Vertex({title: 'G'})
        g.addVertex(A)
        g.addVertex(B)
        g.addVertex(C)
        g.addVertex(D)
        g.addVertex(E)
        g.addVertex(F)
        g.addVertex(G)

        g.createEdge(A, B)
        g.createEdge(A, C)
        g.createEdge(A, D)
        g.createEdge(D, C)
        g.createEdge(D, E)
        g.createEdge(E, F)
        g.createEdge(E, G)
        g.createEdge(E, A)
        g.createEdge(E, B)

        const heap = new FibonacciHeap<Vertex>((v1, v2) => {
            if (v1.outdeg() === v2.outdeg()) return Ordering.EQ
            if (v1.outdeg() > v2.outdeg()) return Ordering.LT
            return Ordering.GT
        })
        heap.insert(A)
        heap.insert(B)
        heap.insert(C)
        heap.insert(D)
        heap.insert(E)
        heap.insert(F)
        heap.insert(G)

        expect(heap.extractMin().value.title).toBe("E")
        expect(heap.extractMin().value.title).toBe("A")
        expect(heap.extractMin().value.title).toBe("D")
    });
})

class Graph2 extends AGraph<Vertex2, Edge> {
    newGraphProp = 'gprop'
    constructor(props: GraphProperties) {
        super(props, Vertex2, Edge);
    }
}

class Vertex2 extends Vertex {
    newProp = 'prop'
}
