import { NextRequest, NextResponse } from "next/server";
import IssueSchema from "./schema";
import { prisma } from "@/lib/prisma";


export async function POST(request: NextRequest) {
    const body = await request.json();
    const validation = IssueSchema.safeParse(body);

    if (!validation.success)
        return NextResponse.json(
            { error: validation.error.errors },
            { status: 400 }
        );

    const createdIssue = await prisma.issue.create({
        data: {
            title: body.title,
            description: body.description
        }
    })

    return NextResponse.json(
        createdIssue,
        { status: 201 }
    );
}