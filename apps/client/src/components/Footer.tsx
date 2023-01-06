import React from "react";
import Container from "./Container";

const Footer: React.FC = () => {
  return (
    <footer className="wrapper">
      <Container>
        <div className="content">
          Copyright (c) 2022, rlj1202@gmail.com
          <br />
          Ajou University
        </div>
      </Container>
      <style jsx>{`
        .content {
          text-align: center;
          font-size: 0.6rem;
          padding-left: 1rem;
          padding-right: 1rem;
          margin-top: 4rem;
          margin-bottom: 4rem;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
