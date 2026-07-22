import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, name, nin, role } = body;

    const authUrl = process.env.NEXT_PUBLIC_NEON_AUTH_URL;
    if (!authUrl) {
      return NextResponse.json({ error: "Auth URL not configured" }, { status: 500 });
    }

    // Call Neon Auth (Better Auth) with ONLY the allowed base fields.
    // We do NOT pass role here because it triggers a 400 Bad Request error
    // in default Better Auth installations.
    const response = await fetch(`${authUrl}/sign-up/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        name
      }),
    });

    const text = await response.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      console.error("Failed to parse Auth server response:", text);
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || data.msg || `Signup failed (HTTP ${response.status})` },
        { status: response.status }
      );
    }

    // If signup is successful, we get the user object containing the new ID.
    const userId = data.user?.id;

    if (userId) {
      // Upsert the user into our Prisma database to manually save the custom
      // role and nin fields that Neon Auth wouldn't accept directly.
      await prisma.user.upsert({
        where: { id: userId },
        update: {
          email,
          name,
          role: role || "Athlete",
          nin: nin || null,
        },
        create: {
          id: userId,
          email,
          name,
          role: role || "Athlete",
          nin: nin || null,
        }
      });
    }

    // Return the successful response back to the client
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Signup API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
