import React, { useState } from 'react';
import Image from "next/image";
import { XCircle } from "lucide-react";

const DisplayFile = ({ content, type, removeFile,removePostedFile, editing = false }) => {
  const [isEditing, setIsEditing] = useState(editing); // Control editing state

  const { imageUrl } = content;


  return (
    <div className="w-full border flex items-center">
      {isEditing ? (
        <>
        <div className="flex items-center flex-grow">
          {type === 'image' && (
            <img
            src={imageUrl}
            alt={`Uploaded Image - ${content.name}`}
            className="w-1/2 border mr-4 h-auto max-w-[10rem]"
            />
            )}
          {type === 'file' && (
            <Image
            height={140}
            width={140}
            alt={content.name}
            src="/logo.png" // Replace with placeholder or actual file preview
            className="w-full h-auto border max-h-[10rem] max-w-[10rem] mr-4"
            />            
            )}
          <p className="flex-grow text-ellipsis overflow-hidden">{content.name}</p>          
        </div>
        <button
        className="flex items-center justify-end ml-auto"
        onClick={() => removePostedFile(type, content)}
      >
        <XCircle className="h-6 w-6 mr-5 text-red-500 hover:text-red-700" />
      </button>
            </>
      ) : (
        <>
        <div className="flex items-center flex-grow">
          {type === 'image' && (
            <img
            src={imageUrl}
            alt={`Uploaded Image - ${content.name}`}
            className="w-1/2 border mr-4 h-auto max-h-[10rem] max-w-[10rem]"
            />
            )}
          {type === 'file' && (
            <Image
            height={140}
            width={140}
            alt={content.name}
            src="/logo.png" // Replace with placeholder or actual file preview
            className="w-full h-auto border max-h-[10rem] max-w-[10rem] mr-4"
            />
            )}
          <p className="flex-grow text-ellipsis overflow-hidden">{content.name}</p>
        </div>
      <button
        className="flex items-center justify-end ml-auto"
        onClick={() => removeFile(type, content)}
      >
        <XCircle className="h-6 w-6 mr-5 text-red-500 hover:text-red-700" />
      </button>
        </>
      )}
    </div>
  );
}

export default DisplayFile;
