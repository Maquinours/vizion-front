import { $generateHtmlFromNodes } from '@lexical/html';
import { Edge, Node, Viewport, isEdge, isNode } from '@xyflow/react';
import { createEditor } from 'lexical';
import { v4 as uuidv4 } from 'uuid';
import { queryClient } from '../../../../../../../../router';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { ExpertStudyBackgroundNode } from '../../components/Flow/components/BackgroundNode/BackgroundNode';
import { ExpertStudyDensityCameraNode } from '../../components/Flow/components/DensityCameraNode/DensityCameraNode';
import { ExpertStudyDensityScaleNode } from '../../components/Flow/components/DensityScaleNode/DensityScaleNode';
import { ExpertStudyImageNode } from '../../components/Flow/components/ImageNode/ImageNode';
import { ExpertStudyLinesNode } from '../../components/Flow/components/LinesNode/LinesNode';
import { ExpertStudyMonitorNode } from '../../components/Flow/components/MonitorNode/MonitorNode';
import { ExpertStudyRecorderNode } from '../../components/Flow/components/RecorderNode/RecorderNode';
import { ExpertStudyRectangleNode } from '../../components/Flow/components/RectangleNode/RectangleNode';
import { ExpertStudySynopticCameraNode } from '../../components/Flow/components/SynopticCameraNode/SynopticCameraNode';
import { ExpertStudyTextNode } from '../../components/Flow/components/TextNode/TextNode';
import { ExpertStudyTransmitterNode } from '../../components/Flow/components/TransmitterNode/TransmitterNode';
import { ExpertStudyPage, isExpertStudyPage } from '../../components/Flow/utils/store';

type ValidPage =
  | { nodes: Array<Node>; edges: Array<Edge>; viewport: Viewport; mode: 'SYNOPTIC' }
  | { nodes: Array<Node>; edges: Array<Edge>; viewport: Viewport; mode: 'DENSITY'; scale: { virtual: number; real: number } };

function rotatePoint(x: number, y: number, angleDegrees: number) {
  const angleRadians = angleDegrees * (Math.PI / 180);
  const cos = Math.cos(angleRadians);
  const sin = Math.sin(angleRadians);
  const xNew = x * cos - y * sin;
  const yNew = x * sin + y * cos;
  return { x: xNew, y: yNew };
}

const handleMonitorNode = (node: Node) => {
  const productId = typeof node.data.productId === 'string' ? node.data.productId : typeof node.data.id === 'string' ? node.data.id : undefined;
  if (!productId) throw new Error('Invalid monitor node');
  const name = typeof node.data.name === 'string' ? node.data.name : typeof node.data.reference === 'string' ? node.data.reference : undefined;
  const options = ('options' in node.data && Array.isArray(node.data.options) ? node.data.options : []).filter(
    (option): option is { id: string; quantity: number } =>
      'id' in option && typeof option.id === 'string' && 'quantity' in option && typeof option.quantity === 'number',
  );

  const size =
    typeof node.data.size === 'object' &&
    !!node.data.size &&
    'width' in node.data.size &&
    typeof node.data.size.width === 'number' &&
    'height' in node.data.size &&
    typeof node.data.size.height === 'number'
      ? { width: node.data.size.width, height: node.data.size.height }
      : { width: 80, height: 80 };

  const newNode: ExpertStudyMonitorNode = {
    id: node.id,
    type: 'monitor',
    position: { x: node.position.x, y: node.position.y },
    data: {
      productId: productId,
      name: name,
      options: options.map((option) => ({ id: option.id, quantity: option.quantity })),
      size: size,
      opacity: 'opacity' in node.data && typeof node.data.opacity === 'number' ? node.data.opacity : 100,
    },
  };
  return newNode;
};

