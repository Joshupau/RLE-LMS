'use client'

import { useState } from 'react';
import {
  EditorContent,
  useEditor,
  EditorProvider,
  createEditor,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import {
 Bold,
 Strikethrough,
 Italic,
 List,
 ListOrdered,
 Heading2,
} from "lucide-react";

import { Editor } from "@tiptap/react";



const Tiptap = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Initial content here</p>',
  });

  const extensions = [StarterKit]; // Define the extensions here

  return (
    <EditorProvider className="w-96" extensions={extensions} editor={editor}>
        <MyToolbar editor={editor} />
      <EditorContent editor={editor} />
    </EditorProvider>
  );
};

const MyToolbar = ({ editor }) => {
  return (
    <div className="toolbar">
      <button onClick={() => editor.chain().focus().toggleBulletList().run()}>Bullet</button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>Ordered</button>
      {/* Add more buttons for other commands as needed */}
    </div>
  );
};


export default Tiptap;
