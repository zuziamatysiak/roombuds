import { NextResponse, type NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const cookie = req.cookies.get('user')

  // show pages without auth
  if (
    pathname === '/' ||
    pathname.includes('.') || // static files
    pathname === '/login' ||
    pathname === '/signup'
  ) {
    return NextResponse.next()
  }

  if (!cookie) {
    req.nextUrl.pathname = '/login'
    return NextResponse.redirect(req.nextUrl)
  }

  // otherwise the header is present, show page
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)', '/'],
}
