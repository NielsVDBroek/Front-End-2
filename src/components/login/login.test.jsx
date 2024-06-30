import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';

test('renders the Login component', () => {
  const { getByTestId } = render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  expect(getByTestId('login-test')).toBeInTheDocument();
});
