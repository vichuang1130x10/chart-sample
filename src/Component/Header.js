import React from "react";
import styled from "styled-components";

const Nav = styled.div`
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.0975);
`;

const NavHeader = styled.div`
  max-width: 1200px;
  padding: 20px 20px;
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

export default function Header(props) {
  return (
    <Nav>
      <NavHeader>
        <NavTitle></NavTitle>
        <NavSubTitle>
          <h1>Quality Improvement Tracking Tool</h1>
        </NavSubTitle>
      </NavHeader>
    </Nav>
  );
}
