import React from "react";
import styled from "styled-components";

const Nav = styled.div`
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.0975);
`;

const NavHeader = styled.div`
  max-width: 1200px;
  padding: 26px 20 px;
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

const Input = styled.input`
  font-size: 16px;
  border: solid 1px #dbdbdb;
  border-radius: 3px;
  color: #262626;
  padding: 7px 33px;
  border-radius: 3px;
  color: #999;
  cursor: text;
  font-size: 14px;
  font-weight: 300;
  text-align: center;

  width: 20%;
  margin: 40px 40px;

  &:active,
  &:focus {
    text-align: left;
  }
`;

export default function Header(props) {
  return (
    <Nav>
      <NavHeader>
        <NavTitle>
          <h3>SUPERMICRO ME</h3>
        </NavTitle>
        <NavSubTitle>
          <h2>Quality Improvement Tracking Tool For EMS</h2>
        </NavSubTitle>
      </NavHeader>
    </Nav>
  );
}