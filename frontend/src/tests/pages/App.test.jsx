import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../../App'

describe('App routing', () => {
    it('renders the authentication page on the root route', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        )
        //testez daca se apeleaza componenta AuthPage dupa ce se randeaza componenta App
        // si daca se afiseaza corect titlul si subtitlul
        expect(screen.getByRole('heading', { name: /instagram clone/i })).toBeInTheDocument();
        expect(screen.getByText(/login to your account/i)).toBeInTheDocument();
    })
})