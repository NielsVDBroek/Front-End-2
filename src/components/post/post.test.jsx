// src/components/content/post.test.jsx
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Post from './Post';

// Create a mock post object
const mockPost = {
  id: '1',
  user_id: '123',
  content: 'This is a mock post content',
  file_url: '',
  file_type: '',
};

// Create mock functions for onPostUpdate and onPostDelete
const mockOnPostUpdate = vi.fn();
const mockOnPostDelete = vi.fn();

describe('Post component', () => {
  it('renders the Post component', () => {
    const { getByTestId, getByText } = render(
      <MemoryRouter>
        <Post post={mockPost} onPostUpdate={mockOnPostUpdate} onPostDelete={mockOnPostDelete} />
      </MemoryRouter>
    );

    // Assert that the Post component is rendered
    expect(getByTestId('post-test')).toBeInTheDocument();
    
    // Assert that the post content is rendered
    expect(getByText(mockPost.content)).toBeInTheDocument();
  });
});
