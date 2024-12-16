import { arrayMove } from '@dnd-kit/sortable';
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
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { ExpertStudyBackgroundNode, isExpertStudyBackgroundNode } from '../components/BackgroundNode/BackgroundNode';
import { ExpertStudyDensityCameraNode, isExpertStudyDensityCameraNode } from '../components/DensityCameraNode/DensityCameraNode';
import { ExpertStudyDensityScaleNode, isExpertStudyDensityScaleNode } from '../components/DensityScaleNode/DensityScaleNode';
import { ExpertStudyImageNode, isExpertStudyImageNode } from '../components/ImageNode/ImageNode';
import { ExpertStudyLinesNode, isExpertStudyLinesNode } from '../components/LinesNode/LinesNode';
import { ExpertStudyMonitorNode, isExpertStudyMonitorNode } from '../components/MonitorNode/MonitorNode';
import { ExpertStudyRecorderNode, isExpertStudyRecorderNode } from '../components/RecorderNode/RecorderNode';
import { ExpertStudyRectangleNode, isExpertStudyRectangleNode } from '../components/RectangleNode/RectangleNode';
import { ExpertStudyMiscProductNode, isExpertStudyMiscProductNode } from '../components/MiscProductNode/MiscProductNode';
import { ExpertStudySynopticCameraNode, isExpertStudySynopticCameraNode } from '../components/SynopticCameraNode/SynopticCameraNode';
import { ExpertStudyTextNode, isExpertStudyTextNode } from '../components/TextNode/TextNode';
import { ExpertStudyTransmitterNode, isExpertStudyTransmitterNode } from '../components/TransmitterNode/TransmitterNode';
import DensityColors from './enums/DensityColors';

const defaultSynopticPage = {
  nodes: [] as Array<ExpertStudyNode>,
  edges: [] as Array<Edge>,
  viewport: { x: 0, y: 0, zoom: 1 },
  type: 'synoptic' as const,
};

const defaultDensityPage = {
  nodes: [{ id: uuidv4(), type: 'densityScale', position: { x: 0, y: 0 }, data: { rotation: 0 } } as ExpertStudyDensityScaleNode] as Array<ExpertStudyNode>,
  edges: [] as Array<Edge>,
  viewport: { x: 0, y: 0, zoom: 1 },
  type: 'density' as const,
  scale: { virtual: 50, real: 10 },
};

const initialState = {
  pages: [{ ...defaultSynopticPage, id: uuidv4() }],
  currentPage: 0,
  businessId: undefined,
};

export type ExpertStudyNode =
  | ExpertStudySynopticCameraNode
  | ExpertStudyMonitorNode
  | ExpertStudyRecorderNode
  | ExpertStudyTransmitterNode
  | ExpertStudyMiscProductNode
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
      isExpertStudyMiscProductNode(node) ||
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
    'id' in page &&
    typeof page.id === 'string' &&
    !!page.id &&
    'nodes' in page &&
    Array.isArray(page.nodes) &&
    page.nodes.every(isExpertStudyNode) &&
    'edges' in page &&
    Array.isArray(page.edges) &&
    page.edges.every(isEdge) &&
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
    (!('name' in page) || typeof page.name === 'string' || typeof page.name === 'undefined') &&
    (!('studyName' in page) || typeof page.studyName === 'string' || typeof page.studyName === 'undefined') &&
    (!('installerName' in page) || typeof page.installerName === 'string' || typeof page.installerName === 'undefined') &&
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
  id: string;
  nodes: Array<ExpertStudyNode>;
  edges: Array<Edge>;
  viewport: Viewport;
  name?: string;
  studyName?: string;
  installerName?: string;
};

export type ExpertStudySynopticPage = BasePage & { type: 'synoptic' };
export type ExpertStudyDensityPage = BasePage & { type: 'density'; scale: { virtual: number; real: number }; colors?: DensityColors };

export type ExpertStudyPage = ExpertStudySynopticPage | ExpertStudyDensityPage;

export type RFState = {
  pages: Array<ExpertStudyPage>;
  currentPage: number;
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
  setPageStudyName: (studyName: string) => void;
  setPageInstallerName: (installerName: string) => void;
  setPageName: (pageName: string) => void;
  setPageScale: ({ virtual, real }: { virtual?: number; real?: number }) => void;
  getPageType: () => 'synoptic' | 'density';
  getPages: () => Array<ExpertStudyPage>;
  getBusinessId: () => string | undefined;
  setBusinessId: (businessId: string) => void;
  reset: () => void;
  importStudy: (study: { pages: Array<ExpertStudyPage> }) => void;
  pageMove: (fromId: string, toId: string) => void;
  setPageColors: (colors: DensityColors) => void;
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
  setPageStudyName: (studyName: string) => {
    const currentPage = get().currentPage;
    set({ pages: get().pages.map((page, index) => (index === currentPage ? { ...page, studyName: studyName } : page)) });
  },
  setPageInstallerName: (installerName: string) => {
    const currentPage = get().currentPage;
    set({ pages: get().pages.map((page, index) => (index === currentPage ? { ...page, installerName: installerName } : page)) });
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
    const page = { ...(mode === 'synoptic' ? defaultSynopticPage : defaultDensityPage), id: uuidv4() };
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
  importStudy: async (study: { pages: Array<ExpertStudyPage> }) => {
    set({ pages: study.pages, currentPage: 0 });
  },
  pageMove: (fromId: string, toId: string) => {
    const pages = get().pages;
    const page = pages[get().currentPage];
    const fromIndex = pages.findIndex((page) => page.id === fromId);
    const toIndex = pages.findIndex((page) => page.id === toId);
    if (fromIndex === undefined || toIndex === undefined) throw new Error('Invalid page id');
    const newPages = arrayMove(pages, fromIndex, toIndex);
    const newPage = newPages.indexOf(page);
    set({ pages: newPages, currentPage: newPage });
  },
  setPageColors: (colors: DensityColors) => {
    const pages = get().pages;
    const currentPage = get().currentPage;
    set({ pages: pages.map((page, index) => (index === currentPage && page.type === 'density' ? { ...page, colors } : page)) });
  },
}));

export default useStore;