const handleRecorderNode = (node: Node) => {
  const productId = typeof node.data.productId === 'string' ? node.data.productId : typeof node.data.modelId === 'string' ? node.data.modelId : undefined;
  if (!productId) throw new Error('Invalid recorder node');
  const name = typeof node.data.name === 'string' ? node.data.name : typeof node.data.reference === 'string' ? node.data.reference : undefined;
  const size =
    typeof node.data.size === 'object' &&
    !!node.data.size &&
    'width' in node.data.size &&
    typeof node.data.size.width === 'number' &&
    'height' in node.data.size &&
    typeof node.data.size.height === 'number'
      ? { width: node.data.size.width, height: node.data.size.height }
      : { width: 160, height: 160 };
  const opacity = typeof node.data.opacity === 'number' ? node.data.opacity : 100;
  const options = ('options' in node.data && Array.isArray(node.data.options) ? node.data.options : []).filter(
    (option): option is { id: string; quantity: number } =>
      'id' in option && typeof option.id === 'string' && 'quantity' in option && typeof option.quantity === 'number',
  );

  const newNode: ExpertStudyRecorderNode = {
    id: node.id,
    type: 'recorder',
    position: { x: node.position.x, y: node.position.y },
    data: {
      productId: productId,
      name: name,
      options: options.map((option) => ({ id: option.id, quantity: option.quantity })),
      size: size,
      opacity: opacity,
    },
  };
  return newNode;
};

const handleTransmitterNode = (node: Node) => {
  const productId = typeof node.data.productId === 'string' ? node.data.productId : typeof node.data.modelId === 'string' ? node.data.modelId : undefined;
  if (!productId) throw new Error('Invalid transmitter node');
  const name = typeof node.data.name === 'string' ? node.data.name : typeof node.data.reference === 'string' ? node.data.reference : undefined;
  const options = ('options' in node.data && Array.isArray(node.data.options) ? node.data.options : []).filter(
    (option): option is { id: string; quantity: number } =>
      'id' in option && typeof option.id === 'string' && 'quantity' in option && typeof option.quantity === 'number',
  );
  const size =
    typeof node.data.size === 'object' &&
    !!node.data.size &&
    'width' in node.data.size &&
    typeof node.data.size.width === 'number' &&
    'height' in node.data.size &&
    typeof node.data.size.height === 'number'
      ? { width: node.data.size.width, height: node.data.size.height }
      : { width: 160, height: 160 };
  const opacity = typeof node.data.opacity === 'number' ? node.data.opacity : 100;

  const newNode: ExpertStudyTransmitterNode = {
    id: node.id,
    type: 'transmitter',
    position: { x: node.position.x, y: node.position.y },
    data: {
      productId: productId,
      name: name,
      options: options.map((option) => ({ id: option.id, quantity: option.quantity })),
      size: size,
      opacity: opacity,
    },
  };
  return newNode;
};

const handleLineNode = (node: Node) => {
  if (
    typeof node.data.size !== 'object' ||
    !node.data.size ||
    !('width' in node.data.size) ||
    typeof node.data.size.width !== 'number' ||
    !node.data.size.width ||
    !('height' in node.data.size) ||
    typeof node.data.size.height !== 'number' ||
    !node.data.size.height
  )
    throw new Error('Invalid line node');
  const angle = typeof node.data.angle === 'number' ? node.data.angle : 0;
  const positions = [rotatePoint(node.data.size.width / 2, node.data.size.height, angle), rotatePoint(node.data.size.width / 2, 0, angle)];
  const newNode: ExpertStudyLinesNode = {
    id: node.id,
    type: 'lines',
    position: { x: node.position.x, y: node.position.y },
    data: {
      positions: positions,
      color: typeof node.data.color === 'string' ? node.data.color : undefined,
      dasharray: typeof node.data.dasharray === 'boolean' && node.data.dasharray ? 4 : undefined,
      obstacle: typeof node.data.obstacle === 'boolean' && node.data.obstacle ? true : undefined,
    },
  };
  return newNode;
};

