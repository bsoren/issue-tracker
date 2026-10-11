import authOptions from "@/app/auth/authOptions";
import { prisma } from "@/lib/prisma";
import delay from "delay";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { UpdateIssueSchema } from "../schema";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ issueId: string }> },
) {
  const { issueId } = await params;
  const id = Number(issueId);
  if (!Number.isInteger(id) || id < 1)
    return NextResponse.json(
      { error: `Invalid issue id: ${issueId}` },
      { status: 404 },
    );

  const retrievedIssue = await prisma.issue.findUnique({
    where: { id },
  });

  if (!retrievedIssue)
    return NextResponse.json(
      { error: `Issue not found: ${issueId}` },
      { status: 404 },
    );

  return NextResponse.json(retrievedIssue);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ issueId: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  const { issueId } = await params;
  const id = Number(issueId);
  if (!Number.isInteger(id) || id < 1)
    return NextResponse.json(
      { error: `Invalid issue id: ${issueId}` },
      { status: 404 },
    );

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body" },
      { status: 400 },
    );
  }

  const validation = UpdateIssueSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  const retrievedIssue = await prisma.issue.findUnique({
    where: { id },
  });

  if (!retrievedIssue)
    return NextResponse.json(
      { error: `Issue not found: ${issueId}` },
      { status: 404 },
    );

  const updated = await prisma.issue.update({
    where: { id },
    data: validation.data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ issueId: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  await delay(1000);
  const { issueId } = await params;

  let retrievedIssue = await prisma.issue.findUnique({
    where: { id: parseInt(issueId) },
  });

  if (!retrievedIssue)
    return NextResponse.json({ error: "Invalid issue" }, { status: 404 });

  retrievedIssue = await prisma.issue.delete({
    where: { id: retrievedIssue.id },
  });

  return NextResponse.json(retrievedIssue);
}
