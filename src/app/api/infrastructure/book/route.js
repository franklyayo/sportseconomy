import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { facilityId, userId, date } = await request.json();

    if (!facilityId) {
      return NextResponse.json({ error: 'Facility ID is required' }, { status: 400 });
    }

    const activeUserId = userId || "mock-user-123";
    const bookingDate = date ? new Date(date) : new Date();
    // Default to 2 hour booking
    const endDate = new Date(bookingDate.getTime() + 2 * 60 * 60 * 1000); 

    // Write to database
    const booking = await prisma.facilityBooking.create({
      data: {
        facilityId,
        userId: activeUserId,
        startDate: bookingDate,
        endDate: endDate,
        status: "Pending" // Require admin approval
      }
    });

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    console.error("Booking Error:", error);
    return NextResponse.json({ error: 'Failed to book facility' }, { status: 500 });
  }
}
