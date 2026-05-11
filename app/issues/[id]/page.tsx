import IssueStatusBadge from '@/app/components/IssueStatusBadge';
import { prisma } from '@/lib/prisma';
import { Card, Flex, Heading, Text } from '@radix-ui/themes';
import { notFound } from 'next/navigation';
import ReactMarkDown from 'react-markdown'

const IssueDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    // fetch issue
    const issue = await prisma.issue.findUnique({
        where: { 'id': parseInt(id) }
    })

    if (!issue)
        notFound()

    return (
        <div>
            <Heading>{issue.title}</Heading>
            <Flex gap="4" my="2">
                <IssueStatusBadge status={issue.status} />
                <Text>{issue?.createdAt.toLocaleString()}</Text>
            </Flex>

            <Card className='prose' mt="5">
                <ReactMarkDown>{issue.description}</ReactMarkDown>
            </Card>
        </div>
    )
}

export default IssueDetailsPage