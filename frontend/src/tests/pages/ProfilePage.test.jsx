import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfilePage from '../../pages/profile-page/ProfilePage.jsx';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');

    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('../../components/CreatePostModal', () => ({
    default: () => <div data-testid="create-post-modal">Create post modal</div>,
}));

const createFakeJwt = (username) => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ sub: username }));

    return `${header}.${payload}.fake-signature`;
};

const mockSuccessfulProfileRequests = () => {
    const users = [
        {
            id: 1,
            username: 'vasi',
            fullName: 'Vasi Test',
            bio: 'Computer Science student',
            email: 'vasi@test.com',
            profilePicture: '',
        },
        {
            id: 2,
            username: 'ana',
            fullName: 'Ana Pop',
            bio: '',
            email: 'ana@test.com',
            profilePicture: '',
        },
    ];

    const posts = [
        {
            id: 1,
            userId: 1,
            title: 'Old profile post',
            createdAt: '2024-01-01T10:00:00',
            pictureUrl: '',
        },
        {
            id: 2,
            userId: 2,
            title: 'Other user post',
            createdAt: '2024-03-01T10:00:00',
            pictureUrl: '',
        },
        {
            id: 3,
            userId: 1,
            title: 'New profile post',
            createdAt: '2024-04-01T10:00:00',
            pictureUrl: '',
        },
    ];

    const followers = [
        {
            id: 2,
            username: 'ana',
            fullName: 'Ana Pop',
        },
    ];

    const following = [
        {
            id: 2,
            username: 'ana',
            fullName: 'Ana Pop',
        },
    ];

    const fetchMock = vi.fn((url) => {
        if (url === 'http://localhost:9090/users') {
            return Promise.resolve({
                ok: true,
                json: async () => users,
            });
        }

        if (url === 'http://localhost:9090/posts') {
            return Promise.resolve({
                ok: true,
                json: async () => posts,
            });
        }

        if (url === 'http://localhost:9090/users/1/followers') {
            return Promise.resolve({
                ok: true,
                json: async () => followers,
            });
        }

        if (url === 'http://localhost:9090/users/1/following') {
            return Promise.resolve({
                ok: true,
                json: async () => following,
            });
        }

        return Promise.reject(new Error(`Unhandled request: ${url}`));
    });

    vi.stubGlobal('fetch', fetchMock);

    return fetchMock;
};

describe('ProfilePage', () => {
    beforeEach(() => {
        localStorage.clear();
        mockNavigate.mockClear();
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('redirects to login when there is no token', () => {
        render(<ProfilePage />);

        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('loads and displays the current user profile', async () => {
        const token = createFakeJwt('vasi');

        localStorage.setItem('token', token);

        mockSuccessfulProfileRequests();

        render(<ProfilePage />);

        expect(await screen.findByText('vasi')).toBeInTheDocument();
        expect(screen.getByText('Vasi Test')).toBeInTheDocument();
        expect(screen.getByText('Computer Science student')).toBeInTheDocument();

        expect(await screen.findByText('followers')).toBeInTheDocument();
        expect(await screen.findByText('following')).toBeInTheDocument();

        const countElements = screen.getAllByText('1');

        expect(countElements.length).toBeGreaterThanOrEqual(2);
    });

    it('shows only the posts created by the current user', async () => {
        const token = createFakeJwt('vasi');

        localStorage.setItem('token', token);

        mockSuccessfulProfileRequests();

        render(<ProfilePage />);

        expect(await screen.findByText('New profile post')).toBeInTheDocument();
        expect(screen.getByText('Old profile post')).toBeInTheDocument();
        expect(screen.queryByText('Other user post')).not.toBeInTheDocument();
    });

    it('opens the edit profile modal', async () => {
        const user = userEvent.setup();
        const token = createFakeJwt('vasi');

        localStorage.setItem('token', token);

        mockSuccessfulProfileRequests();

        render(<ProfilePage />);

        const editProfileButton = await screen.findByRole('button', { name: /edit profile/i });

        await user.click(editProfileButton);

        expect(screen.getAllByText(/edit profile/i)).toHaveLength(2);
        expect(screen.getByDisplayValue('vasi')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Vasi Test')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Computer Science student')).toBeInTheDocument();
    });
});