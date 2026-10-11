import { z } from 'zod'
import { Status } from '@/generated/prisma/enums'

const CreateIssueSchema = z.object({
    title: z.string().min(3).max(255),
    description: z.string().min(3)
})

export default CreateIssueSchema

export const UpdateIssueSchema = z.strictObject({
    title: z.string().min(3).max(255),
    description: z.string().min(3).max(65535),
    status: z.enum(Status),
    assignedToUserId: z.string().min(1).nullable()
}).partial().refine(
    (data) => Object.keys(data).length > 0,
    { message: 'Provide at least one of title, description, assignee or status' },
)
