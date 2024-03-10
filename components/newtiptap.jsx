"use client"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Toolbar } from "./toolbar"


export default function Newtiptap({
    description,
    onChange,
    postedDescription,
}) {
    const editor = useEditor({
        extensions: [StarterKit.configure({
            bulletList: {
                HTMLAttributes: {
                    class: "bullet_class",
                    style: "list-style: disc; margin-left: 1.5rem; padding: 0;", // Apply inline styles here
                },
            },
            orderedList: {
                HTMLAttributes: {
                    class: "order_class",
                    style: "list-style: decimal; margin-left: 1.5em; padding: 0;", // Apply inline styles here
                },
            },
            heading: {
                HTMLAttributes: {
                    class: "headers_class"
                }
            }
        })],
        content: postedDescription || description,
        editorProps: {
            attributes: {
                class: "rounded-md border min-h-[150px] border-input bg-background ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            },
        },
        onUpdate({ editor }){
            onChange(editor.getHTML())
        },
    })

    return (
        <div className="flex flex-col justify-stretch ">
            <Toolbar editor={editor}/>
            <EditorContent editor={editor}/>
        </div>
    )
}
