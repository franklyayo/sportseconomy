import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Ensure this route is never statically generated during build time
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const payload = await request.json();
    console.log("Neon Webhook Received:", JSON.stringify(payload, null, 2));

    // Determine the event type if the webhook wraps the payload
    const eventType = payload.type || payload.event;
    
    // We ideally only want to process user creation/update events.
    // If the webhook sends other events (like OTP sends) we can safely ignore them.
    if (eventType && !(eventType.includes('user') || eventType.includes('created') || eventType.includes('signup'))) {
      console.log(`Ignoring non-user event: ${eventType}`);
      return NextResponse.json({ message: "Event ignored" }, { status: 200 });
    }

    // Extract the user data regardless of how Neon wraps the payload
    const userData = payload.data?.user || payload.user || payload.data || payload;

    const { id, email } = userData;

    if (!id || !email) {
      console.error("Webhook payload is missing required 'id' or 'email' fields:", userData);
      return NextResponse.json({ error: "Missing user ID or email in payload" }, { status: 400 });
    }

    // Extract metadata (NIN, role, name) which might be nested depending on the auth provider
    const metadata = userData.user_metadata || userData.raw_user_meta_data || userData.metadata || userData;
    
    const name = metadata.name || userData.name || "Unknown User";
    const role = metadata.role || userData.role || "Fan"; // Fallback role
    const nin = metadata.nin || userData.nin || null;

    // Sync the user to our Prisma database using upsert
    // Upsert ensures we create the user if they don't exist, or update them if they do.
    const user = await prisma.user.upsert({
      where: { id: String(id) },
      update: {
        email: String(email),
        name: String(name),
        role: String(role),
        nin: nin ? String(nin) : null,
      },
      create: {
        id: String(id),
        email: String(email),
        name: String(name),
        role: String(role),
        nin: nin ? String(nin) : null,
      }
    });

    console.log(`Successfully synced user ${id} to database.`);
    return NextResponse.json({ success: true, user }, { status: 200 });

  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
