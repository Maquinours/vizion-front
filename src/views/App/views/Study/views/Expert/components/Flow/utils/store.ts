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
import { ExpertStudyDensityCameraNode } from '../components/DensityCameraNode/DensityCameraNode';
import { ExpertStudyImageNode } from '../components/ImageNode/ImageNode';
import { ExpertStudyLinesNode } from '../components/LinesNode/LinesNode';
import { ExpertStudyMonitorNode } from '../components/MonitorNode/MonitorNode';
import { ExpertStudyRecorderNode } from '../components/RecorderNode/RecorderNode';
import { ExpertStudyRectangleNode } from '../components/RectangleNode/RectangleNode';
import { ExpertStudyServiceNode } from '../components/ServiceNode/ServiceNode';
import { ExpertStudySynopticCameraNode } from '../components/SynopticCameraNode/SynopticCameraNode';
import { ExpertStudyTextNode } from '../components/TextNode/TextNode';
import { ExpertStudyTransmitterNode } from '../components/TransmitterNode/TransmitterNode';
import { ExpertStudyDensityScaleNode } from '../components/DensityScaleNode/DensityScaleNode';
import { ExpertStudyBackgroundNode } from '../components/BackgroundNode/BackgroundNode';

const defaultSynopticPage = {
  nodes: [],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 1 },
  type: 'synoptic',
} as SynopticPage;

const defaultDensityPage = {
  nodes: [{ id: 'scale', type: 'densityScale', position: { x: 0, y: 0 }, data: { rotation: 0 } } as ExpertStudyDensityScaleNode],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 1 },
  type: 'density',
  scale: { virtual: 50, real: 10 },
} as DensityPage;

export type ExpertStudyNode =
  | ExpertStudySynopticCameraNode
  | ExpertStudyMonitorNode
  | ExpertStudyRecorderNode
  | ExpertStudyTransmitterNode
  | ExpertStudyServiceNode
  | ExpertStudyImageNode
  | ExpertStudyTextNode
  | ExpertStudyRectangleNode
  | ExpertStudyLinesNode
  | ExpertStudyDensityCameraNode
  | ExpertStudyDensityScaleNode
  | ExpertStudyBackgroundNode;

type BasePage = {
  nodes: Array<ExpertStudyNode>;
  edges: Array<Edge>;
  viewport: Viewport;
  name?: string;
};

type SynopticPage = BasePage & { type: 'synoptic' };
type DensityPage = BasePage & { type: 'density'; scale: { virtual: number; real: number } };

type Page = SynopticPage | DensityPage;

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
  addPage: (mode: 'synoptic' | 'density', options?: { nodes?: Array<ExpertStudyNode>; viewport?: Viewport }) => void;
  removePage: () => void;
  studyName?: string;
  installerName?: string;
  setStudyName: (studyName: string) => void;
  setInstallerName: (installerName: string) => void;
  setPageName: (pageName: string) => void;
  setPageScale: ({ virtual, real }: { virtual?: number; real?: number }) => void;
  getPageType: () => 'synoptic' | 'density';
  getPages: () => Array<Page>;
};

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<RFState>((set, get) => ({
  pages: [],
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
  setPageScale: ({ virtual, real }) => {
    const currentPage = get().currentPage;
    set({
      pages: get().pages.map((page, index) => {
        if (index !== currentPage) return page;
        if (page.type !== 'density') throw new Error('Page is not a density page');
        return { ...page, scale: { virtual: virtual ?? page.scale.virtual, real: real ?? page.scale.real } };
      }),
    });
  },
  addPage: (mode: 'synoptic' | 'density', options: { nodes?: Array<ExpertStudyNode>; viewport?: Viewport } = {}) => {
    const page = mode === 'synoptic' ? defaultSynopticPage : defaultDensityPage;
    if (options.nodes) page.nodes = options.nodes;
    if (options.viewport) page.viewport = options.viewport;

    const pages = [...get().pages, page];
    set({ pages });
    set({ currentPage: pages.length - 1 });
  },
  removePage: () => {
    const currentPage = get().currentPage;
    const pages = get().pages.filter((_page, index) => index !== currentPage);
    set({ pages });
    set({ currentPage: pages.length - 1 });
  },
  getPageType: () => {
    return get().pages[get().currentPage].type;
  },
  getPages: () => get().pages,
}));

export default useStore;
