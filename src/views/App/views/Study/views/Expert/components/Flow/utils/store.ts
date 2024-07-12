import {
  Connection,
  Edge,
  EdgeChange,
  NodeChange,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  Viewport,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from '@xyflow/react';
import { create } from 'zustand';
import { ExpertStudyImageNode } from '../components/ImageNode/ImageNode';
import { ExpertStudyLinesNode } from '../components/LinesNode/LinesNode';
import { ExpertStudyMonitorNode } from '../components/MonitorNode/MonitorNode';
import { ExpertStudyRecorderNode } from '../components/RecorderNode/RecorderNode';
import { ExpertStudyRectangleNode } from '../components/RectangleNode/RectangleNode';
import { ExpertStudySynopticCameraNode } from '../components/SynopticCameraNode/SynopticCameraNode';
import { ExpertStudyTextNode } from '../components/TextNode/TextNode';
import { ExpertStudyTransmitterNode } from '../components/TransmitterNode/TransmitterNode';
import { ExpertStudyServiceNode } from '../components/ServiceNode/ServiceNode';

const defaultPage = { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } };

export type ExpertStudyNode =
  | ExpertStudySynopticCameraNode
  | ExpertStudyMonitorNode
  | ExpertStudyRecorderNode
  | ExpertStudyTransmitterNode
  | ExpertStudyServiceNode
  | ExpertStudyImageNode
  | ExpertStudyTextNode
  | ExpertStudyRectangleNode
  | ExpertStudyLinesNode;

type Page = {
  nodes: Array<ExpertStudyNode>;
  edges: Array<Edge>;
  viewport: Viewport;
  name?: string;
};

export type RFState = {
  pages: Array<Page>;
  currentPage: number;
  onNodesChange: OnNodesChange<ExpertStudyNode>;
  onEdgesChange: OnEdgesChange;
  setViewport: (viewport: Viewport) => void;
  onConnect: OnConnect;
  setNodes: (nodes: Array<ExpertStudyNode>) => void;
  setEdges: (edges: Array<Edge>) => void;
  setCurrentPage: (currentPage: number) => void;
  addPage: () => void;
  studyName?: string;
  installerName?: string;
  setStudyName: (studyName: string) => void;
  setInstallerName: (installerName: string) => void;
  setPageName: (pageName: string) => void;
};

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<RFState>((set, get) => ({
  pages: [defaultPage],
  currentPage: 0,
  onNodesChange: (changes: Array<NodeChange<ExpertStudyNode>>) => {
    set({
      pages: get().pages.map((page, index) => (index === get().currentPage ? { ...page, nodes: applyNodeChanges(changes, page.nodes) } : page)),
    });
  },
  onEdgesChange: (changes: Array<EdgeChange>) => {
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
  setNodes: (nodes: Array<ExpertStudyNode>) => {
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
  setStudyName: (studyName: string) => {
    set({ studyName });
  },
  setInstallerName: (installerName: string) => {
    set({ installerName });
  },
  setPageName: (pageName: string) => {
    const currentPage = get().currentPage;
    set({ pages: get().pages.map((page, index) => (index === currentPage ? { ...page, name: pageName } : page)) });
  },
}));

export default useStore;
