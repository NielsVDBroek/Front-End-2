import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Account from './Account';

test('renders the Account component', () => {
  const { getByTestId } = render(
    <MemoryRouter>
      <Account />
    </MemoryRouter>
  );

  expect(getByTestId('account-test')).toBeInTheDocument();
});
