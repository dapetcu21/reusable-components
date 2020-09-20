import React, { memo, useCallback, useMemo, useState } from "react";
import { ElectionResults } from "../../types/Election";
import { electionCandidateColor, formatGroupedNumber } from "../../util/format";
import { ClassNames, mergeClasses, themable } from "../../util/theme";
import { ColoredSquare } from "../ColoredSquare/ColoredSquare";
import { DivBody, DivLabel } from "../Typography/Typography";
import useDimensions from "react-use-dimensions";
import cssClasses from "./ElectionResultsSeats.module.scss";

type Props = {
  results: ElectionResults;
};

const DecorativeIcon = () => (
  <path
    // eslint-disable-next-line max-len
    d="M3.72141 35.6231C3.67453 35.8779 3.64811 36.1362 3.63959 36.3945V41.6996C3.6464 43.886 5.00424 45.8405 7.05249 46.6085V54.4145C7.06187 57.0279 9.11694 59.1759 11.7269 59.2995V104.396C9.11694 104.52 7.06187 106.668 7.05249 109.281V117.064C4.99997 117.852 3.64299 119.821 3.63959 122.019V127.208C3.63959 128.176 4.42547 128.961 5.39292 128.961H123.61C124.578 128.961 125.363 128.176 125.363 127.208V122.019C125.359 119.821 124.003 117.852 121.951 117.064V109.235C121.941 106.622 119.886 104.474 117.276 104.35V59.2995C119.886 59.1759 121.941 57.0279 121.951 54.4145V46.6085C123.998 45.8405 125.356 43.886 125.363 41.6996V36.4294C125.355 36.1711 125.328 35.9129 125.281 35.658C126.162 36.0484 127.193 35.6512 127.583 34.7698C127.974 33.8893 127.577 32.8588 126.696 32.4676L65.308 0.202652C64.7957 -0.0675507 64.1837 -0.0675507 63.6715 0.202652L2.28431 32.4326C1.42767 32.8852 1.09951 33.9447 1.55042 34.8014C1.96296 35.5839 2.89376 35.9367 3.72141 35.6231ZM10.5583 49.6463V46.9469H30.7749V49.6233L10.5583 49.6463ZM55.5731 59.3114V104.396C52.9631 104.52 50.908 106.668 50.8986 109.281V116.737H34.2569V109.281C34.2475 106.668 32.1924 104.52 29.5825 104.396V59.2995C32.1924 59.1759 34.2475 57.0279 34.2569 54.4145V46.9469H50.8748V54.4034C50.879 57.0211 52.9358 59.1742 55.55 59.2995L55.5731 59.3114ZM54.4044 49.6463V46.9469H74.6219V49.6233L54.4044 49.6463ZM99.42 59.3114V104.396C96.8101 104.52 94.7541 106.668 94.7448 109.281V116.737H78.1039V109.281C78.0945 106.668 76.0386 104.52 73.4294 104.396V59.2995C76.0386 59.1759 78.0945 57.0279 78.1039 54.4145V46.9469H94.7218V54.4034C94.7252 57.0211 96.7819 59.1742 99.3962 59.2995L99.42 59.3114ZM98.2514 49.6463V46.9469H118.468V49.6233L98.2514 49.6463ZM118.468 114.061V116.737H98.2276V114.061H118.468ZM74.6219 114.061V116.737H54.3814V114.061H74.6219ZM57.3025 55.8286H55.7836C55.0088 55.8286 54.3814 55.2013 54.3814 54.4264V53.1521H74.598V54.4264C74.598 55.2013 73.9707 55.8286 73.1959 55.8286H57.3025ZM69.9356 59.3344V104.373H59.0559V59.3344H69.9356ZM57.3025 107.879H73.1959C73.9707 107.879 74.598 108.506 74.598 109.281V110.555H54.3814V109.281C54.3814 108.506 55.0088 107.879 55.7836 107.879H57.3025ZM30.7519 114.061V116.737H10.5344V114.061H30.7519ZM10.5344 54.4614V53.1521H30.7519V54.4264C30.7519 55.2013 30.1246 55.8286 29.3489 55.8286H11.9017C11.1362 55.8098 10.5276 55.1799 10.5344 54.4145V54.4614ZM26.0775 59.3694V104.373H15.2089V59.3344L26.0775 59.3694ZM10.5344 109.317C10.5344 108.541 11.1618 107.914 11.9366 107.914H29.3489C30.1246 107.914 30.7519 108.541 30.7519 109.317V110.59H10.5344V109.317ZM121.857 122.09V125.525H7.12239V122.09C7.12239 121.089 7.933 120.277 8.93368 120.277H120.046C121.032 120.277 121.838 121.068 121.857 122.054V122.09ZM118.445 109.317V110.59H98.2276V109.317C98.2276 108.541 98.8549 107.914 99.6297 107.914H117.078C117.825 107.933 118.426 108.533 118.445 109.281V109.317ZM102.902 104.408V59.3344H113.782V104.373L102.902 104.408ZM118.445 54.4614C118.445 55.2362 117.818 55.8635 117.043 55.8635H99.6417C98.8669 55.8635 98.2395 55.2362 98.2395 54.4614V53.1521H118.456L118.445 54.4614ZM64.4897 3.70847L116.692 31.1473H12.2878L64.4897 3.70847ZM7.12239 36.4294C7.12239 35.462 7.90742 34.6769 8.87487 34.6769H120.105C121.072 34.6769 121.857 35.462 121.857 36.4294V41.7354C121.857 42.7029 121.072 43.4879 120.105 43.4879H8.87487C7.90742 43.4879 7.12239 42.7029 7.12239 41.7354V36.4294Z"
    fill="#EEEEEE"
    fillOpacity={0.43}
  />
);

