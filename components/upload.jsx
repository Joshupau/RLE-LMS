import { useState } from 'react';
import { ImagePlus, FilePlus2 } from 'lucide-react';

const Upload = ({ onImageUpload, onFileUpload }) => {
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);

  const handleImageUpload = (event) => {
    if (!isImageUploading) {
      setIsImageUploading(true);
      const file = event.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        onImageUpload(`${imageUrl}`);
      }
      event.target.value = null;
      setTimeout(() => setIsImageUploading(false), 1000); // Allow another click after 1 second
    }
  };

  const handleFileUpload = (event) => {
    if (!isFileUploading) {
      setIsFileUploading(true);
      const file = event.target.files[0];
      if (file) {
        // Pass the file name and content to the onFileUpload callback
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
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
        <ImagePlus className="h-6 w-6" />
      </label>

      {/* File Upload */}
      <label className={`upload-icon-container circle-icon bg-green-500 text-white p-2 rounded-full cursor-pointer ${isFileUploading ? 'opacity-50' : ''}`}>
        <input
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        <FilePlus2 className="h-6 w-6" />
      </label>
    </div>
  );
};

export default Upload;