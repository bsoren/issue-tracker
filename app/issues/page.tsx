import { Button } from "@radix-ui/themes"
import Link from "next/link"

const IssuePage = () => {
    return (
        <div className="mx-4"><Button><Link href="/issues/new">New Issue</Link></Button></div>
    )
}

export default IssuePage