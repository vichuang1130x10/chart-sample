import React, { useState } from "react";
import ComponentTable from "../Component/ComponentTable";
import { Container, Row, Badge } from "react-bootstrap";
import { recommendItem } from "../Utils/utilities";

export default function ResultPresent(props) {
  console.log("result page start");

  const [originalBom, setBom] = useState([]);

  const nud = props.location.state.NUD;
  const bom = props.location.state.BOM;

  const eParts = nud["Electronic parts"];
  const mParts = nud["Mechanical parts"];

  const eResults = bom.filter(({ smcPn: id1 }) =>
    eParts.some(({ "SMC PN": id2 }) => id2 === id1)
  );

  const mResults = bom.filter(({ smcPn: id1 }) =>
    mParts.some(({ "SMC PN": id2 }) => id2 === id1)
  );
  const results = [...eResults, ...mResults];
  const types = bom
    .map((item) => item.type)
    .filter((item) => item.length === 3);
  const typeSet = new Set(types);
  const typeArray = Array.from(typeSet);

  const badgeOnClick = (badge) => {
    const udpateBom = bom
      .filter((item) => item.type !== undefined && item.type !== null)
      .filter((item) => item.type === badge);
    setBom(udpateBom);
  };

  return (
    <Container>
      <h1 className="font-weigth-bold text-center mb-4">Compare Result</h1>

      <Row className="mb-2">
        <h4>Already Exist in New Component List</h4>
        <ComponentTable data={results} />
      </Row>
      <Row className="mb-2">
        <h4>Recommend to review</h4>
        <ComponentTable data={recommendItem(bom)} exsitedBOM={results} checkExist={true}/>
      </Row>

      <Row className="mb-2">
        <h4 className="mb-4">BOM Review By Component Type:</h4>
        <Container>
          {typeArray.map((item, i) => (
            <Badge
              key={i}
              pill
              variant="primary"
              onClick={() => badgeOnClick(item)}
              className="mr-2 p-2"
            >
              {item}
            </Badge>
          ))}
        </Container>
      </Row>

      <Row className="mb-2">
        <ComponentTable data={originalBom} />
      </Row>
    </Container>
  );
}
