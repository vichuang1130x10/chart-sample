import React, { Component } from "react";
import { UncontrolledReactSVGPanZoom } from "react-svg-pan-zoom";
import styled from "styled-components";
import * as d3 from "d3";
import BoardData from "../board-data/boarddatas.json";
import PartData from "../board-data/PartData.json";
const width = 900;
const height = 900;

const STATIONS = ["AOI2", "AOI4", "X-Ray", "ICT"];

const MainContainer = styled.div`
  width: 1400px;
  margin: 50px auto;
`;
const Input = styled.input`
  font-size: 16px;
  border: solid 1px #dbdbdb;
  border-radius: 3px;
  color: #262626;
  padding: 7px 7px;
  border-radius: 3px;
  color: #999;
  cursor: text;
  font-size: 14px;
  font-weight: 300;
  text-align: center;
  background: #fafafa;
  height: 24px;
  margin-left: 10px;

  &:active,
  &:focus {
    text-align: left;
  }
`;

const InputField = styled.div`
  display: flex;
  align-items: center;
`;

const SelectContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const calculateX = (designator, data) => {
  if (designator.O === "0" || designator.O === "180") {
    return designator["X-axis"] - data.width / 2;
  } else {
    return designator["X-axis"] - data.length / 2;
  }
};
const calculateY = (designator, data) => {
  if (designator.O === "0" || designator.O === "180") {
    return designator["Y-axis"] + data.length / 2;
  } else {
    return designator["Y-axis"] + data.width / 2;
  }
};

const parsingToQty = (resultForStationAndBatch, rc, batch) => {
  if (!resultForStationAndBatch) {
    return [];
  }

  console.log("resultForStationAndBatch", resultForStationAndBatch);

  const filterReuslt = resultForStationAndBatch
    .filter((obj) => obj.batchNo === batch && obj.description === rc)
    .map((obj) => obj.reasons[0].item);

  console.log("filterReuslt", filterReuslt);

  const result = filterReuslt.reduce(function (prev, cur) {
    prev[cur] = (prev[cur] || 0) + 1;
    return prev;
  }, {});

  return result;
};

class App extends Component {
  state = {
    boardData: BoardData,
    partData: PartData,
    boardWidth: 374.48, // x , y move (5,5) distance
    boardLength: 424,
    drawingData: [],
    labelData: [],
    searchParam: "",
    drawingDataBot: [],
    labelDataBot: [],
    errorAnalysis: [],
    batchs: [],
    station: "",
    batch: "",
    resultForStationAndBatch: [],
    rootCause: [],
    selectRootCause: "",
    selectResult: [],
  };

  Viewer = React.createRef();
  ViewerB = React.createRef();

  componentDidMount() {
    console.log("passed data", this.props.location.state);
    const { errorAnalysis, batchs } = this.props.location.state;
    this.drawSvg();
    this.Viewer.current.fitToViewer();
    this.ViewerB.current.fitToViewer();
    this.setState({
      errorAnalysis,
      batchs,
    });
  }

  drawSvg = () => {
    const { boardWidth, boardLength, boardData } = this.state;
    const xScale = d3.scaleLinear().domain([0, boardWidth]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, boardLength]).range([0, height]);

    const composedTopSideData = boardData
      .filter((item) => item.Side === "T")
      .map((designator) => {
        const data = PartData.find(
          (partData) => partData.shapeName === designator.CompType
        );

        const xAxis = calculateX(designator, data);
        const yAxis = calculateY(designator, data);
        let w, l;

        if (designator.O === "0" || designator.O === "180") {
          w = data.width;
        } else {
          w = data.length;
        }
        if (designator.O === "0" || designator.O === "180") {
          l = data.length;
        } else {
          l = data.width;
        }

        return {
          ref: designator.CompName,
          xAxis,
          yAxis,
          w,
          l,
        };
      });

    const composedBotSideData = boardData
      .filter((item) => item.Side === "B")
      .map((designator) => {
        const data = PartData.find(
          (partData) => partData.shapeName === designator.CompType
        );

        const xAxis = calculateX(designator, data);
        const yAxis = calculateY(designator, data);
        let w, l;

        if (designator.O === "0" || designator.O === "180") {
          w = data.width;
        } else {
          w = data.length;
        }
        if (designator.O === "0" || designator.O === "180") {
          l = data.length;
        } else {
          l = data.width;
        }

        return {
          ref: designator.CompName,
          xAxis,
          yAxis,
          w,
          l,
        };
      });

    const drawingData = composedTopSideData.map((d) => ({
      x: xScale(d.xAxis),
      y: yScale(d.yAxis),
      w: d.w * (width / boardWidth),
      l: d.l * (height / boardLength),
      ref: d.ref,
    }));

    const labelData = composedTopSideData.map((d) => ({
      x: xScale(d.xAxis),
      y: yScale(d.yAxis),
      stroke: "Blue",
      text: d.ref,
      size: `10px`,
    }));

    const drawingDataBot = composedBotSideData.map((d) => ({
      x: xScale(d.xAxis),
      y: yScale(d.yAxis),
      w: d.w * (width / boardWidth),
      l: d.l * (height / boardLength),
      ref: d.ref,
    }));

