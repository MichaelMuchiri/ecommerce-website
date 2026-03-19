import React, { useRef } from 'react';
import './ImageUpload.css';

const ImageUpload = ({ images, onImagesChange, maxImages = 5 }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Create object URLs for preview
    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      isPrimary: images.length === 0 && files.indexOf(file) === 0
    }));

    const updatedImages = [...images, ...newImages].slice(0, maxImages);
    onImagesChange(updatedImages);
  };

  const handleRemove = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    
    // If we removed the primary image, set the first image as primary
    if (images[index].isPrimary && updatedImages.length > 0) {
      updatedImages[0].isPrimary = true;
    }
    
    onImagesChange(updatedImages);
  };

  const handleSetPrimary = (index) => {
    const updatedImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index
    }));
    onImagesChange(updatedImages);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="image-upload">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        multiple
        style={{ display: 'none' }}
      />

      <div className="image-grid">
        {images.map((image, index) => (
          <div key={index} className="image-item">
            <img src={image.url} alt={`Product ${index + 1}`} />
            <div className="image-overlay">
              <button
                onClick={() => handleSetPrimary(index)}
                className={`primary-btn ${image.isPrimary ? 'active' : ''}`}
                title={image.isPrimary ? 'Primary Image' : 'Set as Primary'}
              >
                <i className="fas fa-star"></i>
              </button>
              <button
                onClick={() => handleRemove(index)}
                className="remove-btn"
                title="Remove"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
            {image.isPrimary && <span className="primary-badge">Primary</span>}
          </div>
        ))}

        {images.length < maxImages && (
          <div className="image-item upload-placeholder" onClick={handleUploadClick}>
            <i className="fas fa-plus"></i>
            <span>Upload Image</span>
          </div>
        )}
      </div>

      <p className="upload-hint">
        You can upload up to {maxImages} images. First image will be used as thumbnail.
      </p>
    </div>
  );
};

export default ImageUpload;