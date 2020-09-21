type ElectionScope_<T> = {
    type: "national";
} | {
    type: "county";
    countyId: T;
} | {
    type: "locality";
    countyId: T;
    localityId: T;
} | {
    type: "diaspora";
} | {
    type: "diaspora_country";
    countryId: T;
};
type ElectionScope = ElectionScope_<number>;
type ElectionScopeIncomplete = ElectionScope_<number | null>;
type ElectionScopeCompleteness = {
    complete: ElectionScope | null;
    missingCounty: boolean;
    missingLocality: boolean;
    missingCountry: boolean;
};
declare const electionScopeIsComplete: (scope: ElectionScopeIncomplete) => ElectionScopeCompleteness;
type ElectionScopeNames = {
    countyName?: string | null;
    countryName?: string | null;
    localityName?: string | null;
};
type ElectionScopeResolved = ElectionScope & ElectionScopeNames;
type ElectionScopeIncompleteResolved = ElectionScopeIncomplete & ElectionScopeNames;
type ElectionType = "referendum" | "president" | "senate" | "house" | "local_council" | "county_council" | "mayor" | "european_parliament" | string;
declare const electionTypeInvolvesDiaspora: (electionType: ElectionType) => boolean;
declare const electionTypeHasSeats: (electionType: ElectionType) => boolean;
declare const electionHasSeats: (electionType: ElectionType, results: ElectionResults) => boolean;
type ElectionBallotMeta = {
    type: ElectionType;
    date: string;
    title: string;
    ballot?: string | null;
    subtitle?: string | null;
    live?: boolean | null;
    ballotId: number;
    electionId: number;
    newsfeed?: string;
};
type ElectionBallot = {
    scope: ElectionScopeResolved;
    meta: ElectionBallotMeta;
    turnout?: ElectionTurnout | null;
    results?: ElectionResults | null;
    observation?: ElectionObservation | null;
};
type ElectionTurnout = {
    eligibleVoters?: number | null;
    totalVotes: number;
    breakdown?: ElectionTurnoutBreakdown[] | null;
};
type ElectionTurnoutBreakdownCategoryType = "permanent_lists" | "supplementary_lists" | "mobile_ballot_box" | "vote_by_mail";
type ElectionTurnoutBreakdown = {
    type: "national" | "diaspora" | "all";
    total?: number | null;
    categories: {
        type: ElectionTurnoutBreakdownCategoryType;
        votes: number;
    }[];
};
type ElectionObservation = {
    coveredPollingPlaces: number;
    coveredCounties: number;
    observerCount: number;
    messageCount: number;
    issueCount: number;
};
type ElectionResultsCandidate = {
    name: string;
    shortName?: string | null;
    partyColor?: string | null;
    partyLogo?: string | null;
    votes: number;
    seats?: number | null;
    seatsGained?: number | "new" | null;
    candidateCount?: number;
};
type ElectionResults = {
    eligibleVoters?: number | null;
    totalVotes: number;
    votesByMail?: number | null;
    validVotes: number;
    nullVotes: number;
    totalSeats?: number | null;
    candidates: ElectionResultsCandidate[];
};
export { ElectionScope, ElectionScopeIncomplete, ElectionScopeCompleteness, electionScopeIsComplete, ElectionScopeNames, ElectionScopeResolved, ElectionScopeIncompleteResolved, ElectionType, electionTypeInvolvesDiaspora, electionTypeHasSeats, electionHasSeats, ElectionBallotMeta, ElectionBallot, ElectionTurnout, ElectionTurnoutBreakdownCategoryType, ElectionTurnoutBreakdown, ElectionObservation, ElectionResultsCandidate, ElectionResults };
