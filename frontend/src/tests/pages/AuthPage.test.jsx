import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import AuthPage from '../../pages/AuthPage'

describe('AuthPage', () => {
    it('shows the login form by default', () => {
        const { container } = render(
            <MemoryRouter>
                <AuthPage />
            </MemoryRouter>
        )

        const switchButtons = container.querySelector('.switch-buttons'); // selectez clasa switch-buttons unde se afla cele 2 butoane de switch formulare login/register

        expect(screen.getByRole('heading', { name: /instagram clone/i })).toBeInTheDocument();
        expect(screen.getByText(/login to your account/i)).toBeInTheDocument();
        expect(within(switchButtons).getByRole('button', { name: /^login$/i })).toBeInTheDocument();
    })

    it('switches from login mode to register mode', async () => {
        const user = userEvent.setup(); //fake user care simuleaza actiuni de click

        const { container } = render(
            <MemoryRouter>
                <AuthPage />
            </MemoryRouter>
        )

        const switchButtons = container.querySelector('.switch-buttons');
        const registerSwitchButton = within(switchButtons).getByRole('button', { name: /^register$/i });

        await user.click(registerSwitchButton);

        expect(screen.getByText(/create a new account/i)).toBeInTheDocument();
    })
})