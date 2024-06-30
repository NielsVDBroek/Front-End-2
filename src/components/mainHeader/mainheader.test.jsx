import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MainHeader from './MainHeader';

test('renders the MainHeader component', () => {
  const { getByTestId } = render(
    <MemoryRouter>
      <MainHeader />
    </MemoryRouter>
  );

  expect(getByTestId('header-test')).toBeInTheDocument();
});
