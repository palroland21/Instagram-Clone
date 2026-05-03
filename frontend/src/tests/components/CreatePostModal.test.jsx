import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreatePostModal from '../../components/create-post/CreatePostModal';

const createImageFile = () => {
    return new File(['fake-image-content'], 'test-image.png', {
        type: 'image/png',
    });
};

const selectImage = (container) => {
    const fileInput = container.querySelector('input[type="file"]');
    const file = createImageFile();

    fireEvent.change(fileInput, {
        target: {
            files: [file],
        },
    });

    return file;
};

describe('CreatePostModal', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('renders the initial upload screen', () => {
        const onClose = vi.fn();
        const onPostCreated = vi.fn();

        render(
            <CreatePostModal
                onClose={onClose}
                onPostCreated={onPostCreated}
            />
        );

        expect(screen.getByText(/create new post/i)).toBeInTheDocument();
        expect(screen.getByText(/drag photos here/i)).toBeInTheDocument();
        expect(screen.getByText(/you can add multiple images/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /select from computer/i })).toBeInTheDocument();
    });

    it('shows post details fields after selecting an image', async () => {
        const onClose = vi.fn();
        const onPostCreated = vi.fn();

        const { container } = render(
            <CreatePostModal
                onClose={onClose}
                onPostCreated={onPostCreated}
            />
        );

        selectImage(container);

        expect(await screen.findByPlaceholderText(/write a caption/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/add tags/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/add location/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /^post$/i })).toBeInTheDocument();
    });

    it('allows the user to type post details after selecting an image', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        const onPostCreated = vi.fn();

        const { container } = render(
            <CreatePostModal
                onClose={onClose}
                onPostCreated={onPostCreated}
            />
        );

        selectImage(container);

        const captionInput = await screen.findByPlaceholderText(/write a caption/i);
        const tagsInput = screen.getByPlaceholderText(/add tags/i);
        const locationInput = screen.getByPlaceholderText(/add location/i);

        await user.type(captionInput, 'This is a test post.');
        await user.type(tagsInput, 'react');
        await user.keyboard('{Enter}');
        await user.type(locationInput, 'Cluj-Napoca');

        expect(captionInput).toHaveValue('This is a test post.');
        expect(screen.getByText('#react')).toBeInTheDocument();
        expect(locationInput).toHaveValue('Cluj-Napoca');
    });

    it('submits post data to the backend', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        const onPostCreated = vi.fn();

        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('userId', '1');

        const fetchMock = vi.fn((url) => {
            if (url === 'http://localhost:9090/uploads/image') {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({
                        url: 'uploaded-image-url.png',
                    }),
                });
            }

            if (url === 'http://localhost:9090/posts') {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({
                        id: 10,
                        userId: 1,
                        pictureUrls: ['uploaded-image-url.png'],
                        caption: 'This is a test post.',
                        location: 'Cluj-Napoca',
                        tagNames: ['react'],
                    }),
                });
            }

            return Promise.reject(new Error(`Unhandled request: ${url}`));
        });

        vi.stubGlobal('fetch', fetchMock);

        const { container } = render(
            <CreatePostModal
                onClose={onClose}
                onPostCreated={onPostCreated}
            />
        );

        selectImage(container);

        await user.type(await screen.findByPlaceholderText(/write a caption/i), 'This is a test post.');
        await user.type(screen.getByPlaceholderText(/add tags/i), 'react');
        await user.keyboard('{Enter}');
        await user.type(screen.getByPlaceholderText(/add location/i), 'Cluj-Napoca');

        await user.click(screen.getByRole('button', { name: /^post$/i }));

        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledWith(
                'http://localhost:9090/uploads/image',
                expect.objectContaining({
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer fake-token',
                    },
                    body: expect.any(FormData),
                })
            );
        });

        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledWith(
                'http://localhost:9090/posts',
                expect.objectContaining({
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer fake-token',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: 1,
                        pictureUrls: ['uploaded-image-url.png'],
                        caption: 'This is a test post.',
                        location: 'Cluj-Napoca',
                        tagNames: ['react'],
                        title: 'This is a test post.',
                    }),
                })
            );
        });

        expect(onPostCreated).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 10,
                userId: 1,
                caption: 'This is a test post.',
                location: 'Cluj-Napoca',
                tagNames: ['react'],
            })
        );

        expect(onClose).toHaveBeenCalled();
    });
});