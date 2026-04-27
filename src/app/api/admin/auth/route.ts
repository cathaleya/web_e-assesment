import { NextResponse } from 'next/server';

// Admin credentials from environment variables with fallback defaults
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin.hdap';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Faithbless21';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password wajib diisi.' }, { status: 400 });
    }

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json({ error: 'Username atau password salah.' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
