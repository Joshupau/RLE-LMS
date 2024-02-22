import { useState } from 'react';
import { ImagePlus, FilePlus2 } from 'lucide-react';

const Upload = ({ onImageUpload, onFileUpload }) => {
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);

  const handleImageUpload = (event) => {
    if (!isImageUploading) {
      const files = event.target.files;
      setIsImageUploading(true);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imageUrl = URL.createObjectURL(file);
        
        // Pass each image to the onImageUpload callback
        onImageUpload({
          imageUrl: imageUrl,
          name: file.name,
        });
      }

      event.target.value = null;
      setTimeout(() => setIsImageUploading(false), 1000); // Allow another click after 1 second
    }
  };

  const handleFileUpload = (event) => {
    if (!isFileUploading) {
      const files = event.target.files;
      setIsFileUploading(true);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Pass each file to the onFileUpload callback
        onFileUpload({
          name: file.name,
          content: file,
        });
      }

      event.target.value = null;
      setTimeout(() => setIsFileUploading(false), 1000); // Allow another click after 1 second
    }
  };

  return (
    <div className="flex gap-x-5">
      {/* Image Upload */}
      <label className={`upload-icon-container circle-icon bg-blue-500 text-white p-2 rounded-full cursor-pointer ${isImageUploading ? 'opacity-50' : ''}`}>
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
      <label className={`upload-icon-container circle-icon bg-green-500 text-white p-2 rounded-full cursor-pointer ${isFileUploading ? 'opacity-50' : ''}`}>
        <input
          type="file"
          className="hidden"
          onChange={handleFileUpload}
          multiple
        />
        <FilePlus2 className="h-6 w-6" />
      </label>
    </div>
  );
};

export default Upload;