const handleLinesNode = (node: Node) => {
  if (!Array.isArray(node.data.lines)) throw new Error('Invalid lines node');
  const lines = node.data.lines.filter(
    (line): line is { x1: number; y1: number; x2: number; y2: number } =>
      typeof line === 'object' &&
      line !== null &&
      'x1' in line &&
      typeof line.x1 === 'number' &&
      'y1' in line &&
      typeof line.y1 === 'number' &&
      'x2' in line &&
      typeof line.x2 === 'number' &&
      'y2' in line &&
      typeof line.y2 === 'number',
  );
  const positions = lines.map((line) => ({
    x: line.x1 - node.position.x,
    y: line.y1 - node.position.y,
  }));
  positions.push({ x: lines[lines.length - 1].x2 - node.position.x, y: lines[lines.length - 1].y2 - node.position.y });
  const newNode: ExpertStudyLinesNode = {
    id: node.id,
    type: 'lines',
    position: { x: node.position.x, y: node.position.y },
    data: {
      positions: positions,
      color: typeof node.data.color === 'string' ? node.data.color : undefined,
      dasharray: typeof node.data.dasharray === 'boolean' && node.data.dasharray ? 4 : undefined,
      obstacle: typeof node.data.obstacle === 'boolean' && node.data.obstacle ? true : undefined,
    },
  };
  return newNode;
};

const handleRectangleNode = (node: Node) => {
  const size =
    typeof node.data.size === 'object' &&
    !!node.data.size &&
    'width' in node.data.size &&
    typeof node.data.size.width === 'number' &&
    'height' in node.data.size &&
    typeof node.data.size.height === 'number'
      ? { width: node.data.size.width, height: node.data.size.height }
      : { width: 50, height: 100 };

  const newNode: ExpertStudyRectangleNode = {
    id: node.id,
    type: 'rectangle',
    position: { x: node.position.x, y: node.position.y },
    data: {
      size: size,
    },
  };
  return newNode;
};

const handleCalibreNode = (node: Node) => {
  const newNode: ExpertStudyDensityScaleNode = {
    id: node.id,
    type: 'densityScale',
    position: { x: node.position.x, y: node.position.y },
    data: {
      rotation: typeof node.data.rotation === 'number' ? node.data.rotation : 0,
    },
  };
  return newNode;
};

const handleObjectNode = (node: Node) => {
  const image = typeof node.data.image === 'string' ? node.data.image : undefined;
  if (!image) throw new Error('Invalid image node');
  const size =
    typeof node.data.size === 'object' &&
    !!node.data.size &&
    'width' in node.data.size &&
    typeof node.data.size.width === 'number' &&
    'height' in node.data.size &&
    typeof node.data.size.height === 'number'
      ? { width: node.data.size.width, height: node.data.size.height }
      : undefined;
  if (!size) throw new Error('Invalid image node');
  const newNode: ExpertStudyImageNode = {
    id: node.id,
    type: 'image',
    position: { x: node.position.x, y: node.position.y },
    data: {
      image: image,
      size: size,
      opacity: typeof node.data.opacity === 'number' ? node.data.opacity : 100,
      rotation: typeof node.data.rotation === 'number' ? node.data.rotation : 0,
    },
  };
  return newNode;
};

const handleBackgroundNode = (node: Node) => {
  const scale = typeof node.data.scale === 'number' ? node.data.scale : 1;
  const opacity = typeof node.data.opacity === 'number' ? node.data.opacity : 1;
  const rotation = typeof node.data.rotation === 'number' ? node.data.rotation : 0;
  const width = typeof node.data.width === 'number' ? node.data.width : undefined;
  const height = typeof node.data.height === 'number' ? node.data.height : undefined;
  const image = typeof node.data.img === 'string' ? node.data.img : undefined;
  if (!width || !height || !image) throw new Error('Invalid background node');

  const newNode: ExpertStudyBackgroundNode = {
    id: node.id,
    type: 'background',
    position: { x: node.position.x, y: node.position.y },
    data: {
      image: image,
      scale: scale,
      opacity: opacity,
      rotation: rotation,
      width: width,
      height: height,
    },
  };
  return newNode;
};

