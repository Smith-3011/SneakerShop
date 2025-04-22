import React from "react";
import styled from "styled-components";
import logo from "../assets/items/adidas_yeezy_700_wave_runner.png";
import image from "../assets/items/nike_jordan_1_travis_mocha_high.png";
import { mobile } from "../responsive";

const About = () => {
  return (
    <Wrapper>
      <AboutContainer>
        <Title>
          <Logo src={logo} />
          About SneakersShop
        </Title>
        <Info>
          SneakerShop is your ultimate destination for premium and exclusive
          sneakers. Designed for sneaker lovers, collectors, and everyday
          enthusiasts, our platform brings together the latest releases, iconic
          classics, and rare finds — all in one place. With a sleek,
          user-friendly interface and smart features like AI-powered sneaker
          insights, we help you make informed choices based on brand history,
          market trends, and investment value. Whether you're copping your next
          grail or exploring new drops, SneakerShop makes the journey seamless,
          secure, and stylish.
        </Info>
      </AboutContainer>
      <ImageContainer>
        <Image src={image} />
      </ImageContainer>
    </Wrapper>
  );
};

export default About;

const Wrapper = styled.div`
  display: flex;
  margin-top: 5rem;
`;

const AboutContainer = styled.div`
  ${mobile({
    display: "flex",
    flexDirection: "column",
    margin: "0 auto",
    textAlign: "center",
    width: "100%",
  })}
`;

const Title = styled.h1`
  display: flex;
  align-items: center;
  color: var(--clr-primary);
  font-family: 'Urbanist', sans-serif;
  font-weight: 700;
  ${mobile({ display: "flex", flexDirection: "column" })}
`;

const Logo = styled.img`
  width: 10%;
  min-width: 50px;
  margin-right: 1rem;
  ${mobile({ width: "30%" })}
`;

const Info = styled.p`
  color: var(--clr-gray);
  font-family: 'Urbanist', sans-serif;
  font-size: 1.1rem;
  line-height: 1.6;
  font-weight: 500;
  ${mobile({
    margin: "1rem",
  })}
`;

const ImageContainer = styled.div`
  ${mobile({ display: "none" })}
`;

const Image = styled.img`
  height: 50vh;
  width: 35vw;
  object-fit: cover;
`;