type Dot = {
  alpha: number;
  R: number;
  candidate: number | null;
};

const SeatsGraphic: React.FC<{
  classes: ClassNames;
  results: ElectionResults;
  width: number;
  height: number;
  selectedCandidate: number | null;
  onSelectCandidate: (value: number | null) => unknown;
}> = memo(function SeatsGraphicUnmemoized({ classes, results, width, height, selectedCandidate, onSelectCandidate }) {
  const totalSeats = results.totalSeats || 1;
  // Scale the dot size with the total number of dots so that
  // the total area of the graph remains the same.
  const r = useMemo(() => 45.345892868 / Math.sqrt(totalSeats), [totalSeats]);

  const [dots, innerRadius] = useMemo(() => {
    const spacing = 2.3;
    const dotsArray: Dot[] = [];

    // Determine how many dots fit in each row
    let R = 100 - r;
    let seatsLeft = totalSeats;
    const rows = [];
    while (seatsLeft > 0) {
      // Offset the first and last dot by a tiny angle so that they're tangent to the bottom of the viewport
      const offset = Math.asin(r / R);
      const seatsOnRow = 1 + Math.max(0, Math.floor(((Math.PI - offset * 2) * R) / (r * spacing)));
      seatsLeft -= seatsOnRow;
      rows.push({ R, offset, seatsOnRow });
      R -= r * spacing;
    }

    // We might have some empty slots left over that we need to
    // remove evenly from amongst the rows.
    if (seatsLeft < 0) {
      const div = Math.floor(-seatsLeft / rows.length);
      for (let i = 0; i < rows.length; i += 1) {
        rows[i].seatsOnRow -= div;
      }
      seatsLeft += div * rows.length;
    }

    // If they don't split evenly, remove the rest starting with the innermost row.
    if (seatsLeft < 0) {
      for (let i = rows.length - 1; i >= 0 && seatsLeft < 0; i -= 1) {
        rows[i].seatsOnRow -= 1;
        seatsLeft += 1;
      }
    }

    // Position each dot in polar coordinates
    for (let i = 0; i < rows.length; i++) {
      const { seatsOnRow, offset, R: rowR } = rows[i];
      const stride = (Math.PI - offset * 2) / (seatsOnRow - 1);
      for (let j = 0; j < seatsOnRow; j++) {
        dotsArray.push({ alpha: offset + j * stride, R: rowR, candidate: null });
      }
    }

    // Sort the dots radially left to right
    dotsArray.sort((a, b) => a.alpha - b.alpha);

    // Assign candidates to each dot
    let start = 0;
    let end = dotsArray.length - 1;
    let fromStart = false; // Alternate each candidate left/right
    results.candidates.forEach((candidate, index) => {
      let { seats } = candidate;
      if (Number.isFinite(seats) && seats != null && seats > 0) {
        fromStart = !fromStart;
        for (; seats > 0 && start <= end; seats -= 1) {
          dotsArray[fromStart ? start : end].candidate = index;
          if (fromStart) {
            start += 1;
          } else {
            end -= 1;
          }
        }
      }
    });

    return [dotsArray, rows[rows.length - 1]?.R - r];
  }, [totalSeats, results]);

  const onDeselect = useCallback(() => {
    onSelectCandidate(null);
  }, [onSelectCandidate]);

  return (
    <svg className={classes.svg} viewBox="-2 -1 204 102" width={width} height={height} onMouseLeave={onDeselect}>
      <path
        d={`
          M -5 100
          A 105 105 0 0 1 205 100
          L ${100 + innerRadius - 5} 100
          A ${innerRadius - 5} ${innerRadius - 5} 0 0 0 ${100 - innerRadius + 5} 100
          L -5 100
        `}
        fill="transparent"
        stroke="transparent"
        onMouseLeave={onDeselect}
      />
      {dots.map((dot, index) => (
        <circle
          key={index}
          r={r}
          cx={100 - dot.R * Math.cos(dot.alpha)}
          cy={100 - dot.R * Math.sin(dot.alpha)}
          fill={dot.candidate != null ? electionCandidateColor(results.candidates[dot.candidate]) : "#ccc"}
          strokeWidth={selectedCandidate !== null && selectedCandidate === dot.candidate ? 1 : 0}
          stroke="#000"
          onMouseOver={() => {
            onSelectCandidate(dot.candidate);
          }}
        />
      ))}
      <g transform="translate(100 78.75) scale(0.33 0.33) translate(-64.5 -64.5)">
        <DecorativeIcon />
      </g>
      <text x={100} y={85} dominantBaseline="middle" className={classes.seatCount}>
        {formatGroupedNumber(totalSeats)}
      </text>
    </svg>
  );
});

