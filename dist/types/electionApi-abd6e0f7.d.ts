import { ElectionBallot, ElectionBallotMeta, ElectionScope } from "./Election-e0b23863";
import { APIInvocation, JSONFetch } from "./api-88d257fe";
type OptionWithID<K = number, N = string> = {
    id: K;
    name: N;
};
interface ElectionScopeAPI {
    getCounties: () => APIInvocation<OptionWithID[]>;
    getLocalities: (countyId: number) => APIInvocation<OptionWithID[]>;
    getCountries: () => APIInvocation<OptionWithID[]>;
}
interface ElectionAPI extends ElectionScopeAPI {
    getBallot: (id: number, scope: ElectionScope) => APIInvocation<ElectionBallot>;
    getBallots: () => APIInvocation<ElectionBallotMeta[]>;
}
declare const makeElectionApi: (options?: {
    apiUrl?: string | undefined;
    fetch?: JSONFetch | undefined;
} | undefined) => ElectionAPI;
export { OptionWithID, ElectionScopeAPI, ElectionAPI, makeElectionApi };
