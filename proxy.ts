import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { NextRequest } from 'next/server'

export async function proxy(req: NextRequest) {
  let res = NextResponse.next({ request: req })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            req.cookies.set(name, value)
          })

          res = NextResponse.next({ request: req })

          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const isLoginPage = req.nextUrl.pathname === '/admin/login'

  // La page de connexion reste accessible sans session.
  if (isLoginPage) {
    return res
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  // Un visiteur non connecté doit se connecter.
  if (error || !user) {
    const redirectResponse = NextResponse.redirect(
      new URL('/admin/login', req.url)
    )

    res.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie)
    })

    return redirectResponse
  }

  // Seul le compte administrateur autorisé peut accéder aux pages admin.
  const adminUserId = process.env.ADMIN_USER_ID

  if (!adminUserId || user.id !== adminUserId) {
    const redirectResponse = NextResponse.redirect(new URL('/', req.url))

    res.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie)
    })

    return redirectResponse
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*'],
}
