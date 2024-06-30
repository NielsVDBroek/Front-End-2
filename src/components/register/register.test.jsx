import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from './Register';

test('renders the Register component', () => {
  const { getByTestId } = render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );

  expect(getByTestId('register-test')).toBeInTheDocument();
});
