'use client'

import { Spinner, Callout, Button, TextArea, TextField, ThemePanel } from "@radix-ui/themes"
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import axios from 'axios'

import { useForm, Controller } from 'react-hook-form'
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import CreateIssueSchema from "@/app/api/issues/schema";
import ErrorMessage from "@/app/components/ErrorMessage";
import InlineSpinner from "@/app/components/Spinner";


type IssueForm = z.infer<typeof CreateIssueSchema>

const NewIssuePage = () => {
    const router = useRouter();
    const { register, control, handleSubmit, formState: { errors } } = useForm<IssueForm>({
        resolver: zodResolver(CreateIssueSchema)
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSummitting] = useState(false)

    const onSubmit = handleSubmit(async (data) => {
        console.log(`Submitting data ${data}`)
        try {
            setIsSummitting(true)

            const response = await axios.post('/api/issues', JSON.stringify(data), {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            router.push("/issues")
        } catch (error) {
            setError('An unexpected error occurred.')
        } finally {
            setIsSummitting(false)
        }
    });

    return (
        <div className="max-w-xl">
            {error && <Callout.Root color="red"><Callout.Text>{error}</Callout.Text>
            </Callout.Root>
            }
            <form className="flex-row space-y-6"
                onSubmit={onSubmit}>
                <TextField.Root placeholder="Enter title..." {...register('title')}>
                </TextField.Root>
                <ErrorMessage>{errors.title?.message}</ErrorMessage>
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => <SimpleMDE placeholder="Enter description..." {...field} />}
                />
                <ErrorMessage>{errors.description?.message}</ErrorMessage>
                <Button disabled={isSubmitting}>Submit New Issue {<InlineSpinner isSubmitting={isSubmitting} />}</Button>
            </form>
        </div>
    )
}

export default NewIssuePage