const defaultConstants = {
  breakpoint: 560,
  height: 200,
};

export const ElectionResultsSeats = themable<Props>(
  "ElectionResultsSeats",
  cssClasses,
  defaultConstants,
)(({ classes, constants, results }) => {
  const [measureRef, { width = NaN }] = useDimensions();
  let svgHeight = constants.height;
  let svgWidth = constants.height * 2;
  if (svgWidth > width) {
    svgWidth = width;
    svgHeight = svgWidth * 0.5;
  }

  const vertical = width < constants.breakpoint;

  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);

  return (
    <div className={mergeClasses(classes.root, vertical && classes.vertical)} ref={measureRef}>
      <div className={classes.legend}>
        {results.candidates.map((candidate, index) =>
          Number.isFinite(candidate.seats) && candidate.seats != null && candidate.seats > 0 ? (
            <DivBody className={classes.legendItem} key={index}>
              <ColoredSquare className={classes.square} color={electionCandidateColor(candidate)} />
              <div
                className={mergeClasses(
                  classes.legendLabel,
                  index === selectedCandidate && classes.legendLabelSelected,
                )}
              >
                {candidate.shortName ?? candidate.name}
              </div>
              <DivLabel className={classes.legendValue}>&nbsp;({formatGroupedNumber(candidate.seats)})</DivLabel>
            </DivBody>
          ) : null,
        )}
      </div>
      <div className={classes.svgContainer}>
        <SeatsGraphic
          classes={classes}
          results={results}
          width={svgWidth}
          height={svgHeight}
          selectedCandidate={selectedCandidate}
          onSelectCandidate={setSelectedCandidate}
        />
      </div>
    </div>
  );
});
