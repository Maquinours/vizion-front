import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  Viewport,
} from 'reactflow';

const defaultPage = { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } };

type Page = {
  nodes: Node[];
  edges: Edge[];
  viewport: Viewport;
};

export type RFState = {
  pages: Array<Page>;
  currentPage: number;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  setViewport: (viewport: Viewport) => void;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setCurrentPage: (currentPage: number) => void;
  addPage: () => void;
};

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<RFState>((set, get) => ({
  pages: [defaultPage],
  currentPage: 0,
  onNodesChange: (changes: NodeChange[]) => {
    set({
      pages: get().pages.map((page, index) => (index === get().currentPage ? { ...page, nodes: applyNodeChanges(changes, page.nodes) } : page)),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      pages: get().pages.map((page, index) => (index === get().currentPage ? { ...page, edges: applyEdgeChanges(changes, page.edges) } : page)),
    });
  },
  setViewport: (viewport: Viewport) => {
    set({
      pages: get().pages.map((page, index) => (index === get().currentPage ? { ...page, viewport } : page)),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      pages: get().pages.map((page, index) =>
        index === get().currentPage ? { ...page, edges: addEdge({ ...connection, type: 'smoothstep' }, page.edges) } : page,
      ),
    });
  },
  setNodes: (nodes: Node[]) => {
    const currentPage = get().currentPage;
    set({ pages: get().pages.map((page, index) => (index === currentPage ? { ...page, nodes } : page)) });
  },
  setEdges: (edges: Edge[]) => {
    const currentPage = get().currentPage;
    set({ pages: get().pages.map((page, index) => (index === currentPage ? { ...page, edges } : page)) });
  },
  setCurrentPage: (currentPage: number) => {
    const pages = get().pages;
    if (currentPage < 0 || currentPage >= pages.length) return;
    set({ currentPage });
  },
  addPage: () => {
    const pages = [...get().pages, defaultPage];
    set({ pages, currentPage: pages.length - 1 });
  },
}));

export default useStore;
