import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchPage from '../../pages/SearchPage';

vi.mock('../../components/Sidebar', () => ({
    default: () => <aside data-testid="sidebar">Sidebar</aside>,
}));

vi.mock('../../components/postcard/Postcard.jsx', () => ({
    default: ({ post }) => (
        <article data-testid="post-card">
            <h2>{post.title}</h2>
            <p>{post.username}</p>
            <div>
                {post.tagNames?.map((tag) => (
                    <span key={tag}>{tag}</span>
                ))}
            </div>
        </article>
    ),
}));

const mockSuccessfulSearchRequests = () => {
    const posts = [
        {
            id: 1,
            userId: 1,
            title: 'React testing post',
            createdAt: '2024-02-01T10:00:00',
            tagNames: ['react', 'frontend'],
        },
        {
            id: 2,
            userId: 2,
            title: 'Spring Boot backend',
            createdAt: '2024-01-01T10:00:00',
            tagNames: ['java', 'backend'],
        },
        {
            id: 3,
            userId: 1,
            title: 'My profile update',
            createdAt: '2024-03-01T10:00:00',
            tagNames: ['personal'],
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

    const comments = [];

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

        if (url === 'http://localhost:9090/comments') {
            return Promise.resolve({
                ok: true,
                json: async () => comments,
            });
        }

        return Promise.reject(new Error(`Unhandled request: ${url}`));
    });

    vi.stubGlobal('fetch', fetchMock);

    return fetchMock;
};

describe('SearchPage', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('shows an error when the user is not logged in', async () => {
        render(<SearchPage />);

        expect(await screen.findByText(/you are not logged in/i)).toBeInTheDocument();
    });

    it('loads and displays posts', async () => {
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('userId', '1');

        mockSuccessfulSearchRequests();

        render(<SearchPage />);

        expect(await screen.findByText('React testing post')).toBeInTheDocument();
        expect(screen.getByText('Spring Boot backend')).toBeInTheDocument();
        expect(screen.getByText('My profile update')).toBeInTheDocument();
    });

    it('filters posts by search text', async () => {
        const user = userEvent.setup();

        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('userId', '1');

        mockSuccessfulSearchRequests();

        render(<SearchPage />);

        const searchInput = await screen.findByPlaceholderText(/search by title, username or tag/i);

        await user.type(searchInput, 'react');

        expect(screen.getByText('React testing post')).toBeInTheDocument();
        expect(screen.queryByText('Spring Boot backend')).not.toBeInTheDocument();
        expect(screen.queryByText('My profile update')).not.toBeInTheDocument();
    });

    it('filters posts to show only current user posts', async () => {
        const user = userEvent.setup();

        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('userId', '1');

        mockSuccessfulSearchRequests();

        render(<SearchPage />);

        const onlyMineCheckbox = await screen.findByRole('checkbox', {
            name: /show only my posts/i,
        });

        await user.click(onlyMineCheckbox);

        const postCards = screen.getAllByTestId('post-card');

        expect(postCards).toHaveLength(2);
        expect(within(postCards[0]).getByText('My profile update')).toBeInTheDocument();
        expect(within(postCards[1]).getByText('React testing post')).toBeInTheDocument();
        expect(screen.queryByText('Spring Boot backend')).not.toBeInTheDocument();
    });

    it('clears active filters', async () => {
        const user = userEvent.setup();

        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('userId', '1');

        mockSuccessfulSearchRequests();

        render(<SearchPage />);

        const searchInput = await screen.findByPlaceholderText(/search by title, username or tag/i);

        await user.type(searchInput, 'react');

        expect(screen.getByText('React testing post')).toBeInTheDocument();
        expect(screen.queryByText('Spring Boot backend')).not.toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: /clear filters/i }));

        expect(screen.getByText('React testing post')).toBeInTheDocument();
        expect(screen.getByText('Spring Boot backend')).toBeInTheDocument();
        expect(screen.getByText('My profile update')).toBeInTheDocument();
    });
});