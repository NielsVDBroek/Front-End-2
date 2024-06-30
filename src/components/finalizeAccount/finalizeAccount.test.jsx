import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FinalizeAccount from './FinalizeAccount';

test('renders the FinalizeAccount component', () => {
  const { getByTestId } = render(
    <MemoryRouter>
      <FinalizeAccount />
    </MemoryRouter>
  );

  expect(getByTestId('finalize-test')).toBeInTheDocument();
});
