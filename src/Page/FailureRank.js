import React, { useState, useEffect } from "react";

import { Container, Row, Col, Table, Card } from "react-bootstrap";
import Header from "../Component/Header";

export default function Dashboard(props) {
  //     const [bpnData, setbpnData] = useState([]);
  //   const [mbData, setMbData] = useState([]);
  //   const [otherData, setOtherData] = useState([]);
  //   const [piesData, setPiesData] = useState([]);

  const { defectByCad, defectByPn, vertical, horizontal } =
    props.location.state;
  console.log(defectByCad, defectByPn, vertical, horizontal);
  return (
    <div>
      <Header />
      <div style={{ height: "80px" }}></div>
      <Container>
        <Row>
          <Col>
            <Card
              style={{
                marginLeft: "40px",
                marginBottom: "90px",
              }}
            >
              <Card.Body>
                <Card.Title className="font-weight-bold">
                  Failure Rank by Component Type
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
                      <th>Component Type</th>
                      <th>QTY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {defectByCad.slice(0, 20).map((obj, i) => (
                      <tr key={i}>
                        <td>{obj[0]}</td>
                        <td>{obj[1]}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card
              style={{
                marginLeft: "40px",
                marginBottom: "90px",
              }}
            >
              <Card.Body>
                <Card.Title className="font-weight-bold">
                  Failure Rank by Component Part Number
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
                      <th>Component Type</th>
                      <th>QTY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {defectByPn.slice(0, 20).map((obj, i) => (
                      <tr key={i}>
                        <td>{obj[0]}</td>
                        <td>{obj[1]}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card
              style={{
                marginLeft: "40px",
                marginBottom: "90px",
              }}
            >
              <Card.Body>
                <Card.Title className="font-weight-bold">
                  Tombstone Component Orientation
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
                      <th>Orientation</th>
                      <th>QTY</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Vertical</td>
                      <td>{vertical}</td>
                    </tr>
                    <tr>
                      <td>Horizontal</td>
                      <td>{horizontal}</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
