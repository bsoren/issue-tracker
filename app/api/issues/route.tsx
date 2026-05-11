import { NextRequest, NextResponse } from "next/server";
import CreateIssueSchema from "./schema";
import { prisma } from "@/lib/prisma";


export async function POST(request: NextRequest) {
    const body = await request.json();
    const validation = CreateIssueSchema.safeParse(body);

    if (!validation.success) {
        console.log('Validation error occured')
        return NextResponse.json(
            validation.error.format(),
            { status: 400 }
        );
    }

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