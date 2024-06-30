import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Content from './Content';

test('renders the Content component', () => {
  const { getByTestId } = render(
    <MemoryRouter>
      <Content />
    </MemoryRouter>
  );

  expect(getByTestId('content-test')).toBeInTheDocument();
});
