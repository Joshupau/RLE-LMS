import { Editor } from "@tiptap/react"
import { useRef, useState } from "react"

import {
 Bold,
 Strikethrough,
 Italic,
 List,
 ListOrdered,
 Heading2,
 ImagePlus,
} from "lucide-react"
import { Toggle } from "./ui/toggle"

export function Toolbar({ editor }) {
    if(!editor) {
        return null
    }

    const fileInputRef = useRef(null);

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        editor.chain().focus().setImage({ src: imageUrl }).run();
      }
      // Clear the file input for future use
      fileInputRef.current.value = null;
    };

    return (
        <div className="border border-input bg-transparent rounded-md">
            <Toggle
                size="sm"
                pressed={editor.isActive("heading")}
                onPressedChange={()=>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
             >
                <Heading2 className="h-4 w-4"/>
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("bold")}
                onPressedChange={()=>
                editor.chain().focus().toggleBold().run()
                }
             >
                <Bold className="h-4 w-4"/>
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("italic")}
                onPressedChange={()=>
                editor.chain().focus().toggleItalic().run()
                }
             >
                <Italic className="h-4 w-4"/>
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("strike")}
                onPressedChange={()=>
                editor.chain().focus().toggleStrike().run()
                }
             >
                <Strikethrough className="h-4 w-4"/>
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("bulletList")}
                onPressedChange={() =>
                    editor.chain().focus().toggleBulletList().run()
                }
            >
                <List className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('orderedList')}
                onPressedChange={() =>
                    editor.chain().focus().toggleOrderedList().run()
                }
            >
                <ListOrdered className="h-4 w-4" />
            </Toggle>
            <button
                className="p-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                onClick={() => fileInputRef.current.click()}
                title="Upload Image"
            >
                <ImagePlus className="h-4 w-4" />
            </button>
            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
            />
        </div>
    )
}