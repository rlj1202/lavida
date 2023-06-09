import { FC } from 'react';

const ProblemTag: FC<{ type: 'success' | 'wrong-answer' }> = ({ type }) => {
  return (
    <span className={`wrapper ${type}`}>
      {type === 'success' && '성공'}
      {type === 'wrong-answer' && '실패'}

      <style jsx>{`
        .wrapper {
          color: white;
          padding: 0.2rem 0.4rem;
          font-size: 0.7rem;
        }
        .wrong-answer {
          background-color: red;
        }
        .success {
          background-color: green;
        }
      `}</style>
    </span>
  );
};

export default ProblemTag;
