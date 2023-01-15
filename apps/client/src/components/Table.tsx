import { PropsWithChildren } from "react";

const Table: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <table className="wrapper">
      {children}

      <style jsx>{`
        .wrapper {
          border-collapse: collapse;
          font-size: 0.9rem;
          width: 100%;
        }
      `}</style>
    </table>
  );
};

export default Table;
