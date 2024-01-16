import Image from "next/image";

const DisplayFile = ({ content, type }) => {
  const { imageUrl, name } = content;

  console.log(content);

  return (
    <div className="w-full border flex items-center">
      {type === 'image' && (
        <div className="max-w-[10rem]">
          <img src={imageUrl} alt={`Uploaded Image - ${name}`} className="w-full h-auto border mr-4" />
        </div>
      )}
      {type === 'image' && <p className="ml-4">{name}</p>}
      {type === 'file' && (
        <div className="max-w-[10rem]">
          <Image 
           height={140}
           width={140}
           alt="file"
           src="/logo.png"
           className="w-full h-auto border mr-4"
          />
        </div>
      )}
      {type === 'file' && <p className="ml-4">{name}</p>}
    </div>
  );
};

export default DisplayFile;
