import {z} from 'zod'

const IssueSchema = z.object({
    title: z.string().min(3).max(255),
    description: z.string().min(3)
})

export default IssueSchema