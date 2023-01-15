import { PropsWithChildren } from "react";

const TableCell: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <td className="wrapper">
      {children}

      <style jsx>{`
        .wrapper {
          border: 1px solid #dddddd;
          padding: 0.4rem;
        }
      `}</style>
    </td>
  );
};

export default TableCell;
