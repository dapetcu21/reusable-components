import { ElectionBallotMeta, ElectionObservation, ElectionResults, ElectionScopeResolved, ElectionTurnout } from "./Election-e0b23863";
declare const mockNationalElectionScope: ElectionScopeResolved;
declare const mockCountyElectionScope: ElectionScopeResolved;
declare const mockLocalityElectionScope: ElectionScopeResolved;
declare const mockDiasporaElectionScope: ElectionScopeResolved;
declare const mockDiasporaCountryElectionScope: ElectionScopeResolved;
declare const mockPresidentialElectionMeta: ElectionBallotMeta;
declare const mockLocalCouncilElectionMeta: ElectionBallotMeta;
declare const mockPresidentialElectionTurnout: ElectionTurnout;
declare const mockObservation: ElectionObservation;
declare const mockResults: ElectionResults;
declare const mockElectionList: ({
    date: string;
    title: string;
    type: string;
    electionId: number;
    ballotId: number;
    live: boolean;
    ballot?: undefined;
    round?: undefined;
    subtitle?: undefined;
} | {
    date: string;
    title: string;
    type: string;
    ballot: string;
    electionId: number;
    ballotId: number;
    live?: undefined;
    round?: undefined;
    subtitle?: undefined;
} | {
    date: string;
    title: string;
    type: string;
    ballot: string;
    electionId: number;
    ballotId: number;
    round: number;
    live?: undefined;
    subtitle?: undefined;
} | {
    date: string;
    title: string;
    subtitle: string;
    type: string;
    ballot: string;
    electionId: number;
    ballotId: number;
    live?: undefined;
    round?: undefined;
})[];
declare const mockElectionAPI: import("./electionApi-3ea2143e").ElectionAPI;
export { mockNationalElectionScope, mockCountyElectionScope, mockLocalityElectionScope, mockDiasporaElectionScope, mockDiasporaCountryElectionScope, mockPresidentialElectionMeta, mockLocalCouncilElectionMeta, mockPresidentialElectionTurnout, mockObservation, mockResults, mockElectionList, mockElectionAPI };
