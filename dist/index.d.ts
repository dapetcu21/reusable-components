import React from "react";
import { ComponentType, ReactNode } from "react";
type ClassNames = {
    [key: string]: string;
};
declare function mergeClasses(a: string | null | undefined | false, b: string | null | undefined | false): string | undefined;
declare function overrideClasses(classes: ClassNames, overrides?: ClassNames | void): ClassNames;
interface Theme extends ThemeConstants {
    colors: {
        primary: string;
        primary75: string;
        primary50: string;
        primary25: string;
        secondary: string;
    };
    componentClasses: {
        [componentName: string]: ClassNames;
    };
    componentValues: {
        [componentName: string]: ThemeConstants;
    };
}
declare function useTheme(): Theme;
declare const ThemeProvider: React.Provider<Theme>;
declare function mergeThemeClasses(theme: Theme, componentName: string, componentClasses?: ClassNames | void, propsClasses?: ClassNames | void, propsClassName?: string | void): ClassNames;
declare function mergeThemeConstants(theme: Theme, componentName: string, componentValues?: ThemeConstants | void, propsValues?: ThemeConstants | void): ThemeConstants;
// eslint-disable-next-line @typescript-eslint/ban-types
type PropsObject = object;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ThemeConstants = {
    [key: string]: any;
};
type ThemableComponentProps<P extends PropsObject> = P & {
    className?: string;
    classes?: ClassNames;
    constants?: ThemeConstants;
};
type ThemableComponent<P extends PropsObject> = React.ComponentType<ThemableComponentProps<P>>;
type ThemedComponentProps<P extends PropsObject> = P & {
    classes: ClassNames;
    constants: ThemeConstants;
};
type ThemedComponent<P extends PropsObject> = React.ComponentType<ThemedComponentProps<P>>;
type ThemableHOC<P extends PropsObject> = (Component: ThemedComponent<P>) => ThemableComponent<P>;
// This function has this arity so that it can also be used as a decorator,
// whenever those might become mainstream
declare const themable: <P extends object>(componentName: string, componentClasses?: ClassNames | undefined, componentValues?: ThemeConstants | undefined) => ThemableHOC<P>;
type APIInvocation<ResponseType> = (abortSignal?: AbortSignal) => Promise<ResponseType>;
type APIRequestState<ResponseType> = {
    data: ResponseType | null;
    hasData: boolean;
    loading: boolean;
    error: Error | null;
};
type UseAPIResponseOptions<ResponseType> = {
    invocation?: APIInvocation<ResponseType> | null;
    discardPreviousData?: boolean; // Defaults to false
    discardDataOnError?: boolean; // Defaults to false
    abortPreviousRequest?: boolean; // Defaults to true
};
declare function useApiResponse<ResponseType>(makeInvocation: () => APIInvocation<ResponseType> | UseAPIResponseOptions<ResponseType> | undefined | void | null, dependencies: unknown[]): APIRequestState<ResponseType>;
/* eslint-disable @typescript-eslint/no-explicit-any */
type JSONFetchOptions<BodyType = unknown, QueryParamsType extends Record<string, any> = any> = {
    body?: BodyType;
    query?: QueryParamsType;
    headers?: Record<string, string>;
    fetchOptions?: RequestInit;
};
type JSONFetch = <ResponseType = unknown, BodyType extends Record<string, any> = any, QueryParamsType = unknown>(method: string, endpoint: string, options?: JSONFetchOptions<BodyType, QueryParamsType>) => APIInvocation<ResponseType>;
declare function makeJsonFetch(urlPrefix?: string, defaultHeaders?: Record<string, string>, handleHttpError?: (res: Response) => Promise<any> | never, handleData?: (data: any) => any): JSONFetch;
declare const jsonFetch: JSONFetch;
type APIMockHandler<ResponseType = unknown, BodyType = unknown, QueryParamsType extends Record<string, any> = any> = (request: {
    endpoint: string;
    match: RegExpMatchArray | null;
    body: BodyType;
    query: QueryParamsType;
}) => ResponseType | Promise<ResponseType>;
type APIMockEntry<ResponseType = unknown, BodyType = unknown, QueryParamsType extends Record<string, any> = any> = [
    string,
    RegExp | string,
    APIMockHandler<ResponseType, BodyType, QueryParamsType>
];
declare function mockFetch(entries: APIMockEntry<any, any, any>[]): JSONFetch;
declare const transformApiInvocation: <TFrom, TTo>(invocation: APIInvocation<TFrom>, transform: (data: TFrom) => TTo) => APIInvocation<TTo>;
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
    // The app should work with any specified "type" in here, including values unknown yet to the frontend
    // This is just for extra visual customisation like splitting local council results in two tables,
    // showing the parliament seats widget or showing disapora next to the map or not
    type: ElectionType;
    date: string; // ISO 8601
    title: string; // eg. "Alegeri locale"
    ballot?: string | null; // eg. "Primar", maybe find a better name for this?
    subtitle?: string | null; // eg. "Pentru trecerea la parlament unicameral și reducerea numărului de parlamentari"
    live?: boolean | null; // Send true when the election is ongoing
    ballotId: number; // The ID of this Election (Ballot in the backend, a rename might be in order)
    electionId: number; // Used for grouping
    // TODO: I haven't the slightest idea what should go in here, but I assume some sort
    // of an URL/category ID for the blog API
    newsfeed?: string;
};
// You get one of these after making a request with an ID and the data in an ElectionScope
// (url-encoded in the GET request or whatever)
type ElectionBallot = {
    scope: ElectionScopeResolved;
    meta: ElectionBallotMeta;
    // These can be missing if the election doesn't support the current scope (eg. local elections with a national scope).
    turnout?: ElectionTurnout | null;
    results?: ElectionResults | null;
    // Send this only when it makes sense (for the national scope)
    observation?: ElectionObservation | null;
};
type ElectionTurnout = {
    eligibleVoters?: number | null; // Cetățeni cu drept de vot. Nu se aplică pentru diaspora
    totalVotes: number;
    breakdown?: ElectionTurnoutBreakdown[] | null;
};
// Open to extensions
type ElectionTurnoutBreakdownCategoryType = "permanent_lists" | "supplementary_lists" | "mobile_ballot_box" | "vote_by_mail";
type ElectionTurnoutBreakdown = {
    type: "national" | "diaspora" | "all"; // Open to extensions. "all" means this chart applies to the whole scope
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
    // These still refer to parties in the context of local_council and county_council
    name: string; // eg. "Uniunea Salvați România",
    shortName?: string | null; // eg. "USR"
    partyColor?: string | null;
    partyLogo?: string | null; // A URL to a party logo image (square, with transparency, preferably SVG)
    votes: number;
    seats?: number | null;
    seatsGained?: number | "new" | null;
    candidateCount?: number;
};
type ElectionResults = {
    eligibleVoters?: number | null; // Duplicate this from ElectionTurnout
    totalVotes: number; // Duplicate this from ElectionTurnout
    votesByMail?: number | null; // For diaspora
    validVotes: number;
    nullVotes: number;
    totalSeats?: number | null; // For the parliament (maybe even council) seats widget
    candidates: ElectionResultsCandidate[]; // Sorted descending by votes
};
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
// TODO
declare const electionApiProductionUrl = "https://api.rezultatevot.ro/api";
declare const electionMapOverlayUrl = "//localhost:5000";
declare function makeTypographyComponent<Props extends PropsObject>(Component: ComponentType<Props> | string, className: string, extraClassName?: string): ThemableComponent<Props>;
declare const Body: React.ComponentType<ThemableComponentProps<React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>>>;
declare const BodyMedium: React.ComponentType<ThemableComponentProps<React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>>>;
declare const BodyLarge: React.ComponentType<ThemableComponentProps<React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>>>;
declare const BodyHuge: React.ComponentType<ThemableComponentProps<React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>>>;
declare const Label: React.ComponentType<ThemableComponentProps<React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>>>;
declare const LabelMedium: React.ComponentType<ThemableComponentProps<React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>>>;
declare const Heading1: React.ComponentType<ThemableComponentProps<React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>>>;
declare const Heading2: React.ComponentType<ThemableComponentProps<React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>>>;
declare const Heading3: React.ComponentType<ThemableComponentProps<React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>>>;
declare const DivBody: React.ComponentType<ThemableComponentProps<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>>>;
declare const DivBodyMedium: React.ComponentType<ThemableComponentProps<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>>>;
declare const DivBodyLarge: React.ComponentType<ThemableComponentProps<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>>>;
declare const DivBodyHuge: React.ComponentType<ThemableComponentProps<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>>>;
declare const DivLabel: React.ComponentType<ThemableComponentProps<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>>>;
declare const DivLabelMedium: React.ComponentType<ThemableComponentProps<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>>>;
declare const DivHeading1: React.ComponentType<ThemableComponentProps<React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>>>;
declare const DivHeading2: React.ComponentType<ThemableComponentProps<React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>>>;
declare const DivHeading3: React.ComponentType<ThemableComponentProps<React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>>>;
declare const Underlined: React.ComponentType<ThemableComponentProps<React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>>>;
declare const Button: React.ComponentType<ThemableComponentProps<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>>>;
type Props = {
    color?: string;
};
declare const ColoredSquare: React.ComponentType<ThemableComponentProps<Props>>;
type Props$0 = {
    name: string;
    color: string;
    percentage: number;
    rightAligned?: boolean;
    iconUrl?: string;
};
declare const PartyResultCard: React.ComponentType<ThemableComponentProps<Props$0>>;
type Props$1 = {
    name: string;
    color: string;
    percentage?: number;
    votes?: number;
};
declare const PartyResultInline: React.ComponentType<ThemableComponentProps<Props$1>>;
type HorizontalStackedBarItem = {
    value: number;
    color: string;
    className?: string;
};
type Props$2 = {
    total?: number; // Defaults to the max value in items
    items: HorizontalStackedBarItem[];
    labelLeft?: ReactNode;
    labelRight?: ReactNode;
};
declare const HorizontalStackedBar: React.ComponentType<ThemableComponentProps<Props$2>>;
type Props$3 = {
    total?: number; // Defaults to the max value in items
    items: {
        value: number;
        valueLabel?: ReactNode;
        color?: string;
        labelColor?: string;
        className?: string;
    }[];
};
declare const PercentageBars: React.ComponentType<ThemableComponentProps<Props$3>>;
type Props$4 = {
    items: {
        legendName: ReactNode;
        legendValueLabel?: ReactNode;
        legendNote?: ReactNode;
        legendColor?: string;
        legendClassName?: string;
        valueLabel?: ReactNode;
        color?: string;
    }[];
};
declare const PercentageBarsLegend: React.ComponentType<ThemableComponentProps<Props$4>>;
type Props$5 = {
    width: number;
    height: number;
    yGridSteps: number;
    yMax: number;
    fontSize: number;
    maxBarWidth: number;
    maxBarSpacing: number;
    minBarWidth: number;
    minBarSpacing: number;
    leftBarMargin: number;
    rightBarMargin: number;
    bars: {
        color: string;
        value: number;
    }[];
    renderLabel: (y: number) => ReactNode;
};
declare const BarChart: React.ComponentType<Partial<ThemableComponentProps<Props$5>>>; // To make defaultProps work
declare const ElectionMap: React.ComponentType<ThemableComponentProps<React.PropsWithChildren<{
    scope: ElectionScopeIncomplete;
    onScopeChange?: ((scope: ElectionScopeIncomplete) => unknown) | undefined;
    involvesDiaspora?: boolean | undefined;
    aspectRatio?: number | undefined;
    maxHeight?: number | undefined;
}>>>;
type OnFeatureSelect = (featureId: number) => unknown;
type Props$6 = {
    className?: string;
    width: number;
    height: number;
    overlayUrl?: string;
    selectedFeature?: number | null | undefined;
    onFeatureSelect?: OnFeatureSelect;
    initialBounds?: {
        top: number; // Latitude
        left: number; // Longitude
        bottom: number; // Latitude
        right: number; // Longitude
    };
    centerOnOverlayBounds?: boolean; // Default true
};
declare const worldMapBounds: {
    top: number;
    left: number;
    bottom: number;
    right: number;
};
declare const romaniaMapBounds: {
    top: number;
    bottom: number;
    left: number;
    right: number;
};
declare const HereMapsAPIKeyContext: React.Context<string>;
declare const HereMapsAPIKeyProvider: React.Provider<string>;
declare const HereMap: React.ComponentType<ThemableComponentProps<Props$6>>;
declare const ResultsTable: React.ComponentType<ThemableComponentProps<React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>>>;
type Props$7 = {
    meta: ElectionBallotMeta;
    scope: ElectionScopeIncompleteResolved;
    turnout?: ElectionTurnout | null;
};
declare const ElectionTurnoutSection: React.ComponentType<ThemableComponentProps<Props$7>>;
type Props$8 = {
    observation: ElectionObservation;
};
declare const ElectionObservationSection: React.ComponentType<ThemableComponentProps<Props$8>>;
type Props$9 = {
    meta: ElectionBallotMeta;
    scope: ElectionScopeIncompleteResolved;
    results?: ElectionResults | null;
    separator?: ReactNode;
};
declare const ElectionResultsSummarySection: React.ComponentType<ThemableComponentProps<Props$9>>;
type Props$10 = {
    meta: ElectionBallotMeta;
    results: ElectionResults;
};
declare const ElectionResultsSummaryTable: React.ComponentType<ThemableComponentProps<Props$10>>;
type Props$11 = {
    results: ElectionResults;
};
declare const ElectionResultsSeats: React.ComponentType<ThemableComponentProps<Props$11>>;
type Props$12 = {
    meta: ElectionBallotMeta;
    results: ElectionResults;
};
declare const ElectionResultsTableSection: React.ComponentType<ThemableComponentProps<Props$12>>;
type Props$13 = {
    results: ElectionResults;
};
declare const ElectionResultsProcess: React.ComponentType<ThemableComponentProps<Props$13>>;
type Props$14 = {
    results: ElectionResults;
};
declare const ElectionResultsStackedBar: React.ComponentType<ThemableComponentProps<Props$14>>;
type Props$15 = {
    items: ElectionBallotMeta[];
    selectedBallotId?: number | null;
    onSelectBallot?: (meta: ElectionBallotMeta) => unknown;
};
declare const ElectionTimeline: React.ComponentType<ThemableComponentProps<Props$15>>;
type Props$16 = {
    apiData: ElectionScopePickerAPIData;
    value: ElectionScopeIncomplete;
    onChange: (scope: ElectionScopeIncomplete) => unknown;
};
declare const electionScopePickerUpdateType: (scope: ElectionScopeIncomplete, type: ElectionScope["type"]) => ElectionScopeIncomplete;
type ElectionScopePickerAPIData = {
    countyData: APIRequestState<OptionWithID[]>;
    localityData: APIRequestState<OptionWithID[]>;
    countryData: APIRequestState<OptionWithID[]>;
};
declare const useElectionScopePickerApi: (api: ElectionScopeAPI, scope: ElectionScopeIncomplete) => ElectionScopePickerAPIData;
type ElectionScopePickerSelectOnChange<K = number> = (value: OptionWithID<K> | ReadonlyArray<OptionWithID<K>> | null | undefined) => void;
type ElectionScopePickerSelectProps<K = number> = {
    label: string;
    selectProps: {
        value: OptionWithID<K> | null;
        onChange: ElectionScopePickerSelectOnChange<K>;
        options: OptionWithID<K>[];
        isLoading: boolean;
        isDisabled: boolean;
        placeholder?: string;
    };
};
declare const useElectionScopePickerGetSelectProps: (apiData: ElectionScopePickerAPIData, scope: ElectionScopeIncomplete, onChangeScope: (newScope: ElectionScopeIncomplete) => unknown) => ElectionScopePickerSelectProps[];
declare const useElectionScopePickerGetTypeSelectProps: (scope: ElectionScopeIncomplete, onChangeScope: (newScope: ElectionScopeIncomplete) => unknown) => ElectionScopePickerSelectProps<ElectionScope["type"]>;
declare const ElectionScopePicker: React.ComponentType<ThemableComponentProps<Props$16>>;
export { ClassNames, mergeClasses, overrideClasses, Theme, useTheme, ThemeProvider, mergeThemeClasses, mergeThemeConstants, PropsObject, ThemeConstants, ThemableComponentProps, ThemableComponent, ThemedComponentProps, ThemedComponent, ThemableHOC, themable, APIInvocation, APIRequestState, UseAPIResponseOptions, useApiResponse, JSONFetchOptions, JSONFetch, makeJsonFetch, jsonFetch, APIMockHandler, APIMockEntry, mockFetch, transformApiInvocation, OptionWithID, ElectionScopeAPI, ElectionAPI, makeElectionApi, electionApiProductionUrl, electionMapOverlayUrl, ElectionScope, ElectionScopeIncomplete, ElectionScopeCompleteness, electionScopeIsComplete, ElectionScopeNames, ElectionScopeResolved, ElectionScopeIncompleteResolved, ElectionType, electionTypeInvolvesDiaspora, electionTypeHasSeats, electionHasSeats, ElectionBallotMeta, ElectionBallot, ElectionTurnout, ElectionTurnoutBreakdownCategoryType, ElectionTurnoutBreakdown, ElectionObservation, ElectionResultsCandidate, ElectionResults, makeTypographyComponent, Body, BodyMedium, BodyLarge, BodyHuge, Label, LabelMedium, Heading1, Heading2, Heading3, DivBody, DivBodyMedium, DivBodyLarge, DivBodyHuge, DivLabel, DivLabelMedium, DivHeading1, DivHeading2, DivHeading3, Underlined, Button, ColoredSquare, PartyResultCard, PartyResultInline, HorizontalStackedBarItem, HorizontalStackedBar, PercentageBars, PercentageBarsLegend, BarChart, ElectionMap, worldMapBounds, romaniaMapBounds, HereMapsAPIKeyContext, HereMapsAPIKeyProvider, HereMap, ResultsTable, ElectionTurnoutSection, ElectionObservationSection, ElectionResultsSummarySection, ElectionResultsSummaryTable, ElectionResultsSeats, ElectionResultsTableSection, ElectionResultsProcess, ElectionResultsStackedBar, ElectionTimeline, electionScopePickerUpdateType, ElectionScopePickerAPIData, useElectionScopePickerApi, ElectionScopePickerSelectOnChange, ElectionScopePickerSelectProps, useElectionScopePickerGetSelectProps, useElectionScopePickerGetTypeSelectProps, ElectionScopePicker };
