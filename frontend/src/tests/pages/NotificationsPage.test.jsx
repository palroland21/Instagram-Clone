import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import NotificationsPage from '../../pages/notification-page/NotificationsPage';

vi.mock('../../components/Sidebar', () => ({
    default: () => <aside data-testid="sidebar">Sidebar</aside>,
}));

const mockNotificationsRequests = ({
                                       posts = [],
                                       comments = [],
                                       postVotes = [],
                                       users = [],
                                   } = {}) => {
    const fetchMock = vi.fn((url) => {
        if (url === 'http://localhost:9090/posts?currentUserId=1') {
            return Promise.resolve({
                ok: true,
                json: async () => posts,
            });
        }

        if (url === 'http://localhost:9090/comments') {
            return Promise.resolve({
                ok: true,
                json: async () => comments,
            });
        }

        if (url === 'http://localhost:9090/post-votes') {
            return Promise.resolve({
                ok: true,
                json: async () => postVotes,
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

    return fetchMock;
};

describe('NotificationsPage', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('shows an error when the user is not logged in', async () => {
        render(<NotificationsPage />);

        expect(await screen.findByText(/you are not logged in/i)).toBeInTheDocument();
    });

    it('shows an empty state when the current user has no notifications', async () => {
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('userId', '1');

        mockNotificationsRequests({
            posts: [
                {
                    id: 1,
                    userId: 1,
                    title: 'My empty post',
                    createdAt: new Date().toISOString(),
                },
            ],
            comments: [],
            postVotes: [],
            users: [
                {
                    id: 1,
                    username: 'vasi',
                    profilePicture: '',
                },
            ],
        });

        render(<NotificationsPage />);

        expect(await screen.findByText(/no notifications yet/i)).toBeInTheDocument();
    });

    it('loads and displays comment, like and dislike notifications for current user posts', async () => {
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('userId', '1');

        const now = Date.now();

        const posts = [
            {
                id: 1,
                userId: 1,
                title: 'My React post',
                createdAt: new Date(now - 1000 * 60 * 60).toISOString(),
            },
            {
                id: 2,
                userId: 2,
                title: 'Other user post',
                createdAt: new Date(now - 1000 * 60 * 60).toISOString(),
            },
        ];

        const comments = [
            {
                id: 1,
                postId: 1,
                userId: 2,
                text: 'Great post!',
                postedAt: new Date(now - 1000 * 60 * 10).toISOString(),
            },
            {
                id: 2,
                postId: 2,
                userId: 3,
                text: 'This should not appear',
                postedAt: new Date(now - 1000 * 60 * 5).toISOString(),
            },
            {
                id: 3,
                postId: 1,
                userId: 1,
                text: 'Own comment should not appear',
                postedAt: new Date(now - 1000 * 60 * 3).toISOString(),
            },
        ];

        const postVotes = [
            {
                id: 1,
                postId: 1,
                userId: 3,
                voteType: 'LIKE',
                createdAt: new Date(now - 1000 * 60 * 8).toISOString(),
            },
            {
                id: 2,
                postId: 1,
                userId: 2,
                voteType: 'DISLIKE',
                createdAt: new Date(now - 1000 * 60 * 7).toISOString(),
            },
            {
                id: 3,
                postId: 1,
                userId: 1,
                voteType: 'LIKE',
                createdAt: new Date(now - 1000 * 60 * 6).toISOString(),
            },
            {
                id: 4,
                postId: 2,
                userId: 3,
                voteType: 'LIKE',
                createdAt: new Date(now - 1000 * 60 * 4).toISOString(),
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

        const fetchMock = mockNotificationsRequests({
            posts,
            comments,
            postVotes,
            users,
        });

        render(<NotificationsPage />);

        expect(await screen.findByText('Notifications')).toBeInTheDocument();

        expect(screen.getAllByText('ana')).toHaveLength(2);
        expect(screen.getByText(/commented on your post/i)).toBeInTheDocument();
        expect(screen.getByText(/Great post!/i)).toBeInTheDocument();

        expect(screen.getByText('mihai')).toBeInTheDocument();
        expect(screen.getAllByText(/liked your post/i)).toHaveLength(2);

        expect(screen.getByText(/disliked your post/i)).toBeInTheDocument();

        expect(screen.getAllByText(/My React post/i).length).toBeGreaterThanOrEqual(3);
        expect(screen.queryByText(/Other user post/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/This should not appear/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Own comment should not appear/i)).not.toBeInTheDocument();

        expect(fetchMock).toHaveBeenCalledWith(
            'http://localhost:9090/posts?currentUserId=1',
            {
                headers: {
                    Authorization: 'Bearer fake-token',
                },
            }
        );

        expect(fetchMock).toHaveBeenCalledWith(
            'http://localhost:9090/comments',
            {
                headers: {
                    Authorization: 'Bearer fake-token',
                },
            }
        );

        expect(fetchMock).toHaveBeenCalledWith(
            'http://localhost:9090/post-votes',
            {
                headers: {
                    Authorization: 'Bearer fake-token',
                },
            }
        );

        expect(fetchMock).toHaveBeenCalledWith(
            'http://localhost:9090/users',
            {
                headers: {
                    Authorization: 'Bearer fake-token',
                },
            }
        );
    });

    it('groups notifications into Today, This week and Older sections', async () => {
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('userId', '1');

        const now = Date.now();

        mockNotificationsRequests({
            posts: [
                {
                    id: 1,
                    userId: 1,
                    title: 'Grouped post',
                    createdAt: new Date(now).toISOString(),
                },
            ],
            comments: [
                {
                    id: 1,
                    postId: 1,
                    userId: 2,
                    text: 'Today comment',
                    postedAt: new Date(now - 1000 * 60 * 30).toISOString(),
                },
                {
                    id: 2,
                    postId: 1,
                    userId: 3,
                    text: 'This week comment',
                    postedAt: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
                },
                {
                    id: 3,
                    postId: 1,
                    userId: 4,
                    text: 'Older comment',
                    postedAt: new Date(now - 1000 * 60 * 60 * 24 * 10).toISOString(),
                },
            ],
            postVotes: [],
            users: [
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
                {
                    id: 4,
                    username: 'dan',
                    profilePicture: '',
                },
            ],
        });

        render(<NotificationsPage />);

        const todaySection = await screen.findByRole('heading', { name: /today/i });
        const thisWeekSection = screen.getByRole('heading', { name: /this week/i });
        const olderSection = screen.getByRole('heading', { name: /older/i });

        expect(todaySection).toBeInTheDocument();
        expect(thisWeekSection).toBeInTheDocument();
        expect(olderSection).toBeInTheDocument();

        expect(screen.getByText(/Today comment/i)).toBeInTheDocument();
        expect(screen.getByText(/This week comment/i)).toBeInTheDocument();
        expect(screen.getByText(/Older comment/i)).toBeInTheDocument();
    });

    it('marks notifications as seen in localStorage and dispatches the seen event', async () => {
        const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('userId', '1');

        const latestDate = new Date().toISOString();

        mockNotificationsRequests({
            posts: [
                {
                    id: 1,
                    userId: 1,
                    title: 'Seen post',
                    createdAt: latestDate,
                },
            ],
            comments: [
                {
                    id: 1,
                    postId: 1,
                    userId: 2,
                    text: 'Seen comment',
                    postedAt: latestDate,
                },
            ],
            postVotes: [],
            users: [
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
            ],
        });

        render(<NotificationsPage />);

        expect(await screen.findByText(/Seen comment/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(localStorage.getItem('notifications_last_seen_user_1')).not.toBeNull();
        });

        expect(Number(localStorage.getItem('notifications_last_seen_user_1'))).toBe(
            new Date(latestDate).getTime()
        );

        expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Event));
        expect(dispatchSpy.mock.calls.some(([event]) => event.type === 'notifications-seen')).toBe(true);

        dispatchSpy.mockRestore();
    });

    it('shows a loading error when one of the notification requests fails', async () => {
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('userId', '1');

        const fetchMock = vi.fn((url) => {
            if (url === 'http://localhost:9090/posts?currentUserId=1') {
                return Promise.resolve({
                    ok: false,
                    json: async () => [],
                });
            }

            if (url === 'http://localhost:9090/comments') {
                return Promise.resolve({
                    ok: true,
                    json: async () => [],
                });
            }

            if (url === 'http://localhost:9090/post-votes') {
                return Promise.resolve({
                    ok: true,
                    json: async () => [],
                });
            }

            if (url === 'http://localhost:9090/users') {
                return Promise.resolve({
                    ok: true,
                    json: async () => [],
                });
            }

            return Promise.reject(new Error(`Unhandled request: ${url}`));
        });

        vi.stubGlobal('fetch', fetchMock);

        render(<NotificationsPage />);

        expect(await screen.findByText(/could not load notifications/i)).toBeInTheDocument();
    });
});