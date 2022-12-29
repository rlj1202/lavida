import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="wrapper">
      Copyright (c) 2022, rlj1202@gmail.com
      <br />
      Ajou University
      <style jsx>{`
        .wrapper {
          padding: 1rem 2rem;
          text-align: center;
          font-size: 0.6rem;
          margin: 2rem;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
