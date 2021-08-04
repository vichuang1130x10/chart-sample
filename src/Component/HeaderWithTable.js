import React from "react";
import styled from "styled-components";
import { Link } from "@reach/router";
import { Table } from "react-bootstrap";

const Nav = styled.div`
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.0975);
`;

const NavHeader = styled.div`
  max-width: 1200px;
  padding: 20px 20px 5px 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`;

const NavTitle = styled.div`
  margin: 20px 0 10px 0;
  padding: 0 64px;
  font-family: "Oswald", sans-serif;
`;

const NavSubTitle = styled.div`
  color: #606060;
  padding: 0 64px;
`;

const DataRange = styled.div`
  padding: 20px 64px;
`;

const ModelName = styled.div`
  padding: 0 64px;
`;

const FE = styled.div`
  color: #606060;
  padding: 0 64px;
`;

const BE = styled.div`
  color: #606060;
  padding: 0 64px;
`;

const FTY = styled.div`
  color: #606060;
  padding: 0 64px;
`;

const TableContainer = styled.div`
  padding: 12px 64px;
`;

export default function HeaderWithTable(props) {
  console.log(props);

  return (
    <Nav>
      <NavHeader>
        <NavTitle>
          <Link to="/" style={{ color: "#000" }}>
          <h3>YIELD DATA DEMO</h3>
          </Link>
        </NavTitle>
        <NavSubTitle>
          <h2>Quality Improvement Tracking Tool</h2>
        </NavSubTitle>
        <DataRange>
          <h6>
            Date Range : {`${props.data.startDate} ~ ${props.data.endDate}`}
          </h6>
        </DataRange>
        <ModelName>
          <h4>Model: {props.data.modelName}</h4>
        </ModelName>

        <TableContainer>
          <Table striped bordered hover size="sm" style={{ fontSize: "16px" }}>
            <thead>
              <tr>
                <th>Station</th>
                <th>AOI2</th>
                <th>AOI4</th>
                <th>X-Ray</th>
                <th>ICT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>YIELD</th>
                <td>
                  {props.data.modelDetail.AOI2.Pass !== 0 &&
                  props.data.modelDetail.AOI2.Total !== 0
                    ? (
                        (props.data.modelDetail.AOI2.Pass /
                          props.data.modelDetail.AOI2.Total) *
                        100
                      ).toFixed(1)
                    : 0}{" "}
                  %
                </td>
                <td>
                  {" "}
                  {props.data.modelDetail.AOI4.Pass !== 0 &&
                  props.data.modelDetail.AOI4.Total !== 0
                    ? (
                        (props.data.modelDetail.AOI4.Pass /
                          props.data.modelDetail.AOI4.Total) *
                        100
                      ).toFixed(1)
                    : 0}{" "}
                  %
                </td>
                <td>
                  {" "}
                  {props.data.modelDetail["X-Ray"].Pass !== 0 &&
                  props.data.modelDetail["X-Ray"].Total !== 0
                    ? (
                        (props.data.modelDetail["X-Ray"].Pass /
                          props.data.modelDetail["X-Ray"].Total) *
                        100
                      ).toFixed(1)
                    : 0}{" "}
                  %
                </td>
                <td>
                  {" "}
                  {props.data.modelDetail.ICT.Pass !== 0 &&
                  props.data.modelDetail.ICT.Total !== 0
                    ? (
                        (props.data.modelDetail.ICT.Pass /
                          props.data.modelDetail.ICT.Total) *
                        100
                      ).toFixed(1)
                    : "NA"}{" "}
                  %
                </td>
              </tr>
              <tr>
                <th>INPUT</th>
                <td>{props.data.modelDetail.AOI2.Total}</td>
                <td>{props.data.modelDetail.AOI4.Total}</td>
                <td>{props.data.modelDetail["X-Ray"].Total}</td>
                <td>{props.data.modelDetail.ICT.Total}</td>
              </tr>
              <tr>
                <th>PASS</th>
                <td>{props.data.modelDetail.AOI2.Pass}</td>
                <td>{props.data.modelDetail.AOI4.Pass}</td>
                <td>{props.data.modelDetail["X-Ray"].Pass}</td>
                <td>{props.data.modelDetail.ICT.Pass}</td>
              </tr>
              <tr>
                <th>FAIL</th>
                <td>{props.data.modelDetail.AOI2.Fail}</td>
                <td>{props.data.modelDetail.AOI4.Fail}</td>
                <td>{props.data.modelDetail["X-Ray"].Fail}</td>
                <td>{props.data.modelDetail.ICT.Fail}</td>
              </tr>
            </tbody>
          </Table>
        </TableContainer>
      </NavHeader>
    </Nav>
  );
}
