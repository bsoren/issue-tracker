import { Button } from "@radix-ui/themes"
import Link from "next/link"
import { Table } from '@radix-ui/themes'
import { prisma } from "@/lib/prisma"

const IssuePage = async () => {
    const issues = await prisma.issue.findMany();
    return (
        <div className="mx-4">
            <div className="mb-5">
                <Button><Link href="/issues/new">New Issue</Link></Button>
            </div>

            <Table.Root size="1">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Issue</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell className="hidden md:table-cell">Status</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell className="hidden md:table-cell">Created At</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {issues.map(issue => <Table.Row key={issue.id}>
                        <Table.RowHeaderCell>
                            {issue.title}
                            <div className="block md:hidden">{issue.status}</div>
                        </Table.RowHeaderCell>
                        <Table.Cell className="hidden md:table-cell">{issue.status}</Table.Cell>
                        <Table.Cell className="hidden md:table-cell">{issue.createdAt.toLocaleString()}</Table.Cell>
                    </Table.Row>)}
                </Table.Body>
            </Table.Root>

        </div>
    )
}

export default IssuePage