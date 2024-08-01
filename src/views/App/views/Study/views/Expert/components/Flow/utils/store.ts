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
  isEdge,
  isNode,
} from '@xyflow/react';
import { create } from 'zustand';
import { ExpertStudyBackgroundNode, isExpertStudyBackgroundNode } from '../components/BackgroundNode/BackgroundNode';
import { ExpertStudyDensityCameraNode, isExpertStudyDensityCameraNode } from '../components/DensityCameraNode/DensityCameraNode';
import { ExpertStudyDensityScaleNode, isExpertStudyDensityScaleNode } from '../components/DensityScaleNode/DensityScaleNode';
import { ExpertStudyImageNode, isExpertStudyImageNode } from '../components/ImageNode/ImageNode';
import { ExpertStudyLinesNode, isExpertStudyLinesNode } from '../components/LinesNode/LinesNode';
import { ExpertStudyMonitorNode, isExpertStudyMonitorNode } from '../components/MonitorNode/MonitorNode';
import { ExpertStudyRecorderNode, isExpertStudyRecorderNode } from '../components/RecorderNode/RecorderNode';
import { ExpertStudyRectangleNode, isExpertStudyRectangleNode } from '../components/RectangleNode/RectangleNode';
import { ExpertStudyServiceNode, isExpertStudyServiceNode } from '../components/ServiceNode/ServiceNode';
import { ExpertStudySynopticCameraNode, isExpertStudySynopticCameraNode } from '../components/SynopticCameraNode/SynopticCameraNode';
import { ExpertStudyTextNode, isExpertStudyTextNode } from '../components/TextNode/TextNode';
import { ExpertStudyTransmitterNode, isExpertStudyTransmitterNode } from '../components/TransmitterNode/TransmitterNode';

const initialState = {
  pages: [],
  currentPage: 0,
  studyName: undefined,
  installerName: undefined,
  businessId: undefined,
};

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

export const isExpertStudyNode = (node: unknown): node is ExpertStudyNode => {
  return (
    isNode(node) &&
    (isExpertStudySynopticCameraNode(node) ||
      isExpertStudyMonitorNode(node) ||
      isExpertStudyRecorderNode(node) ||
      isExpertStudyTransmitterNode(node) ||
      isExpertStudyServiceNode(node) ||
      isExpertStudyImageNode(node) ||
      isExpertStudyTextNode(node) ||
      isExpertStudyRectangleNode(node) ||
      isExpertStudyLinesNode(node) ||
      isExpertStudyDensityCameraNode(node) ||
      isExpertStudyDensityScaleNode(node) ||
      isExpertStudyBackgroundNode(node))
  );
};

export const isExpertStudyPage = (page: unknown): page is ExpertStudyPage => {
  return (
    !!page &&
    typeof page === 'object' &&
    'nodes' in page &&
    Array.isArray(page.nodes) &&
    page.nodes.every((node) => isExpertStudyNode(node)) &&
    'edges' in page &&
    Array.isArray(page.edges) &&
    page.edges.every((edge) => isEdge(edge)) &&
    'viewport' in page &&
    typeof page.viewport === 'object' &&
    !!page.viewport &&
    'x' in page.viewport &&
    typeof page.viewport.x === 'number' &&
    'y' in page.viewport &&
    typeof page.viewport.y === 'number' &&
    'zoom' in page.viewport &&
    typeof page.viewport.zoom === 'number' &&
    'type' in page &&
    (page.type === 'synoptic' || page.type === 'density') &&
    (page.type !== 'density' ||
      ('scale' in page &&
        typeof page.scale === 'object' &&
        !!page.scale &&
        'virtual' in page.scale &&
        typeof page.scale.virtual === 'number' &&
        'real' in page.scale &&
        typeof page.scale.real === 'number'))
  );
};

type BasePage = {
  nodes: Array<ExpertStudyNode>;
  edges: Array<Edge>;
  viewport: Viewport;
  name?: string;
};

type SynopticPage = BasePage & { type: 'synoptic' };
type DensityPage = BasePage & { type: 'density'; scale: { virtual: number; real: number } };

export type ExpertStudyPage = SynopticPage | DensityPage;

type Page = SynopticPage | DensityPage;

export type RFState = {
  pages: Array<Page>;
  currentPage: number;
  studyName: string | undefined;
  installerName: string | undefined;
  businessId: string | undefined;
  onNodesChange: OnNodesChange<ExpertStudyNode>;
  onEdgesChange: OnEdgesChange;
  setViewport: (viewport: Viewport) => void;
  onConnect: OnConnect;
  setNodes: (nodes: Array<ExpertStudyNode>) => void;
  setEdges: (edges: Array<Edge>) => void;
  setCurrentPage: (currentPage: number) => void;
  getCurrentPage: () => number;
  addPage: (mode: 'synoptic' | 'density', options?: { nodes?: Array<ExpertStudyNode>; viewport?: Viewport }) => void;
  removePage: () => void;
  getStudyName: () => string | undefined;
  setStudyName: (studyName: string) => void;
  getInstallerName: () => string | undefined;
  setInstallerName: (installerName: string) => void;
  setPageName: (pageName: string) => void;
  setPageScale: ({ virtual, real }: { virtual?: number; real?: number }) => void;
  getPageType: () => 'synoptic' | 'density';
  getPages: () => Array<Page>;
  getBusinessId: () => string | undefined;
  setBusinessId: (businessId: string) => void;
  reset: () => void;
  importStudy: (study: { pages: Array<ExpertStudyPage>; studyName?: string; installerName?: string }) => void;
};

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<RFState>((set, get) => ({
  ...initialState,
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
  getCurrentPage: () => get().currentPage,
  getStudyName: () => get().studyName,
  setStudyName: (studyName: string) => {
    set({ studyName });
  },
  getInstallerName: () => get().installerName,
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
  getBusinessId: () => get().businessId,
  setBusinessId: (businessId: string) => {
    set({ businessId });
  },
  reset: () => {
    set(initialState);
  },
  importStudy: async (study: { pages: Array<ExpertStudyPage>; studyName?: string; installerName?: string }) => {
    set({ pages: study.pages, studyName: study.studyName, installerName: study.installerName, currentPage: 0 });
  },
}));

export default useStore;
