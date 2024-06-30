import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Leaderboard from './Leaderboard';

test('renders the Leaderboard component', () => {
  const { getByTestId } = render(
    <MemoryRouter>
      <Leaderboard />
    </MemoryRouter>
  );

  expect(getByTestId('leaderboard-test')).toBeInTheDocument();
});
