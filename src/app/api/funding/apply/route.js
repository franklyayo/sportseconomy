import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { fundingId, userId } = await request.json();

    if (!fundingId) {
      return NextResponse.json({ error: 'Funding ID is required' }, { status: 400 });
    }

    const activeUserId = userId || "mock-user-123";

    // Write to database
    const application = await prisma.fundingApplication.create({
      data: {
        fundingId,
        userId: activeUserId,
        status: "Reviewing"
      }
    });

    return NextResponse.json({ success: true, application }, { status: 201 });
  } catch (error) {
    console.error("Application Error:", error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}
