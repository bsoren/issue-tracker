'use client'
import { Button, TextArea, TextField, ThemePanel } from "@radix-ui/themes"
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import axios from 'axios'

import { useForm, Controller } from 'react-hook-form'
import { useRouter } from "next/navigation";

interface IssueForm {
    title: string
    description: string
}


const NewIssuePage = () => {
    const router = useRouter();
    const { register, control, handleSubmit } = useForm<IssueForm>();

    return (
        <form className="flex-row space-y-6 max-w-xl"
            onSubmit={handleSubmit(async (data) => {
                await axios.post('/issues', data)
                router.push("/issues")
            })}>
            <TextField.Root placeholder="Enter title..." {...register('title')}>
            </TextField.Root>
            <Controller
                name="description"
                control={control}
                render={({ field }) => <SimpleMDE placeholder="Enter description..." {...field} />}
            />
            <Button>Submit New Issue</Button>
        </form>
    )
}

export default NewIssuePage