import { useState } from 'react';
import { Edge, Node, Viewport } from '@xyflow/react';
import { AutomaticStudyStep } from '../../Automatic';
import AppViewStudyViewAutomaticViewFooterComponentStepOneComponent from './components/StepOne/StepOne';
import AppViewStudyViewAutomaticViewFooterComponentStepTwoComponent from './components/StepTwo/StepTwo';

type AppViewStudyViewAutomaticViewFooterComponentProps = Readonly<{ step: AutomaticStudyStep; setStep: (step: AutomaticStudyStep) => void }>;
export default function AppViewStudyViewAutomaticViewFooterComponent({ step, setStep }: AppViewStudyViewAutomaticViewFooterComponentProps) {
  const [backupFlow, setBackupFlow] = useState<{ nodes: Array<Node>; edges: Array<Edge>; viewport: Viewport }>();

  const children = (() => {
    switch (step) {
      case AutomaticStudyStep.One:
        return <AppViewStudyViewAutomaticViewFooterComponentStepOneComponent setBackupFlow={setBackupFlow} setStep={setStep} />;
      case AutomaticStudyStep.Two:
        return <AppViewStudyViewAutomaticViewFooterComponentStepTwoComponent backupFlow={backupFlow!} setStep={setStep} />;
    }
  })();

  return (
    <div className="flex h-12 items-center justify-end space-x-3 pr-6">
      {children}
      {/* {state.finalBucket !== 'hide' && (
            <>
                <button onClick={() => handleExportToPdf()} className='disabled:bg-slate-700 bg-[#16204e] rounded-md py-1 px-4 text-white'>
                    Exporter en pdf
                </button>
                <button
                    onClick={() => {
                        setEdges(backUpEdges);
                        setNodes(backUpNodes);

                        dispatch({ type: 'hideFinalBucket' });
                    }}
                    className='disabled:bg-slate-700 bg-[#16204e] rounded-md py-1 px-4 text-white'
                >
                    Modifier
                </button>
            </>
        )}
        {state.finalBucket === 'hide' ? (
            <button
                disabled={numOfcam === 0}
                className='bg-red-500 rounded-md py-1 px-4 text-white disabled:bg-black'
                onClick={() => {
                    const nodeTvExist = nodes.find((node) => node.type === 'automatiqueTvNode');
                    if (!nodeTvExist) {
                        dispatch({
                            type: 'showTvConfirmation',
                        });
                    } else {
                        setEdges((eds) => {
                            setBackUpEdges(eds);
                            const edges = finalNodes.map((node) => ({
                                id: `${Math.random() * 20}`,
                                source: node.id,
                                sourceHandle: 'x',
                                handlePosition: 'right',
                                target: 'enregistreur',
                                targetHandle: node.id,
                                type: 'smoothstep',
                                style: {
                                    stroke: 'black',
                                },
                            }));
                            return edges.concat([
                                {
                                    id: 'tv__enregistreur',
                                    source: selectedTvId,
                                    sourceHandle: 'x',
                                    target: 'enregistreur',
                                    targetHandle: 'tv',
                                    type: 'smoothstep',
                                    style: {
                                        stroke: 'blue',
                                    },
                                    zIndex: 10,
                                },
                                {
                                    id: 'v45__enregistreur',
                                    source: 'v45',
                                    sourceHandle: 'x',
                                    target: 'enregistreur',
                                    targetHandle: 'v45',
                                    type: 'smoothstep',
                                    style: {
                                        stroke: 'black',
                                    },
                                    zIndex: 10,
                                },
                            ]);
                        });
                        setNodes((nodes) => {
                            setBackUpNodes(nodes);
                            return finalNodes.concat([
                                enregistreur,
                                {
                                    id: selectedTvId,
                                    type: 'tvNode',
                                    position: {
                                        x: 500,
                                        y: 200,
                                    },
                                    data: {
                                        id: selectedTvId,
                                        image: selectedTvModel.image,
                                    },
                                },
                                {
                                    id: 'v45',
                                    type: 'tvNode',
                                    position: {
                                        x: 440,
                                        y: 370,
                                    },
                                    data: {
                                        id: selectedTvId,
                                        image: `https://bd.vizeo.eu/6-Photos/BOX/Box.png`,
                                    },
                                },
                            ]);
                        });
                        dispatch({ type: 'showFinalBucket' });
                    }
                }}
            >
                Vérifier la configuration
            </button>
        ) : (
            <button disabled={numOfcam === 0} className='bg-red-500 rounded-md py-1 px-4 text-white' onClick={addToBusiness}>
                {"Envoyer la liste dans l'affaire"}
            </button>
        )} */}
    </div>
  );
}
