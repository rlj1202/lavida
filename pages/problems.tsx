import DefaultLayout from '../layouts/DeaultLayout';

import useSWR from 'swr';

import fetcher from '../src/libs/fetcher';

import IProblem from '../src/interfaces/IProblem';

export default function Problems() {
  const problems = (function() {
    var { data, error } = useSWR(`/api/problems`, fetcher);
    return data as IProblem[];
  })();

  return (
    <DefaultLayout>
      <h1>문제</h1>

      { problems && problems.map(problem => {
        return (
          <>
            {JSON.stringify(problem)}
          </>
        );
      }) }
    </DefaultLayout>
  );
}