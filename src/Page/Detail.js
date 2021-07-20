import React, { Component } from "react";
import HeaderWithTable from "../Component/HeaderWithTable";
import { Container, Row, Col, Card, Table } from "react-bootstrap";
import styled from "styled-components";
import BarChart from "../Visualizations/BarChart";
import DefectTable from "../Component/DefectTable";
import { getSevenDayBoundary } from "../Utils/helperFunction";
import Plato from "../Visualizations/Plato";
import Button from "../Component/Button";
import { navigate } from "@reach/router";

const DisplayRow1 = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

class Detail extends Component {
  state = {
    tableData: {},
    startDate: "",
    endDate: "",
    modelName: "",
    modelDetail: {},
    station: "AOI2",
    trendData: [],
    errorAnalysis: [],
    batchs: [],
    sortFailure: [],
    topThree: [],
    sevenDaysFailure: [],
    recentYield: {},
  };

  componentDidMount() {
    const {
      startDate,
      endDate,
      modelName,
      modelDetail,
      errorAnalysis,
      batchs,
      recentYield,
    } = this.props.location.state;

    this.setState({
      tableData: this.props.location.state,
      startDate,
      endDate,
      modelName,
      modelDetail,
      trendData: modelDetail[this.state.station].mo,
      errorAnalysis,
      batchs,
      recentYield,
      sortFailure: this.parsingToQty(errorAnalysis, this.state.station),
      sevenDaysFailure: this.parsingToSevenDayQty(
        errorAnalysis,
        this.state.station
      ),
    });
  }

  udpateStation = (str) => {
    this.setState({
      station: str,
      trendData: this.state.modelDetail[str].mo,
      sortFailure: this.parsingToQty(this.state.errorAnalysis, str),
      sevenDaysFailure: this.parsingToSevenDayQty(
        this.state.errorAnalysis,
        str
      ),
    });
  };

  parsingToSevenDayQty = (e, str) => {
    if (e === undefined || e === null) {
      return [];
    }
    const allDefects = {};

    const inTheSevenDaysData = e[str].ErorrDescriptions.filter(
      (obj) => new Date(obj.date) > getSevenDayBoundary(new Date())
    );

    inTheSevenDaysData.forEach((defect) => {
      if (
        allDefects[defect.description] === null ||
        allDefects[defect.description] === undefined
      ) {
        allDefects[defect.description] = 1;
      } else {
        allDefects[defect.description] += 1;
      }
    });

    let sortable = [];
    for (let defect in allDefects) {
      sortable.push([defect, allDefects[defect]]);
    }

    sortable.sort(function (a, b) {
      return b[1] - a[1];
    });
    const totalDefects = sortable.reduce((acc, elem) => acc + elem[1], 0);
    const result = [];
    let accumulate = 0;
    sortable.forEach((d) => {
      const indiv = parseInt((d[1] / totalDefects) * 100);
      accumulate += d[1];
      result.push({
        defectName: d[0],
        qty: d[1],
        indiv: indiv,
        accu: parseInt((accumulate / totalDefects) * 100),
      });
    });

    return result;
  };

  parsingToQty = (e, str) => {
    if (e === undefined || e === null) {
      return [];
    }
    const allDefects = {};
    e[str].ErorrDescriptions.forEach((defect) => {
      if (
        allDefects[defect.description] === null ||
        allDefects[defect.description] === undefined
      ) {
        allDefects[defect.description] = 1;
      } else {
        allDefects[defect.description] += 1;
      }
    });

    let sortable = [];
    for (let defect in allDefects) {
      sortable.push([defect, allDefects[defect]]);
    }

    sortable.sort(function (a, b) {
      return b[1] - a[1];
    });
    const totalDefects = sortable.reduce((acc, elem) => acc + elem[1], 0);
    const result = [];
    let accumulate = 0;
    sortable.forEach((d) => {
      const indiv = parseInt((d[1] / totalDefects) * 100);
      accumulate += d[1];
      result.push({
        defectName: d[0],
        qty: d[1],
        indiv: indiv,
        accu: parseInt((accumulate / totalDefects) * 100),
      });
    });

    return result;
  };

