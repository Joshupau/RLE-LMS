'use client';
import { useState } from 'react';
import { Button } from './ui/button';
import Newtiptap from './newtiptap';
import Upload from './upload';
import DisplayFile from './display-file';

import { cn } from '@/lib/utils';

const ExpandableTextarea = () => {
  const [expanded, setExpanded] = useState(false);
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedContent, setUploadedContent] = useState([]);
  const [uploadedType, setUploadedType] = useState([]);
  const [uploadedFileNames, setUploadedFileNames] = useState([]);

  const handleExpand = () => {
    setExpanded(true);
  };

  const handleCancel = () => {
    setExpanded(false);
    setText('');
  };

  const handleDescriptionChange = (htmlContent) => {
    setDescription(htmlContent);
  };

  const handleImageUpload = (imageUrl, fileName) => {
    setUploadedContent([...uploadedContent, imageUrl]);
    setUploadedType([...uploadedType, 'image']);
    setUploadedFileNames([...uploadedFileNames, fileName]);
  };

  const handleFileUpload = (fileContent, fileName) => {
    setUploadedContent([...uploadedContent, fileContent]);
    setUploadedType([...uploadedType, 'file']);
    setUploadedFileNames([...uploadedFileNames, fileName]);
  };

  const isTextareaEmpty = description.trim() === '';

  return (
    <div>
      {expanded ? (
        <div>
          <Newtiptap description={description} onChange={handleDescriptionChange} />
          {uploadedContent.map((content, index) => (
            <DisplayFile key={index} content={content} type={uploadedType[index]} fileName={uploadedFileNames[index]} />
          ))}
          <div className="flex justify-between mt-4">
            <Upload onImageUpload={handleImageUpload} onFileUpload={handleFileUpload} />
            <div>
              <Button
                onClick={handleCancel}
                className="mr-2"
                variant="destructive"
              >
                Cancel
              </Button>
              <Button
                disabled={isTextareaEmpty}
                className={cn(
                  { 'bg-green-500': !isTextareaEmpty, 'bg-gray-300': isTextareaEmpty },
                  'p-2',
                  'rounded-md',
                  'transition-colors'
                )}
              >
                Post
              </Button>
            </div>
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