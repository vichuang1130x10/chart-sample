import React from "react";
import { Row, Col } from "react-bootstrap";

import DefectTable from "../Component/DefectTable";
import Plato from "../Visualizations/Plato";
import { getSevenDayBoundary } from "../Utils/helperFunction";

const parsingRootCause = (failureName, e, str) => {
  const result = [];
  const rootCause = {};
  const failures = e[str].ErorrDescriptions;

  const f = failures.filter((failure) => failure.description === failureName);
  f.forEach((reason) => {
    result.push(`${reason.reasons[0].item}`);
  });

  console.log(result);

  result.forEach((item) => {
    if (rootCause[item] === null || rootCause[item] === undefined) {
      rootCause[item] = 1;
    } else {
      rootCause[item] += 1;
    }
  });

  let sortable = [];
  for (let defect in rootCause) {
    sortable.push([defect, rootCause[defect]]);
  }

  sortable.sort(function (a, b) {
    return b[1] - a[1];
  });

  const totalDefects = sortable.reduce((acc, elem) => acc + elem[1], 0);
  const rootCauseResult = [];
  let accumulate = 0;
  sortable.forEach((d) => {
    const indiv = parseInt((d[1] / totalDefects) * 100);
    accumulate += d[1];
    rootCauseResult.push({
      defectName: d[0],
      qty: d[1],
      indiv: indiv,
      accu: parseInt((accumulate / totalDefects) * 100),
    });
  });
  return rootCauseResult;
};

const parsingSevenDayRootCause = (failureName, e, str) => {
  const result = [];
  const rootCause = {};
  const failures = e[str].ErorrDescriptions.filter(
    (obj) => new Date(obj.date) > getSevenDayBoundary(new Date())
  );

  const f = failures.filter((failure) => failure.description === failureName);
  f.forEach((reason) => {
    result.push(`${reason.reasons[0].item}`);
  });

  console.log(result);

  result.forEach((item) => {
    if (rootCause[item] === null || rootCause[item] === undefined) {
      rootCause[item] = 1;
    } else {
      rootCause[item] += 1;
    }
  });

  let sortable = [];
  for (let defect in rootCause) {
    sortable.push([defect, rootCause[defect]]);
  }

  sortable.sort(function (a, b) {
    return b[1] - a[1];
  });

  const totalDefects = sortable.reduce((acc, elem) => acc + elem[1], 0);
  const rootCauseResult = [];
  let accumulate = 0;
  sortable.forEach((d) => {
    const indiv = parseInt((d[1] / totalDefects) * 100);
    accumulate += d[1];
    rootCauseResult.push({
      defectName: d[0],
      qty: d[1],
      indiv: indiv,
      accu: parseInt((accumulate / totalDefects) * 100),
    });
  });
  return rootCauseResult;
};

export default function App({
  sortFailure,
  errorAnalysis,
  station,
  sevenDaysFailure,
}) {
  return (
    <>
      <Row>
        <Col>
          <h5 className="subtitle-text">Total :</h5>
          {sortFailure ? (
            <div>
              <h4>Defect Symptom: {sortFailure.defectName}</h4>
              <Plato
                data={parsingRootCause(
                  sortFailure.defectName,
                  errorAnalysis,
                  station
                )}
              />
            </div>
          ) : null}
        </Col>
        <Col>
          <h5 className="subtitle-text">LAST 90 DAYS REPAIR RECORD</h5>
          {sevenDaysFailure ? (
            <div>
              <h4>Defect Symptom: {sevenDaysFailure.defectName}</h4>
              <Plato
                data={parsingSevenDayRootCause(
                  sevenDaysFailure.defectName,
                  errorAnalysis,
                  station
                )}
              />
            </div>
          ) : null}
        </Col>
      </Row>
      <hr />
      <Row>
        <Col>
          {sortFailure ? (
            <div>
              <DefectTable
                sortFailure={this.parsingRootCause(
                  sortFailure.defectName,
                  errorAnalysis,
                  station
                )}
              />
            </div>
          ) : null}
        </Col>
        <Col>
          {sevenDaysFailure ? (
            <div>
              <DefectTable
                sortFailure={this.parsingSevenDayRootCause(
                  sevenDaysFailure.defectName,
                  errorAnalysis,
                  station
                )}
              />
            </div>
          ) : null}
        </Col>
      </Row>
    </>
  );
}
