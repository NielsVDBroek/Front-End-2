import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ViewAccount from './ViewAccount';

test('renders the ViewAccount component', () => {
  const { getByTestId } = render(
    <MemoryRouter>
      <ViewAccount />
    </MemoryRouter>
  );

  expect(getByTestId('viewaccount-test')).toBeInTheDocument();
});