    const labelDataBot = composedBotSideData.map((d) => ({
      x: xScale(d.xAxis),
      y: yScale(d.yAxis),
      stroke: "Blue",
      text: d.ref,
      size: `10px`,
    }));

    this.setState({ drawingData, labelData, drawingDataBot, labelDataBot });
  };

  updateSearchParam = (e) => {
    this.setState({ searchParam: e.target.value });
  };

  setStation = (e) => {
    this.setState({
      station: e.target.value,
      resultForStationAndBatch: [],
      batch: "",
      rootCause: [],
      selectRootCause: "",
      selectResult: [],
    });
  };

  setBatch = (e) => {
    const { errorAnalysis, station } = this.state;
    const batch = e.target.value;

    console.log("errorAnalysis", errorAnalysis);
    console.log("station", station);

    const test = errorAnalysis[station].ErorrDescriptions;
    console.log("test", test);
    const resultForStationAndBatch = errorAnalysis[
      station
    ].ErorrDescriptions.filter((obj) => obj.batchNo === batch);
    console.log("resultForStationAndBatch", resultForStationAndBatch);
    const rootCause = Array.from(
      new Set(resultForStationAndBatch.map((obj) => obj.description || ""))
    );
    console.log("rootCause", rootCause);
    this.setState({
      batch,
      resultForStationAndBatch,
      rootCause,
    });
  };

  setRootCause = (e) => {
    const { resultForStationAndBatch, batch } = this.state;
    const selectRootCause = e.target.value;
    const result = parsingToQty(
      resultForStationAndBatch,
      selectRootCause,
      batch
    );
    console.log("result", result);
    let selectResult = [];
    for (let [key, value] of Object.entries(result)) {
      selectResult.push({ key, value });
    }
    console.log("selectResult", selectResult);
    this.setState({
      selectRootCause,
      selectResult,
    });
  };

  render() {
    const {
      drawingData,
      searchParam,
      drawingDataBot,
      batchs,
      rootCause,
      batch,
      selectRootCause,
    } = this.state;

    return (
      <div>
        <MainContainer>
          <h1>Board Viewer</h1>
          <InputField>
            <h3>Search: </h3>
            <Input
              value={searchParam}
              onChange={(e) => this.updateSearchParam(e)}
            />
          </InputField>
          <SelectContainer>
            <label htmlFor="stations">
              STATION
              <select id="stations" onChange={(e) => this.setStation(e)}>
                <option />
                {STATIONS.map((station) => (
                  <option value={station} key={station}>
                    {station}
                  </option>
                ))}
              </select>
            </label>

            <label htmlFor="batch">
              BATCH
              <select
                id="batch"
                onChange={(e) => this.setBatch(e)}
                value={batch}
              >
                <option />
                {batchs.map((batch) => (
                  <option value={batch} key={batch}>
                    {batch}
                  </option>
                ))}
              </select>
            </label>

            <label htmlFor="rootCause">
              ROOT CAUSE
              <select
                id="rootCause"
                onChange={(e) => this.setRootCause(e)}
                value={selectRootCause}
              >
                <option />
                {rootCause.length !== 0
                  ? rootCause.map((rc) => (
                      <option value={rc} key={rc}>
                        {rc}
                      </option>
                    ))
                  : null}
              </select>
            </label>
          </SelectContainer>
          <hr />
          <UncontrolledReactSVGPanZoom
            ref={this.Viewer}
            width={1200}
            height={1200}
          >
            <svg className="svg-style" width={width} height={height}>
              {drawingData.map((d, i) => (
                <rect
                  key={i}
                  x={d.x}
                  y={height - d.y}
                  width={d.w}
                  height={d.l}
                  strokeWidth={0.5}
                  stroke="black"
                  fill="red"
                  fillOpacity={d.ref === searchParam ? 1 : 0}
                >
                  <title>{`${d.ref}`}</title>
                </rect>
              ))}
              <g>
                {this.state.labelData.map((d, i) => (
                  <text
                    key={i}
                    x={d.x}
                    y={height - d.y}
                    stroke={d.stroke}
                    fontSize={d.size}
                  >
                    {d.text === searchParam ? d.text : ""}
                  </text>
                ))}
              </g>
            </svg>
          </UncontrolledReactSVGPanZoom>
          <hr />
          <UncontrolledReactSVGPanZoom
            ref={this.ViewerB}
            width={1200}
            height={1200}
          >
            <svg className="svg-style" width={width} height={height}>
              {drawingDataBot.map((d, i) => (
                <rect
                  key={i}
                  x={d.x}
                  y={height - d.y}
                  width={d.w}
                  height={d.l}
                  strokeWidth={0.5}
                  stroke="black"
                  fill="red"
                  fillOpacity={d.ref === searchParam ? 1 : 0}
                >
                  <title>{`${d.ref}`}</title>
                </rect>
              ))}
              <g>
                {this.state.labelDataBot.map((d, i) => (
                  <text
                    key={i}
                    x={d.x}
                    y={height - d.y}
                    stroke={d.stroke}
                    fontSize={d.size}
                  >
                    {d.text === searchParam ? d.text : ""}
                  </text>
                ))}
              </g>
            </svg>
          </UncontrolledReactSVGPanZoom>
        </MainContainer>
      </div>
    );
  }
}

export default App;
