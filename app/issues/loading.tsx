import { Table } from '@radix-ui/themes'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import IssueActions from './IssueActions'

const LoadingIssuesSkeleton = () => {
    const issues = [1, 2, 3, 4, 5]

    return (
        <div className="mx-4">
            <IssueActions />

            <Table.Root size="1">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Issue</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell className="hidden md:table-cell">Status</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell className="hidden md:table-cell">Created At</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {issues.map(issue => <Table.Row key={issue}>
                        <Table.RowHeaderCell>
                            <Skeleton />
                            <div className="block md:hidden"><Skeleton /></div>
                        </Table.RowHeaderCell>
                        <Table.Cell className="hidden md:table-cell">
                            <Skeleton />
                        </Table.Cell>
                        <Table.Cell className="hidden md:table-cell">
                            <Skeleton />
                        </Table.Cell>
                    </Table.Row>)}
                </Table.Body>
            </Table.Root>

        </div>
    )
}

export default LoadingIssuesSkeleton