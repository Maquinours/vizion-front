import { getRouteApi } from '@tanstack/react-router';
import { Panel } from '@xyflow/react';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import { useSuspenseQuery } from '@tanstack/react-query';
import useStore, { RFState } from '../../utils/store';
import { useShallow } from 'zustand/react/shallow';
import moment from 'moment';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId_/study/expert');

const selector = (state: RFState) => ({
  studyName: state.studyName,
  installerName: state.installerName,
  pageName: state.pages[state.currentPage].name,
  currentPage: state.currentPage,
  pageType: state.pages[state.currentPage]?.type,
  setStudyName: state.setStudyName,
  setInstallerName: state.setInstallerName,
  setPageName: state.setPageName,
});

export default function AppViewStudyViewExpertViewFlowComponentCartridgeComponent() {
  const { studyName, installerName, pageName, currentPage, pageType, setStudyName, setInstallerName, setPageName } = useStore(useShallow(selector));

  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const studyNameValue = studyName ?? business.title ?? '';
  const installerNameValue = installerName ?? business.installerProfileName ?? '';
  const pageNameValue = pageName ?? `Page ${currentPage + 1}`;

  return (
    <Panel position="bottom-right" style={{ margin: 0 }}>
      <table className="min-h-full w-fit divide-y divide-gray-300 border-l border-t border-[#1a192b] bg-gray-50">
        <thead>
          <tr className="border-y border-l border-[#1a192b]">
            <th scope="col" className="border border-[#1a192b] py-2 pl-4 pr-3 text-xs font-semibold text-[#1a192b] sm:pl-6">
              <p className="w-full rounded-md bg-[#16204e]/30 px-2 text-center">
                <input
                  type="text"
                  size={Math.max(studyNameValue.length, 1)}
                  className="bg-transparent text-center"
                  value={studyNameValue}
                  onChange={(e) => setStudyName(e.target.value)}
                />
              </p>
            </th>
            <th scope="col" className="border border-[#1a192b] px-3 py-2 text-center text-xs font-semibold text-[#1a192b]">
              {business.numBusiness}
            </th>
            <th scope="col" className="border border-[#1a192b] px-3 py-2 text-center text-xs font-semibold text-[#1a192b]">
              {pageType === 'density' ? <p className="text-[orange]">* Valeurs mode jour</p> : <p>Étude</p>}
            </th>
            <th scope="col" className="border-y border-l border-[#1a192b] px-3 py-2 text-center text-xs font-semibold text-[#1a192b]">
              {moment().format('DD/MM/YYYY')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          <tr className="border-l border-t border-[#1a192b]">
            <td className="whitespace-nowrap border-x border-t border-[#1a192b] py-2 pl-4 pr-3 text-sm font-bold text-[#1a192b] sm:pl-6">
              <p className="w-full rounded-md bg-[#16204e]/30 px-2 text-center">
                <input
                  type="text"
                  size={Math.max(installerNameValue.length, 1)}
                  className="bg-transparent text-center"
                  onChange={(e) => setInstallerName(e.target.value)}
                  value={installerNameValue}
                />
              </p>
            </td>
            <td className="text-medium whitespace-nowrap border-x border-t border-[#1a192b] px-3 py-2 text-center font-extrabold text-[#1a192b]" colSpan={2}>
              <div className="flex items-center justify-center space-x-2 text-center text-xs">
                <p>
                  {(() => {
                    switch (pageType) {
                      case 'synoptic':
                        return 'Synoptique';
                      case 'density':
                        return 'Calcul de densité';
                    }
                  })()}
                </p>
              </div>
            </td>
            <td className="whitespace-nowrap border-l border-t border-[#1a192b] px-3 py-2 text-center text-xs text-[#1a192b]">
              <input
                className="bg-transparent font-bold"
                style={{ width: `${pageNameValue.length}ch`, minWidth: '3ch' }}
                type="text"
                value={pageNameValue}
                onChange={(e) => setPageName(e.target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </Panel>
  );
}
