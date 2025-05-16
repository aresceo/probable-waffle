import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import bgImg from "../assets/landing-hot.jpg";

const Wrapper = styled.div`
  width: 100vw; height: 100vh;
  background: url(${bgImg}) center/cover no-repeat;
  display: flex; align-items: center; justify-content: center;
`;

const HotButton = styled(motion.button)`
  padding: 1.2rem 2.5rem;
  font-size: 2rem;
  color: #fff;
  background: linear-gradient(90deg, #fe8c00 0%, #f83600 100%);
  border: none;
  border-radius: 30px;
  box-shadow: 0 4px 24px rgba(255,85,85,0.3);
  cursor: pointer;
  transition: 0.2s;
  &:hover { transform: scale(1.08) rotate(-2deg); background: #ff3333; }
`;

export default function Landing() {
  return (
    <Wrapper>
      <HotButton
        whileHover={{ scale: 1.1, boxShadow: "0 0 40px #f83600" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.location = "/auth"}
      >
        chatta con ragazze della tua città
      </HotButton>
    </Wrapper>
  );
}