const handleSynopticCameraNode = (node: Node, productId: string) => {
  const name = typeof node.data.name === 'string' ? node.data.name : typeof node.data.reference === 'string' ? node.data.reference : undefined;
  const options = ('options' in node.data && Array.isArray(node.data.options) ? node.data.options : []).filter(
    (option): option is { id: string; quantity: number } =>
      'id' in option && typeof option.id === 'string' && 'quantity' in option && typeof option.quantity === 'number',
  );
  const size =
    typeof node.data.size === 'object' &&
    !!node.data.size &&
    'width' in node.data.size &&
    typeof node.data.size.width === 'number' &&
    'height' in node.data.size &&
    typeof node.data.size.height === 'number'
      ? { width: node.data.size.width, height: node.data.size.height }
      : { width: 80, height: 80 };

  const newNode: ExpertStudySynopticCameraNode = {
    id: node.id,
    type: 'synopticCamera',
    position: { x: node.position.x, y: node.position.y },
    data: {
      productId: productId,
      name: name,
      options: options,
      size: size,
      opacity: typeof node.data.opacity === 'number' ? node.data.opacity : 100,
      quantity: typeof node.data.quantity === 'number' ? node.data.quantity : 1,
    },
  };
  return newNode;
};

const handleDensityCameraNode = async (node: Node, productId: string) => {
  const angle = await (async () => {
    const angle = typeof node.data.angle === 'number' ? node.data.angle : undefined;
    if (!!angle) return angle;
    else {
      const products = await queryClient.ensureQueryData(queries.product.list);
      const product = products.find((product) => product.id === productId);
      if (!product) throw new Error('Impossible de trouver le produit');
      const hAngle = product.specificationProducts?.find((spec) => spec.specification?.name === 'ANGLE H');
      if (!hAngle) throw new Error("Impossible de trouver l'angle H");
      if (!!hAngle.value) return hAngle.value;
      else if (!!hAngle.maxValue) return hAngle.maxValue;
      else throw new Error("Impossible de trouver l'angle H");
    }
  })();

  const newNode: ExpertStudyDensityCameraNode = {
    id: node.id,
    type: 'densityCamera',
    position: { x: node.position.x, y: node.position.y },
    data: {
      productId: productId,
      range: typeof node.data.range === 'number' ? node.data.range : 10,
      rotation: typeof node.data.rotation === 'number' ? node.data.rotation : 0,
      opacity: typeof node.data.opacity === 'number' ? node.data.opacity : 100,
      angle: angle,
      name: typeof node.data.name === 'string' ? node.data.name : undefined,
    },
  };
  return newNode;
};

const handleCameraNode = async (node: Node, pageType: 'synoptic' | 'density') => {
  const productId =
    typeof node.data.productId === 'string'
      ? node.data.productId
      : typeof node.data.modelId === 'string'
        ? node.data.modelId
        : typeof node.data.id === 'string'
          ? node.data.id
          : undefined;
  if (!productId) throw new Error('Invalid camera node');

  switch (pageType) {
    case 'synoptic':
      return handleSynopticCameraNode(node, productId);
    case 'density':
      return handleDensityCameraNode(node, productId);
  }
};

const handleTextNode = async (node: Node) => {
  if (!('editorState' in node.data) || typeof node.data.editorState !== 'string') throw new Error('Invalid text node');
  const editor = createEditor();
  const parsedEditorState = editor.parseEditorState(node.data.editorState);
  editor.setEditorState(parsedEditorState);

  const newNode = await (async (): Promise<ExpertStudyTextNode> => {
    return new Promise((resolve, reject) => {
      try {
        editor.getEditorState().read(() => {
          const text = $generateHtmlFromNodes(editor, null);
          const newNode: ExpertStudyTextNode = {
            id: node.id,
            type: 'text',
            position: { x: node.position.x + 10, y: node.position.y + 87 },
            data: {
              text: text,
            },
          };
          resolve(newNode);
        });
      } catch (error) {
        reject(error);
      }
    });
  })();

  return newNode;
};

const transformNode = async (node: Node, pageType: 'synoptic' | 'density') => {
  switch (node.type) {
    case 'moniteurNode':
      return handleMonitorNode(node);
    case 'HD504PAP':
    case 'HD508PAP':
    case 'HD516PAP':
    case 'HD716':
    case 'HD732':
    case 'HD764':
    case 'HD508':
    case 'HD504':
    case 'enregistreurNode':
      return handleRecorderNode(node);
    case 'POE04':
    case 'POE08':
    case 'POE16':
    case 'POE04LD':
    case 'KITFIBRE':
    case 'PONTWIFI':
    case 'SG05':
    case 'transmetteurNode':
      return handleTransmitterNode(node);
    case 'lineNode':
      return handleLineNode(node);
    case 'linesNode':
      return handleLinesNode(node);
    case 'rectangleNode':
      return handleRectangleNode(node);
    case 'calibreNode':
      return handleCalibreNode(node);
    case 'objectNode':
      return handleObjectNode(node);
    case 'backgroundNode':
      return handleBackgroundNode(node);
    case 'cameraNode':
    case 'synopticCameraNode':
      return handleCameraNode(node, pageType);
    case 'textNode':
      return handleTextNode(node);
    default:
      throw new Error('Invalid node type : ' + node.type);
  }
};

