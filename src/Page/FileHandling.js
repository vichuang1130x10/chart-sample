import React, { useState } from "react";
import Button from "../Component/Button";
import { Container, Row, Col } from "react-bootstrap";
import { navigate } from "@reach/router";
import DragCard from "../Component/DragCard";
import { FaHourglass } from "react-icons/fa";
import { parsingErrorList } from "../Utils/CmShopFloorParsing/RawDataParsing";
import { mappingErrorListAndRepairList } from "../Utils/MappingErrorListAndRepariList";
import Header from "../Component/Header";
import styled from "styled-components";
import { outputDate } from "../Utils/helperFunction";

const ContentRow = styled.div`
  width: 1200px;
  display: flex;
  margin: auto;
  margin-top: 40px;
  justify-content: center;
  align-items: center;
`;

export default function FileHandling() {
  const [yieldRate, setYieldRate] = useState({});
  const [repairList, setRepairList] = useState({});
  const [yieldRateFlag, setYieldRateFlag] = useState(false);
  const [repairListFlag, setRepairListFlag] = useState(false);

  const receivedYieldRate = (obj) => {
    setYieldRate(obj);
  };

  const receivedRepairList = (obj) => setRepairList(obj);

  const transferData = (e) => {
    // mappingErrorListAndRepairList(errorList, repairList);
    // const udpatedErrorList = errorList.ErrorList.map((ele) => {
    //   if (ele["Reason"] === null || ele["Reason"] === undefined) {
    //     ele["Reason"] = "待修";
    //   }
    //   return ele;
    // });
    const parsedErrorList = parsingErrorList(repairList.RepairList);
    console.log(parsedErrorList);

    const modelName = "IPU-M MB MK2";
    const modelDetail =
      yieldRate.models.filter((model) => model.model === modelName)[0] || {};

    navigate(`/detail`, {
      state: {
        modelName,
        modelDetail,
        startDate: outputDate(yieldRate.startDate),
        endDate: outputDate(yieldRate.endDate),
        errorAnalysis: parsedErrorList[modelName],
      },
    });
  };

  return (
    <div>
      <Header />
      <Container>
        <ContentRow>
          <DragCard
            title="Yield Rate"
            fileType="YieldRate"
            callback={(obj) => receivedYieldRate(obj)}
            setFlag={(bool) => setYieldRateFlag(bool)}
          />

          <DragCard
            title="Failure Analysis List"
            fileType="RepairList"
            callback={(obj) => receivedRepairList(obj)}
            setFlag={(bool) => setRepairListFlag(bool)}
          />
        </ContentRow>
        <div style={{ height: "50px" }} />
        <Row className="d-flex justify-content-center">
          <Button
            disabled={!yieldRateFlag || !repairListFlag}
            style={{ width: "240px" }}
            onClick={transferData}
          >
            <span className="m-1">
              <FaHourglass color="white" />
            </span>{" "}
            Generate Report
          </Button>
        </Row>
      </Container>
    </div>
  );
}
