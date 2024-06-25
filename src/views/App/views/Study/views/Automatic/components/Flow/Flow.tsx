import { useCallback } from 'react';
import ReactFlow, { Background, BackgroundVariant, ConnectionMode, Controls, OnConnect, Panel, addEdge, useEdgesState, useNodesState } from 'reactflow';
import AppViewStudyViewAutomaticViewFlowComponentNvrNodeComponent from './components/NvrNode/NvrNode';
import AppViewStudyViewAutomaticViewIndependantCameraNode from './components/IndependantCameraNode/IndependantCameraNode';
import AppViewStudyViewAutomaticViewFlowComponentMonitorNodeComponent from './components/MonitorNode/MonitorNode';
import AppViewStudyViewAutomaticViewFlowComponentFinalCameraNodeComponent from './components/FinalCameraNode/FinalCameraNode';
import AppViewStudyViewAutomaticViewFlowComponentFinalMonitorNodeComponent from './components/FinalMonitorNode/FinalMonitorNode';
import { AutomaticStudyStep } from '../../Automatic';
import classNames from 'classnames';
import AppViewStudyViewAutomaticViewFlowComponentBoxNodeComponent from './components/BoxNode/BoxNode';

const nodeTypes = {
  nvrNode: AppViewStudyViewAutomaticViewFlowComponentNvrNodeComponent,
  independantNode: AppViewStudyViewAutomaticViewIndependantCameraNode,
  automatiqueTvNode: AppViewStudyViewAutomaticViewFlowComponentMonitorNodeComponent,
  tvNode: AppViewStudyViewAutomaticViewFlowComponentFinalMonitorNodeComponent,
  finalNode: AppViewStudyViewAutomaticViewFlowComponentFinalCameraNodeComponent,
  boxNode: AppViewStudyViewAutomaticViewFlowComponentBoxNodeComponent,
};

type AppViewStudyViewAutomaticViewFlowComponentProps = Readonly<{ step: AutomaticStudyStep }>;
export default function AppViewStudyViewAutomaticViewFlowComponent({ step }: AppViewStudyViewAutomaticViewFlowComponentProps) {
  const [nodes, _setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect: OnConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params, animated: true, type: 'smoothstep' }, eds)), [setEdges]);

  return (
    <div className={`relative z-20 h-[70vh] w-[100%] rounded-md border-2 border-[#1a192b] ${classNames({ 'h-[80vh]': step === AutomaticStudyStep.Two })}`}>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        proOptions={{ hideAttribution: true }}
        connectionMode={ConnectionMode.Loose}
        panOnDrag={false}
      >
        {
          // TODO: reimplement this
          /* <Controls showFitView={!state.pdfFile.show} showInteractive={!state.pdfFile.show} showZoom={!state.pdfFile.show} /> */
        }
        {step === AutomaticStudyStep.Two && (
          <Panel position="bottom-left">
            <div className="flex items-baseline gap-1">
              <div className="h-0.5 w-10 bg-black"></div>
              <div>Câble CAT6 S/FTP 100m maxi</div>
            </div>
            <div className="flex items-baseline gap-1">
              <div className="h-0.5 w-10 bg-blue-700"></div>
              <div>Cordon HDMI</div>
            </div>
          </Panel>
        )}
        <Controls />
        <Background variant={BackgroundVariant.Lines} color="white" />
        {/* <Caption visible={state.finalBucket === 'show'} /> */}
      </ReactFlow>
    </div>
  );
}
