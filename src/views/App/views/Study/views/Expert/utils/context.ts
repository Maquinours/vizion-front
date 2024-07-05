import React, { createContext } from 'react';
import { XYPosition } from 'reactflow';

export enum ExpertStudyModalType {
  INDOOR_CAMERAS,
  OUTDOOR_CAMERAS,
  DOME_CAMERAS,
  UNIVERSAL_CAMERAS,
  MONITORS,
  RECORDERS,
  TRANSMITTERS,
  OTHER_CAMERAS,
  ADD_TEXT,
  EDIT_TEXT,
}

export type ExpertStudyModal =
  | { type: ExpertStudyModalType.INDOOR_CAMERAS; data?: undefined }
  | { type: ExpertStudyModalType.OUTDOOR_CAMERAS; data?: undefined }
  | { type: ExpertStudyModalType.DOME_CAMERAS; data?: undefined }
  | { type: ExpertStudyModalType.UNIVERSAL_CAMERAS; data?: undefined }
  | { type: ExpertStudyModalType.MONITORS; data?: undefined }
  | { type: ExpertStudyModalType.RECORDERS; data?: undefined }
  | { type: ExpertStudyModalType.TRANSMITTERS; data?: undefined }
  | { type: ExpertStudyModalType.OTHER_CAMERAS; data?: undefined }
  | { type: ExpertStudyModalType.ADD_TEXT; data: { nodePosition: XYPosition } }
  | { type: ExpertStudyModalType.EDIT_TEXT; data: { nodeId: string } };

export enum ExpertStudyPaneClickFunctionType {
  TEXT,
  RECTANGLE,
  LINES,
}

export type ExpertStudyPaneClickFunction =
  | {
      type: ExpertStudyPaneClickFunctionType.TEXT;
      data?: {
        position?: XYPosition;
        nodeId?: string;
      };
    }
  | {
      type: ExpertStudyPaneClickFunctionType.RECTANGLE;
      data?: {
        initialPosition: XYPosition;
        cursorPosition: XYPosition;
      };
    }
  | {
      type: ExpertStudyPaneClickFunctionType.LINES;
      data?: {
        positions: Array<XYPosition>;
        cursorPosition: XYPosition;
      };
    };

type ExpertStudyContextType = {
  modal: ExpertStudyModal | undefined;
  setModal: (modal: ExpertStudyModal | undefined) => void;
  paneClickFunction: ExpertStudyPaneClickFunction | undefined;
  setPaneClickFunction: React.Dispatch<React.SetStateAction<ExpertStudyPaneClickFunction | undefined>>;
};

const ExpertStudyContext = createContext<ExpertStudyContextType | null>(null);

export default ExpertStudyContext;
