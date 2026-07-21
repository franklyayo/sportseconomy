import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { eventId, userId } = await request.json();

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    // Mock userId if not provided (pre-deployment testing)
    const activeUserId = userId || "mock-user-123";

    // Write to database
    const registration = await prisma.eventRegistration.create({
      data: {
        eventId,
        userId: activeUserId,
        status: "Confirmed"
      }
    });

    return NextResponse.json({ success: true, registration }, { status: 201 });
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: 'Failed to register for event' }, { status: 500 });
  }
}
