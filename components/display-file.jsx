const DisplayFile = ({ content, type, name }) => {

    console.log('This is the file name: ', name);

    return (
      <div>
        {type === 'image' && (
          <div style={{ maxWidth: '10rem' }}>
            <img src={content} alt={`Uploaded Image - ${name}`} style={{ maxWidth: '100%', border: '1px solid #ddd' }} />
            <p>{name}</p>
          </div>
        )}
        {type === 'file' && <p>Display logic for file content goes here</p>}
      </div>
    );
  };
  
  export default DisplayFile;