const isValidPage = (page: unknown): page is ValidPage =>
  !!page &&
  typeof page === 'object' &&
  'nodes' in page &&
  Array.isArray(page.nodes) &&
  page.nodes.every((node) => isNode(node)) &&
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
  'mode' in page &&
  typeof page.mode === 'string' &&
  ['SYNOPTIC', 'DENSITY'].includes(page.mode) &&
  (page.mode !== 'DENSITY' ||
    ('scale' in page &&
      !!page.scale &&
      typeof page.scale === 'object' &&
      'virtual' in page.scale &&
      typeof page.scale.virtual === 'number' &&
      'real' in page.scale &&
      typeof page.scale.real === 'number'));

const transformPage = async (page: unknown): Promise<ExpertStudyPage> => {
  if (!!page && typeof page === 'object' && 'edges' in page && Array.isArray(page.edges))
    page.edges = page.edges.map((edge) => (typeof edge === 'object' && !!edge ? { ...edge, id: uuidv4(), type: 'smoothstep' } : edge));

  if (!isValidPage(page)) throw new Error('Invalid page');

  const pageType = page.mode === 'SYNOPTIC' ? 'synoptic' : page.mode === 'DENSITY' ? 'density' : undefined;
  if (!pageType) throw new Error('Invalid page type');

  const nodes = await Promise.all(page.nodes.map((node) => transformNode(node, pageType)));
  if (page.mode === 'SYNOPTIC') return { viewport: page.viewport, nodes: nodes, edges: page.edges, type: 'synoptic' };
  else if (page.mode === 'DENSITY') return { viewport: page.viewport, nodes: nodes, edges: page.edges, type: 'density', scale: page.scale };
  else throw new Error('Invalid page type');
};

const studyV1ToV2 = async (study: object) => {
  if (!study || !('pages' in study) || !Array.isArray(study.pages)) throw new Error('Invalid study');
  const pages = await Promise.all(study.pages.map((page) => transformPage(page)));

  return { pages: pages };
};

export const parseStudy = async (study: unknown): Promise<{ pages: Array<ExpertStudyPage>; studyName?: string; installerName?: string }> => {
  const parsedStudy = await (async () => {
    if (typeof study !== 'object' || study === null) throw new Error('Invalid study');
    if (!('version' in study)) return studyV1ToV2(study);
    else if (study.version === 2) return study;
    else throw new Error('Invalid study version');
  })();

  if (
    !('pages' in parsedStudy) ||
    !parsedStudy.pages ||
    !Array.isArray(parsedStudy.pages) ||
    !parsedStudy.pages.every((page) => isExpertStudyPage(page)) ||
    ('studyName' in parsedStudy && typeof parsedStudy.studyName !== 'string' && parsedStudy.studyName !== undefined) ||
    ('installerName' in parsedStudy && typeof parsedStudy.installerName !== 'string' && parsedStudy.installerName !== undefined)
  )
    throw new Error('Invalid study');
  return {
    pages: parsedStudy.pages.map((page) => ({
      ...page,
      nodes: page.nodes.map((node) => {
        switch (node.type) {
          case 'densityCamera':
          case 'lines':
            return {
              ...node,
              style: { pointerEvents: 'none' },
            };
          default:
            return node;
        }
      }),
    })),
    studyName: 'studyName' in parsedStudy && typeof parsedStudy.studyName === 'string' ? parsedStudy.studyName : undefined,
    installerName: 'installerName' in parsedStudy && typeof parsedStudy.installerName === 'string' ? parsedStudy.installerName : undefined,
  };
};
