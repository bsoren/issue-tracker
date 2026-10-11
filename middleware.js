import { withAuth } from 'next-auth/middleware'

export default function middleware(request, event) {
    return withAuth(request, event)
}

export const config = {
    matcher: [
        '/issues/new',
        '/issues/:id/edit'
    ]
}
