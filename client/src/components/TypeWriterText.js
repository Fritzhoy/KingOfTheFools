import React from "react";
import styled from "styled-components";
import Button from "./sections/Button";

const Title = styled.h1`
  font-family: "soda", sans-serif;
  font-size: 46px;
  text-transform: capitalize;
  width: 80%;
  color: ${(props) => props.theme.text};
`;

const SubTitle = styled.h3`
  font-size: ${(props) => props.theme.fontlg};
  text-transform: capitalize;
  color: ${(props) => `rgba(${props.theme.textRgba}, 0.6)`};
  font-weight: 600;
  width: 80%;
  margin: 1rem;
`;

const ButtonContainer = styled.div`
  width: 80%;
  margin: 1rem auto;
`;

const TypeWriterText = () => {
  return (
    <>
      <Title>
      It’s Not A Claim, The Throne Is Mine!
      </Title>
      <SubTitle>
        {" "}
        Any man who must say, 'I am the king,' is no true king.
      </SubTitle>
      <ButtonContainer>
        <Button text='Are you a true King?' link='#about' />
      </ButtonContainer>
    </>
  );
};

export default TypeWriterText;
