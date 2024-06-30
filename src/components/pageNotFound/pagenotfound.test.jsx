import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PageNotFound from './PageNotFound';

test('renders the PageNotFound component', () => {
  const { getByTestId } = render(
    <MemoryRouter>
      <PageNotFound />
    </MemoryRouter>
  );

  expect(getByTestId('pagenotfound-test')).toBeInTheDocument();
});