  parsingRootCause = (failureName, e, str) => {
    const result = [];
    const rootCause = {};
    const failures = e[str].ErorrDescriptions;

    const f = failures.filter((failure) => failure.description === failureName);
    f.forEach((reason) => {
      result.push(`${reason.reasons[0].item}`);
    });

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

  parsingSevenDayRootCause = (failureName, e, str) => {
    const result = [];
    const rootCause = {};
    const failures = e[str].ErorrDescriptions.filter(
      (obj) => new Date(obj.date) > getSevenDayBoundary(new Date())
    );

    const f = failures.filter((failure) => failure.description === failureName);
    f.forEach((reason) => {
      result.push(`${reason.reasons[0].item}`);
    });

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

  gotoDefectMapping = () => {
    const { errorAnalysis, batchs } = this.state;
    navigate(`/generat-mapping`, {
      state: { errorAnalysis, batchs },
    });
  };

  render() {
    const {
      tableData,
      startDate,
      station,
      trendData,
      errorAnalysis,
      sortFailure,
      sevenDaysFailure,
      recentYield,
    } = this.state;

    return startDate.length ? (
      <>
        <HeaderWithTable data={tableData} />
        <Container>
          <h4 className="center-text">LAST 20 WORKING-ORDER TREND</h4>
          <Row>
            <DisplayRow1>
              <div>
                <label htmlFor="station">
                  Trend Chart:
                  <select
                    id="station"
                    value={station}
                    onChange={(e) => this.udpateStation(e.target.value)}
                    onBlur={(e) => this.udpateStation(e.target.value)}
                  >
                    {["AOI2", "AOI4", "X-Ray", "ICT"].map((station) => (
                      <option value={station} key={station}>
                        {station}
                      </option>
                    ))}
                  </select>
                </label>
                <BarChart data={trendData} station={station} />
              </div>
              <div>
                <Card
                  style={{
                    width: "300px",
                    height: "250px",
                    marginLeft: "40px",
                    marginBottom: "90px",
                  }}
                >
                  <Card.Body>
                    <Card.Title className="font-weight-bold">
                      Recent Yield Rate
                    </Card.Title>
                    <Table
                      striped
                      bordered
                      hover
                      size="sm"
                      style={{ fontSize: "16px" }}
                    >
                      <thead>
                        <tr>
                          <th>Station</th>
                          <th>Yield</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>AOI2</th>
                          <td>{recentYield.aoi2.yield}%</td>
                        </tr>
                        <tr>
                          <th>AOI4</th>
                          <td>{recentYield.aoi4.yield}%</td>
                        </tr>
                        <tr>
                          <th>X-Ray</th>
                          <td>{recentYield.xray.yield}%</td>
                        </tr>
                        <tr>
                          <th>ICT</th>
                          <td>{recentYield.ict.yield}%</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </div>
            </DisplayRow1>
          </Row>
          <Row style={{ margin: "20px" }}>
            <Button onClick={() => this.gotoDefectMapping()}>
              Defect Mapping Page
            </Button>
          </Row>
          <br />
          <h4 className="section-style">Defect Symptom Analysis:</h4>
          <Row>
            <Col>
              <h5 className="subtitle-text">Total :</h5>
              <Plato data={sortFailure} />
            </Col>
            <Col>
              <h5 className="subtitle-text">LAST 90 DAYS DEFECT SYMPTOM</h5>
              <Plato data={sevenDaysFailure} />
            </Col>
          </Row>
          <Row>
            <Col>
              <div style={{ width: "100%" }}>
                <DefectTable sortFailure={sortFailure} />
              </div>
            </Col>
            <Col>
              <div style={{ width: "100%" }}>
                <DefectTable sortFailure={sevenDaysFailure} />
              </div>
            </Col>
          </Row>
          <hr />
          <h4 className="section-style-top3">TOP 5 Root Cause:</h4>

          <Row>
            <Col>
              <h5 className="subtitle-text">Total :</h5>
              {sortFailure.length ? (
                <div>
                  <h4>Defect Symptom: {sortFailure[0].defectName}</h4>
                  <Plato
                    data={this.parsingRootCause(
                      sortFailure[0].defectName,
                      errorAnalysis,
                      station
                    )}
                  />
                </div>
              ) : null}
            </Col>
            <Col>
              <h5 className="subtitle-text">LAST 90 DAYS REPAIR RECORD</h5>
              {sevenDaysFailure.length ? (
                <div>
                  <h4>Defect Symptom: {sevenDaysFailure[0].defectName}</h4>
                  <Plato
                    data={this.parsingSevenDayRootCause(
                      sevenDaysFailure[0].defectName,
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
              {sortFailure.length ? (
                <div>
                  <DefectTable
                    sortFailure={this.parsingRootCause(
                      sortFailure[0].defectName,
                      errorAnalysis,
                      station
                    )}
                  />
                </div>
              ) : null}
            </Col>
            <Col>
              {sevenDaysFailure.length ? (
                <div>
                  <DefectTable
                    sortFailure={this.parsingSevenDayRootCause(
                      sevenDaysFailure[0].defectName,
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
              {sortFailure[1] ? (
                <div>
                  <h4>Defect Symptom: {sortFailure[1].defectName}</h4>
                  <Plato
                    data={this.parsingRootCause(
                      sortFailure[1].defectName,
                      errorAnalysis,
                      station
                    )}
                  />
                </div>
              ) : null}
            </Col>
            <Col>
              {sevenDaysFailure[1] ? (
                <div>
                  <h4>Defect Symptom: {sevenDaysFailure[1].defectName}</h4>
                  <Plato
                    data={this.parsingSevenDayRootCause(
                      sevenDaysFailure[1].defectName,
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
              {sortFailure[1] ? (
                <div>
                  <DefectTable
                    sortFailure={this.parsingRootCause(
                      sortFailure[1].defectName,
                      errorAnalysis,
                      station
                    )}
                  />
                </div>
              ) : null}
            </Col>
            <Col>
              {sevenDaysFailure[1] ? (
                <div>
                  <DefectTable
                    sortFailure={this.parsingSevenDayRootCause(
                      sevenDaysFailure[1].defectName,
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
              {sortFailure[2] ? (
                <div>
                  <h4>Defect Symptom: {sortFailure[2].defectName}</h4>
                  <Plato
                    data={this.parsingRootCause(
                      sortFailure[2].defectName,
                      errorAnalysis,
                      station
                    )}
                  />
                </div>
              ) : null}
            </Col>
            <Col>
              {sevenDaysFailure[2] ? (
                <div>
                  <h4>Defect Symptom: {sevenDaysFailure[2].defectName}</h4>
                  <Plato
                    data={this.parsingSevenDayRootCause(
                      sevenDaysFailure[2].defectName,
                      errorAnalysis,
                      station
                    )}
                  />
                </div>
              ) : null}
            </Col>
          </Row>

          <Row>
            <Col>
              {sortFailure[2] ? (
                <div>
                  <DefectTable
                    sortFailure={this.parsingRootCause(
                      sortFailure[2].defectName,
                      errorAnalysis,
                      station
                    )}
                  />
                </div>
              ) : null}
            </Col>
            <Col>
              {sevenDaysFailure[2] ? (
                <div>
                  <DefectTable
                    sortFailure={this.parsingSevenDayRootCause(
                      sevenDaysFailure[2].defectName,
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
              {sortFailure[3] ? (
                <div>
                  <h4>Defect Symptom: {sortFailure[3].defectName}</h4>
                  <Plato
                    data={this.parsingRootCause(
                      sortFailure[3].defectName,
                      errorAnalysis,
                      station
                    )}
                  />
                </div>
              ) : null}
            </Col>
            <Col>
              {sevenDaysFailure[3] ? (
                <div>
                  <h4>Defect Symptom: {sevenDaysFailure[3].defectName}</h4>
                  <Plato
                    data={this.parsingSevenDayRootCause(
                      sevenDaysFailure[3].defectName,
                      errorAnalysis,
                      station
                    )}
                  />
                </div>
              ) : null}
            </Col>
          </Row>

          <Row>
            <Col>
              {sortFailure[3] ? (
                <div>
                  <DefectTable
                    sortFailure={this.parsingRootCause(
                      sortFailure[3].defectName,
                      errorAnalysis,
                      station
                    )}
                  />
                </div>
              ) : null}
            </Col>
            <Col>
              {sevenDaysFailure[3] ? (
                <div>
                  <DefectTable
                    sortFailure={this.parsingSevenDayRootCause(
                      sevenDaysFailure[3].defectName,
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
              {sortFailure[4] ? (
                <div>
                  <h4>Defect Symptom: {sortFailure[4].defectName}</h4>
                  <Plato
                    data={this.parsingRootCause(
                      sortFailure[4].defectName,
                      errorAnalysis,
                      station
                    )}
                  />
                </div>
              ) : null}
            </Col>
            <Col>
              {sevenDaysFailure[4] ? (
                <div>
                  <h4>Defect Symptom: {sevenDaysFailure[4].defectName}</h4>
                  <Plato
                    data={this.parsingSevenDayRootCause(
                      sevenDaysFailure[4].defectName,
                      errorAnalysis,
                      station
                    )}
                  />
                </div>
              ) : null}
            </Col>
          </Row>

          <Row>
            <Col>
              {sortFailure[4] ? (
                <div>
                  <DefectTable
                    sortFailure={this.parsingRootCause(
                      sortFailure[4].defectName,
                      errorAnalysis,
                      station
                    )}
                  />
                </div>
              ) : null}
            </Col>
            <Col>
              {sevenDaysFailure[4] ? (
                <div>
                  <DefectTable
                    sortFailure={this.parsingSevenDayRootCause(
                      sevenDaysFailure[4].defectName,
                      errorAnalysis,
                      station
                    )}
                  />
                </div>
              ) : null}
            </Col>
          </Row>

          <div style={{ marginBottom: "500px" }}></div>
        </Container>
      </>
    ) : null;
  }
}

export default Detail;
