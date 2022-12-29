import React from "react";

const Container: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="wrapper">
      {children}

      <style jsx>{`
        .wrapper {
          width: 60rem;
          padding-left: 1rem;
          padding-right: 1rem;
          margin-left: auto;
          margin-right: auto;
        }
      `}</style>
    </div>
  );
};

export default Container;
