import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Posts from './Posts';

test('renders the Posts component', () => {
  const { getByTestId } = render(
    <MemoryRouter>
      <Posts />
    </MemoryRouter>
  );

  expect(getByTestId('posts-test')).toBeInTheDocument();
});
