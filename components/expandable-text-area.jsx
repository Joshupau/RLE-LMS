'use client';
import { useState } from 'react';
import { Button } from './ui/button';
import Newtiptap from './newtiptap';
import DisplayFile from './display-file';
import { useEdgeStore } from '../lib/edgestore';
import { ImagePlus, FilePlus2 } from 'lucide-react';
import MoonLoader from 'react-spinners/MoonLoader';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';

const ExpandableTextarea = ({ id, userId }) => {
  const { edgestore } = useEdgeStore();
  
  const [expanded, setExpanded] = useState(false);
  
  const [isTextareaEmpty, setIsTextAreaEmpty] = useState(true);
  const [description, setDescription] = useState('');
  const [pendingImages, setPendingImages] = useState([]);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [pendingUploads, setPendingUploads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

const router = useRouter();

  const resourceGroupId = id;




const removeFile = (fileType, content) => {
  if (fileType === 'image') {
    window.URL.revokeObjectURL(content.imageUrl);
    setPendingImages((prevImages) =>
      prevImages.filter((image) => image.key !== content.key)
    );
  } else if (fileType === 'file') {
    // Implement file deletion logic (using file path or other info)
    setPendingFiles((prevFiles) =>
      prevFiles.filter((file) => file.key !== content.key)
    );
  }
};

  
  
  const handleImageUpload = (e) => {
    const uploadedImages = Array.from(e.target.files);
    const now = Date.now();
    setPendingImages((prevImages) => [
      ...prevImages,
      ...uploadedImages.map((file) => ({
        key: `${now}-${Math.random() * 1000000}`,
        file,
        type: "image",
      })),
    ]);
  };
  
  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    const now = Date.now();
    setPendingFiles((prevFiles) => [
      ...prevFiles,
      ...uploadedFiles.map((file) => ({
        key: `${now}-${Math.random() * 1000000}`,
        file,
        type: "file",
      })),
    ]);
  };
  
  

  const handleExpand = () => {
    setExpanded(true);
  };

  const handleCancel = () => {
    setExpanded(false);
    setDescription('');
  };

 
  const handleDescriptionChange = (htmlContent) => {
    const trimmedDescription = htmlContent.trim();
    setDescription(trimmedDescription);
    if (htmlContent === '<p></p>'){
      setIsTextAreaEmpty(true);
    } else {
      setIsTextAreaEmpty(false);
    }
  };
  

  const uploadToEdgeStore = async (fileObject) => {
    try {


      const uploadPromise = await edgestore.publicFiles.upload({
        file: fileObject.file,
        options: {
          manualFileName:  Math.floor(Math.random() * 1000)+"/"+fileObject.file.name,
        },
        onProgressChange: (progress) => {
          // Update the fileObject's progress in state
          setPendingUploads((prevUploads) => {
            const updatedUploads = prevUploads.map((upload) => {
              if (upload.key === fileObject.key) {
                return { ...upload, progress };
              }
              return upload;
            });
            return updatedUploads;
          });
          console.log(progress);
        },
      });
      
      // Wait for successful upload
      const url = uploadPromise.url;
      return url;
    } catch (error) {
      console.error('Error uploading file:', error);
      // Handle the error as needed
      return null;
    }
  };

  const handleDataSubmission = async (fileUrls, description, resourceGroupId, userId) => {
    try {

      const response = await fetch("/api/resource", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileUrls,
          description,
          resourceGroupId,
          userId
        }),
      });
 
      if (!response.ok) {
        throw new Error("Failed to submit data to MongoDB");
      }
      if(response.ok){
        router.refresh();
      }     
    } catch (error) {
      console.log(error);
    }
  };
  
  

  const handleSubmission = async () => {
    setIsLoading(true);

    const allPendingUploads = [
      ...pendingImages.filter((image) => !image.removed),
      ...pendingFiles.filter((file) => !file.removed),
    ];
  
    const uploadPromises = allPendingUploads.map(fileObject => {
      // Return a promise for each upload
      return uploadToEdgeStore(fileObject);
    });
  
    try {
      // Wait for all uploads to finish using Promise.all
      const fileUrls = await Promise.all(uploadPromises);
    
      // Call handleDataSubmission after all uploads are complete
      await handleDataSubmission(fileUrls, description, resourceGroupId, userId);
    } catch (error) {
      console.error("Error during uploads or data submission:", error);
      // Handle errors appropriately
    } finally {
      // Clear pending uploads regardless of success
      setPendingImages([]);
      setPendingFiles([]);
      setExpanded(false);
      setIsLoading(false);
    }
  };
  

  
  
  

  return (
    <div>
      {expanded ? (
        <div>
          <Newtiptap description={description} onChange={handleDescriptionChange} />
            {/* Display uploaded images */}
            {pendingImages.map((image) => (
            <DisplayFile
              key={`image-${image.key}`}
              content={{ imageUrl: URL.createObjectURL(image.file), name: image.file.name, key: image.key }}
              type="image"
              removeFile={removeFile}
            />
            ))}
            {pendingFiles.map((file) => (
            <DisplayFile
              key={`file-${file.key}`}
              content={{ fileUrl: URL.createObjectURL(file.file), name: file.file.name, key: file.key }}
              type="file"
              removeFile={removeFile}
            />
            ))}

          <div className="flex justify-between mt-4">
          <div className="flex gap-x-5">
            {/* Image Upload */}
            <label className="upload-icon-container circle-icon bg-blue-500 text-white p-2 rounded-full cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                multiple
              />
              <ImagePlus className="h-6 w-6" />
            </label>

            {/* File Upload */}
            <label className="upload-icon-container circle-icon bg-green-500 text-white p-2 rounded-full cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                multiple
              />
              <FilePlus2 className="h-6 w-6" />
            </label>
          </div>
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
                onClick={handleSubmission}
              >
              {isLoading ? (
                <MoonLoader className='mx-2' size={10} color="#000000" loading={true} />
              ) : (
                'Post'
              )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <p
          onClick={handleExpand}
          className="border border-gray-300 p-2 cursor-pointer text-slate-400 hover:text-blue-400 w-full"
        >
     What's on your mind?
        </p>
      )}
    </div>
  );
};

export default ExpandableTextarea;


{/* <Button onClick={handleExpand}>Post Something</Button>
<Button onClick={handleCancel} variant="destructive">Cancel</Button> */}