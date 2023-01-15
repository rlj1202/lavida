import { PropsWithChildren } from "react";

const TableHead: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <thead className="wrapper">
      {children}

      <style jsx>{`
        .wrapper {
          font-weight: bold;
        }
      `}</style>
    </thead>
  );
};

export default TableHead;
