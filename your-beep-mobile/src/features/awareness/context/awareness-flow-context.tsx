import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

type RootCauseId =
  | 'learned-emotional-strategy'
  | 'protective-belief-or-meaning'
  | 'recurring-environmental-stressor'
  | 'unmet-need';

interface AwarenessFlowState {
  activationSelections: string[];
  courseId?: string;
  expansionSelections: string[];
  gameId?: string;
  highPoints: string[];
  lowPoints: string[];
  rootCauseSelections: Record<string, RootCauseId | undefined>;
}

interface AwarenessFlowContextValue extends AwarenessFlowState {
  currentRootCauseDomain?: string;
  currentRootCauseIndex: number;
  orderedDomains: string[];
  resetFlow: () => void;
  setCourseContext: (value: { courseId?: string; gameId?: string }) => void;
  setActivationSelections: (value: string[]) => void;
  setCurrentRootCauseIndex: (value: number) => void;
  setExpansionSelections: (value: string[]) => void;
  setHighPoints: (value: string[]) => void;
  setLowPoints: (value: string[]) => void;
  setRootCauseForDomain: (domain: string, value: RootCauseId) => void;
}

const initialState: AwarenessFlowState = {
  activationSelections: [],
  courseId: undefined,
  expansionSelections: [],
  gameId: undefined,
  highPoints: [],
  lowPoints: [],
  rootCauseSelections: {},
};

const AwarenessFlowContext = createContext<AwarenessFlowContextValue | undefined>(undefined);

export function AwarenessFlowProvider({ children }: PropsWithChildren) {
  const [activationSelections, setActivationSelections] = useState<string[]>(
    initialState.activationSelections,
  );
  const [courseId, setCourseId] = useState<string | undefined>(initialState.courseId);
  const [expansionSelections, setExpansionSelections] = useState<string[]>(
    initialState.expansionSelections,
  );
  const [gameId, setGameId] = useState<string | undefined>(initialState.gameId);
  const [highPoints, setHighPoints] = useState<string[]>(initialState.highPoints);
  const [lowPoints, setLowPoints] = useState<string[]>(initialState.lowPoints);
  const [currentRootCauseIndex, setCurrentRootCauseIndex] = useState(0);
  const [rootCauseSelections, setRootCauseSelections] = useState<
    Record<string, RootCauseId | undefined>
  >(initialState.rootCauseSelections);

  const orderedDomains = useMemo(() => [...highPoints, ...lowPoints], [highPoints, lowPoints]);

  const value = useMemo<AwarenessFlowContextValue>(
    () => ({
      activationSelections,
      courseId,
      currentRootCauseDomain: orderedDomains[currentRootCauseIndex],
      currentRootCauseIndex,
      expansionSelections,
      gameId,
      highPoints,
      lowPoints,
      orderedDomains,
      resetFlow: () => {
        setActivationSelections(initialState.activationSelections);
        setCourseId(initialState.courseId);
        setExpansionSelections(initialState.expansionSelections);
        setGameId(initialState.gameId);
        setHighPoints(initialState.highPoints);
        setLowPoints(initialState.lowPoints);
        setCurrentRootCauseIndex(0);
        setRootCauseSelections(initialState.rootCauseSelections);
      },
      rootCauseSelections,
      setCourseContext: ({ courseId: nextCourseId, gameId: nextGameId }) => {
        setCourseId(nextCourseId);
        setGameId(nextGameId);
      },
      setActivationSelections,
      setCurrentRootCauseIndex,
      setExpansionSelections,
      setHighPoints,
      setLowPoints,
      setRootCauseForDomain: (domain, cause) => {
        setRootCauseSelections((current) => ({
          ...current,
          [domain]: cause,
        }));
      },
    }),
    [
      activationSelections,
      courseId,
      currentRootCauseIndex,
      expansionSelections,
      gameId,
      highPoints,
      lowPoints,
      orderedDomains,
      rootCauseSelections,
    ],
  );

  return <AwarenessFlowContext.Provider value={value}>{children}</AwarenessFlowContext.Provider>;
}

export function useAwarenessFlow() {
  const context = useContext(AwarenessFlowContext);

  if (!context) {
    throw new Error('useAwarenessFlow must be used within AwarenessFlowProvider');
  }

  return context;
}
