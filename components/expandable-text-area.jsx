'use client'
import { useState } from 'react';
import { Button } from './ui/button';
import Newtiptap from './newtiptap';

import { cn } from '@/lib/utils';

const ExpandableTextarea = () => {
  const [expanded, setExpanded] = useState(false);
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');

  const handleExpand = () => {
    setExpanded(true);
  };

  const handleCancel = () => {
    setExpanded(false);
    setText('');
  };

  const handleDescriptionChange = (htmlContent) => {
    // Update the state with the new HTML content
    setDescription(htmlContent);
    
  };
  const isTextareaEmpty = description.trim() === '';


  return (
    <div>
      {expanded ? (
        <div>
          <Newtiptap
            description={description}
            onChange={handleDescriptionChange}
          />
          <div className="flex justify-end mt-2">
            <Button onClick={handleCancel} className="mr-2" variant="destructive">
              Cancel
            </Button>
            <Button
              disabled={description.trim() === ''}
              className={cn({ 'bg-green-500': !isTextareaEmpty, 'bg-gray-300': isTextareaEmpty }, 'p-2', 'rounded-md', 'transition-colors')}
            >
              Post
            </Button>
          </div>
        </div>
      ) : (
        <p
          onClick={handleExpand}
          className="border border-gray-300 p-2 cursor-pointer text-slate-400 hover:text-blue-400 w-full"
        >
          {text ? text : "What's on your mind?"}
        </p>
      )}
    </div>
  );
};

export default ExpandableTextarea;


{/* <Button onClick={handleExpand}>Post Something</Button>
<Button onClick={handleCancel} variant="destructive">Cancel</Button> */}