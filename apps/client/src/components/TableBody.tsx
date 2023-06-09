import { PropsWithChildren } from 'react';

const TableBody: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <tbody className="wrapper">
      {children}

      <style jsx>{`
        .wrapper {
        }
      `}</style>
    </tbody>
  );
};

export default TableBody;
