import IssueStatusBadge from '@/app/components/IssueStatusBadge'
import { Box, Card, Flex, Heading } from '@radix-ui/themes'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import delay from 'delay'

const NewIssueLoadingPage = async () => {
    return (
        <Box className="max-w-xl">
            <Heading>
                <Skeleton baseColor='grey' />
            </Heading>
            <Flex gap="4" my="2">
                <Skeleton baseColor='grey' width="5rem" />
                <Skeleton baseColor='grey' width="8rem" />
            </Flex>

            <Card className='prose' mt="5">
                <Skeleton count={3} baseColor='grey' />
            </Card>
        </Box>
    )
}

export default NewIssueLoadingPage