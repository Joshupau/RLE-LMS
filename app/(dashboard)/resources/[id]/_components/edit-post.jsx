'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Newtiptap from '@/components/newtiptap';
import DisplayFile from '@/components/display-file';
import { useEdgeStore } from '@/lib/edgestore';
import { ImagePlus, FilePlus2 } from 'lucide-react';
import MoonLoader from 'react-spinners/MoonLoader';
import { DialogFooter } from '@/components/ui/dialog';

import { cn } from '@/lib/utils';

const EditPost = ({ 
  resourceGroupID, 
  id, 
  userId, 
  descriptions, 
  uploadLinks,
  onClose
}) => {
  const { edgestore } = useEdgeStore();
  const router = useRouter();

  const [isTextareaEmpty, setIsTextAreaEmpty] = useState(false);
  const [description, setDescription] = useState(descriptions);
  const [pendingImages, setPendingImages] = useState([]);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [pendingUploads, setPendingUploads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState([]);
  const [uploadUrl, setUploadUrl] = useState(uploadLinks);
  const resourceGroupId = resourceGroupID;

  const removePostedFile = (type, content) => {
    if(type ==='file'){
      const filteredUploadLinks = uploadUrl.filter((link) => link !== content.fileUrl);
      setUploadUrl(filteredUploadLinks);
      setUrlToDelete((prevUrls) => [...prevUrls, content.fileUrl]);
    }else if (type='image'){
      const filteredUploadLinks = uploadUrl.filter((link) => link !== content.imageUrl);
      setUploadUrl(filteredUploadLinks);
      setUrlToDelete((prevUrls) => [...prevUrls, content.imageUrl]);
    }
  };
  

const removeFile = (fileType, content) => {
  console.log(content);
  if (fileType === 'image') {
    window.URL.revokeObjectURL(content.imageUrl);
    setPendingImages((prevImages) =>
      prevImages.filter((image) => image.key !== content.key)
    );
  } else if (fileType === 'file') {
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
  
  
 
  const handleDescriptionChange = (htmlContent) => {
    const trimmedDescription = htmlContent.trim();
    console.log(resourceGroupId);
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

  const handleDataSubmission = async (fileUrls, description, resourceGroupId, userId, urlToDelete, id, uploadUrl) => {
    try {

      const response = await fetch(`/api/resource/${id}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileUrls,
          description,
          userId,
          id,
          uploadUrl,
        }),
      });
 
      if (!response.ok) {
        throw new Error("Failed to submit data to MongoDB");
      }
      if (response.ok) {
        if(urlToDelete){
          const deleteURL = await urlToDelete.map((links)=>{
               edgestore.publicFiles.delete({
                   url: links,
               });
           });
           if(deleteURL){
              console.log("Successfully deleted files in edgestore");
            } else {
              console.log("Failed to delete files in edgestore");
           };
        };
        onClose();
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
  
      console.log("All uploads successful:", fileUrls);
  
      // Call handleDataSubmission after all uploads are complete
      await handleDataSubmission(fileUrls, description, resourceGroupId, userId, urlToDelete, id, uploadUrl);
    } catch (error) {
      console.error("Error during uploads or data submission:", error);
      // Handle errors appropriately
    } finally {
      // Clear pending uploads regardless of success
      setPendingImages([]);
      setPendingFiles([]);
      setIsLoading(false);
    }
  };

  const isImage = (url) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    return imageExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  };
  const extractFilename = (url) => {
    const segments = url.split('/');
  
    let filename = segments.pop();
  
    const hasExtension = filename.includes('.');
  
    if (!hasExtension && segments.length > 0) {
      filename = segments.pop();
    }
  
    return filename || "";
  };
  
  

  return (
    <div>
        <div>
          <Newtiptap description={description} postedDescription={descriptions} onChange={handleDescriptionChange} />
            {/* Display uploaded images */}
            {pendingImages.map((image) => (
            <DisplayFile
              key={`image-${image.key}`}
              content={{ imageUrl: URL.createObjectURL(image.file), name: image.file.name, key: image.key }}
              type="image"
              removeFile={removeFile}
              editing={false}
            />
            ))}
            {pendingFiles.map((file) => (
            <DisplayFile
              key={`file-${file.key}`}
              content={{ fileUrl: URL.createObjectURL(file.file), name: file.file.name, key: file.key }}
              type="file"
              removeFile={removeFile}
              editing={false}
            />
            ))}
           {uploadUrl.map((link, index) => (
            <div key={index}>
              {isImage(link) ? (
                <DisplayFile
                  key={`image-${index}`}
                  content={{ imageUrl: link, name: extractFilename(link), key: index }} // Use link.url consistently
                  type="image"
                  editing={true} // Enable editing only for pending
                  removePostedFile={removePostedFile} // Pass entire link object
                />
              ) : (
                <DisplayFile
                  key={`file-${index}`}
                  content={{ fileUrl: link, name: extractFilename(link), key: index }} // Use link.url consistently
                  type="file"
                  editing={true} // Enable editing only for pending
                  removePostedFile={removePostedFile} // Pass entire link object
                />
              )}
            </div>
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
                disabled={isTextareaEmpty}
                className={cn(
                  { 'bg-green-500': !isTextareaEmpty, 'bg-gray-300': isTextareaEmpty },
                  'p-2',
                  'rounded-md',
                  'transition-colors'
                  )}
                  onClick={handleSubmission}
                  type="submit"
                  >
              {isLoading ? (
                <MoonLoader className='mx-2' size={10} color="#000000" loading={true} />
                ) : (
                  'Save'
                  )}
              </Button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default EditPost;
