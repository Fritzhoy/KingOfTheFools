import React from 'react'
import styled from 'styled-components'
import Button from './Button';

const Section = styled.section`
min-height: 100vh;
width: 100%;
position: relative;
background-color: ${props => props.theme.body};
color: ${props => props.theme.text};
display: flex;
justify-content: center;
align-items: center;
position: relative;
`
const Container = styled.div`
width: 75%;
margin: 0 auto;

display: flex;
justify-content: center;
align-items: center;
`
const Box = styled.div`
width: 50%;
height: 100%;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
`
const Title = styled.h2`
  font-size: ${(props) => props.theme.fontxxl};
  text-transform: capitalize;
  align-self: flex-start;
  color: ${(props) => props.theme.text};
  width: 80%;
  margin: 1rem auto;
`
const SubText = styled.p`
  font-size: ${(props) => props.theme.fontlg};

  color: ${(props) => props.theme.text};
  width: 80%;
  margin: 1rem auto;
  align-self: flex-start;
  font-weight:400;
`
const SubTextLight = styled.p`
  font-size: ${(props) => props.theme.fontlg};
  width: 80%;
  color: ${(props) => `rgba(${props.theme.textRgba}, 0.6)`};
  margin: 1rem auto;
  align-self: flex-start;
  font-weight:400;
`
const ButtonContainer = styled.div`
width: 80%;
margin: 1rem auto;
align-self: flex-start;
`
const About = () => {
  return(
    <Section>
      <Container>
        <Box>
        <Title> Welcome to Psychodelic Ride</Title>
        <SubText> A 103 digital collectibles doses stored as ERC-721 tokens on the Ethereum blockchain and hosted on IPFS. Each of then invites the owner to question the reality that we live in 
        </SubText>
        <SubTextLight> The idea was born in one of the countless journeys of the mind amidst the boredom and uncertainty of career transition. The drawing came to us in a letter, and the artist is unknown
       </SubTextLight>
       <ButtonContainer>
        <Button text="Take Your Dose" link="#about"/>
        </ButtonContainer>
       </Box>
      </Container>
      </Section>
  )
}
export default About