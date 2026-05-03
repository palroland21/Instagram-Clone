import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Sidebar from '../../components/Sidebar';

const mockNavigate = vi.hoisted(() => vi.fn());

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');

    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('../../components/create-post/CreatePostModal.jsx', () => ({
    default: ({ onClose, onPostCreated }) => (
        <div data-testid="create-post-modal">
            <p>Create post modal</p>

            <button type="button" onClick={onClose}>
                Close modal
            </button>

            <button type="button" onClick={() => onPostCreated?.({ id: 10 })}>
                Simulate post created
            </button>
        </div>
    ),
}));

vi.mock('../../pages/notification-page/notification-page-components/notificationsApi', () => ({
    fetchNotificationsData: vi.fn().mockResolvedValue({
        postsData: [],
        commentsData: [],
        postVotesData: [],
        usersData: [],
    }),
}));

describe('Sidebar', () => {
    beforeEach(() => {
        localStorage.clear();
        mockNavigate.mockClear();
        vi.clearAllMocks();

        const fetchMock = vi.fn((url) => {
            if (url === 'http://localhost:9090/users') {
                return Promise.resolve({
                    ok: true,
                    json: async () => [
                        {
                            id: 1,
                            username: 'vasi',
                            profilePicture: '',
                        },
                    ],
                });
            }

            return Promise.resolve({
                ok: true,
                json: async () => [],
            });
        });

        vi.stubGlobal('fetch', fetchMock);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('renders the desktop sidebar navigation items', () => {
        render(
            <Sidebar
                activeItem="home"
                setActiveItem={vi.fn()}
                isMobile={false}
            />
        );

        expect(screen.getByText('Instagram')).toBeInTheDocument();

        expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /messages/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /notification/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /profile/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
    });

    it('navigates to Search and Profile when clicking sidebar items', async () => {
        const user = userEvent.setup();
        const setActiveItem = vi.fn();

        render(
            <Sidebar
                activeItem="home"
                setActiveItem={setActiveItem}
                isMobile={false}
            />
        );

        await user.click(screen.getByRole('button', { name: /search/i }));

        expect(setActiveItem).toHaveBeenCalledWith('search');
        expect(mockNavigate).toHaveBeenCalledWith('/search');

        await user.click(screen.getByRole('button', { name: /profile/i }));

        expect(setActiveItem).toHaveBeenCalledWith('profile');
        expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });

    it('opens and closes the create post modal', async () => {
        const user = userEvent.setup();

        render(
            <Sidebar
                activeItem="home"
                setActiveItem={vi.fn()}
                isMobile={false}
            />
        );

        await user.click(screen.getByRole('button', { name: /create/i }));

        expect(screen.getByTestId('create-post-modal')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: /close modal/i }));

        expect(screen.queryByTestId('create-post-modal')).not.toBeInTheDocument();
    });

    it('logs out the user and redirects to login', async () => {
        const user = userEvent.setup();

        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('userId', '1');

        render(
            <Sidebar
                activeItem="home"
                setActiveItem={vi.fn()}
                isMobile={false}
            />
        );

        await user.click(screen.getByRole('button', { name: /log out/i }));

        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('userId')).toBeNull();
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});