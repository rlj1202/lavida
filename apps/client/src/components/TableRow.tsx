import { PropsWithChildren } from 'react';

const TableRow: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <tr className="wrapper">
      {children}

      <style jsx>{`
        .wrapper {
        }
      `}</style>
    </tr>
  );
};

export default TableRow;
