import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import Feed from '../../components/Feed';

vi.mock('../../components/postcard/Postcard.jsx', () => ({
    default: ({ post }) => (
        <article data-testid="post-card">
            <h2>{post.title}</h2>
            <p>{post.username}</p>
            <span data-testid={`vote-count-${post.id}`}>{post.voteCount}</span>

            <div data-testid={`comments-${post.id}`}>
                {post.comments?.map((comment) => (
                    <p key={comment.id}>{comment.text}</p>
                ))}
            </div>
        </article>
    ),
}));

describe('Feed', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('shows an error when the user is not logged in', async () => {
        render(<Feed />);

        expect(await screen.findByText(/you are not logged in/i)).toBeInTheDocument();
    });

    it('loads posts and displays them from newest to oldest', async () => {
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('userId', '1');

        const posts = [
            {
                id: 1,
                userId: 1,
                title: 'Old post',
                createdAt: '2024-01-01T10:00:00',
                voteCount: 2,
                comments: [],
            },
            {
                id: 2,
                userId: 2,
                title: 'New post',
                createdAt: '2024-02-01T10:00:00',
                voteCount: 5,
                comments: [],
            },
        ];

        const users = [
            {
                id: 1,
                username: 'vasi',
                profilePicture: '',
            },
            {
                id: 2,
                username: 'ana',
                profilePicture: '',
            },
        ];

        const fetchMock = vi.fn((url) => {
            if (url === 'http://localhost:9090/posts?currentUserId=1') {
                return Promise.resolve({
                    ok: true,
                    json: async () => posts,
                });
            }

            if (url === 'http://localhost:9090/users') {
                return Promise.resolve({
                    ok: true,
                    json: async () => users,
                });
            }

            return Promise.reject(new Error(`Unhandled request: ${url}`));
        });

        vi.stubGlobal('fetch', fetchMock);

        render(<Feed />);

        const postCards = await screen.findAllByTestId('post-card');

        expect(postCards).toHaveLength(2);
        expect(within(postCards[0]).getByText('New post')).toBeInTheDocument();
        expect(within(postCards[1]).getByText('Old post')).toBeInTheDocument();
    });

    it('sorts comments by vote count in descending order', async () => {
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('userId', '1');

        const posts = [
            {
                id: 1,
                userId: 1,
                title: 'Post with comments',
                createdAt: '2024-01-01T10:00:00',
                voteCount: 0,
                comments: [
                    {
                        id: 1,
                        userId: 2,
                        text: 'Low voted comment',
                        voteCount: 1,
                        postedAt: '2024-01-01T11:00:00',
                    },
                    {
                        id: 2,
                        userId: 3,
                        text: 'High voted comment',
                        voteCount: 10,
                        postedAt: '2024-01-01T12:00:00',
                    },
                ],
            },
        ];

        const users = [
            {
                id: 1,
                username: 'vasi',
                profilePicture: '',
            },
            {
                id: 2,
                username: 'ana',
                profilePicture: '',
            },
            {
                id: 3,
                username: 'mihai',
                profilePicture: '',
            },
        ];

        const fetchMock = vi.fn((url) => {
            if (url === 'http://localhost:9090/posts?currentUserId=1') {
                return Promise.resolve({
                    ok: true,
                    json: async () => posts,
                });
            }

            if (url === 'http://localhost:9090/users') {
                return Promise.resolve({
                    ok: true,
                    json: async () => users,
                });
            }

            return Promise.reject(new Error(`Unhandled request: ${url}`));
        });

        vi.stubGlobal('fetch', fetchMock);

        render(<Feed />);

        const commentsContainer = await screen.findByTestId('comments-1');
        const comments = within(commentsContainer).getAllByText(/voted comment/i);

        expect(comments[0]).toHaveTextContent('High voted comment');
        expect(comments[1]).toHaveTextContent('Low voted comment');
    });
});