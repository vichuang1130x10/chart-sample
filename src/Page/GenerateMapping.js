import React, { Component } from "react";
import { UncontrolledReactSVGPanZoom } from "react-svg-pan-zoom";
import styled from "styled-components";
import * as d3 from "d3";
import BoardData from "../board-data/boarddatas.json";
import PartData from "../board-data/PartData.json";
const width = 900;
const height = 900;

const stations = ["AOI2", "AOI4", "X-Ray", "ICT"];

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
  };

  Viewer = React.createRef();
  ViewerB = React.createRef();

  _zoomOnViewerCenter = () => this.Viewer.current.zoomOnViewerCenter(1.1);
  _fitSelection = () => this.Viewer.current.fitSelection(40, 40, 200, 200);
  _fitToViewer = () => this.Viewer.current.fitToViewer();

  _zoomOnViewerCenterB = () => this.ViewerB.current.zoomOnViewerCenter(1.1);
  _fitSelectionB = () => this.ViewerB.current.fitSelection(40, 40, 200, 200);
  _fitToViewerB = () => this.ViewerB.current.fitToViewer();

  componentDidMount() {
    console.log("passed data", this.props.location.state);
    const { errorAnalysis } = this.props.location.state;
    this.drawSvg();
    this.Viewer.current.fitToViewer();
    this.ViewerB.current.fitToViewer();
    this.setState({
      errorAnalysis,
    });
  }

  // componentDidMount() {
  //   console.log("passed data", this.props.location.state);
  //   const { startDate, endDate, modelName, modelDetail, errorAnalysis } =
  //     this.props.location.state;
  //   this.setState({
  //     tableData: this.props.location.state,
  //     startDate,
  //     endDate,
  //     modelName,
  //     modelDetail,
  //     trendData: modelDetail[this.state.station].mo,
  //     errorAnalysis,
  //     sortFailure: this.parsingToQty(errorAnalysis, this.state.station),
  //     sevenDaysFailure: this.parsingToSevenDayQty(
  //       errorAnalysis,
  //       this.state.station
  //     ),
  //   });
  // }

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

    console.log("composedBotSideData", composedBotSideData);

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

  render() {
    const { drawingData, searchParam, drawingDataBot } = this.state;
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
          <hr />

          <button className="btn" onClick={() => this._zoomOnViewerCenter()}>
            Zoom on center
          </button>
          <button className="btn" onClick={() => this._fitSelection()}>
            Zoom area 200x200
          </button>
          <button className="btn" onClick={() => this._fitToViewer()}>
            Fit
          </button>
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

          <button className="btn" onClick={() => this._zoomOnViewerCenterB()}>
            Zoom on center
          </button>
          <button className="btn" onClick={() => this._fitSelectionB()}>
            Zoom area 200x200
          </button>
          <button className="btn" onClick={() => this._fitToViewerB()}>
            Fit
          </button>
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
