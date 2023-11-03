import { useState } from "react";
import "./App.css";
import { useEffect } from "react";

const App = () => {
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageInput, setImageInput] = useState(null);
  const [count, setCount] = useState(null);

  useEffect(() => {
    // Load images from local storage when the component mounts
    const storedImages =
      JSON.parse(localStorage.getItem("uploadedImages")) || [];
    setImages(storedImages);
  }, []);

  useEffect(() => {
    // Save images to local storage when the images state changes
    localStorage.setItem("uploadedImages", JSON.stringify(images));
  }, [images]);

  // Function to handle image upload
  const handleImageUpload = (event) => {
    const files = event.target.files;

    if (files.length > 0) {
      const newImages = Array.from(files).map((file) => {
        const imageId = generateImageId();

        // Create an object to represent the image data
        const imageData = {
          id: imageId,
          isFeatured: false,
          src: URL.createObjectURL(file),
          selected: false, // Initially set to false
        };

        return imageData; // Return the image data
      });

      // Update the state to include the new image data
      setImages([...images, ...newImages]);

      // Clear the input field to allow uploading of more images
      setImageInput(null);
    }
  };

  // Function to generate a unique ID for each image
  const generateImageId = () => {
    return `image-${new Date().getTime()}`;
  };

  // Function to toggle 'isFeatured' for an image
  const toggleFeatured = (imageId) => {
    const updatedImages = images.map((image) => {
      if (image.id === imageId) {
        return { ...image, isFeatured: !image.isFeatured };
      }
      return image;
    });
    setImages(updatedImages);
  };

  // Function to toggle the selection of images
  const toggleSelection = (imageId) => {
    const updatedImages = images.map((image) => {
      if (image.id === imageId) {
        return { ...image, selected: !image.selected };
      }
      return image;
    });
    setImages(updatedImages);
  };

  // Function to count the number of selected images

  return (
    <div>
      <div className="imageGrid">
        {images && (
          <>
            {images.map((image, index) => (
              <div
                key={image.id}
                className={`imageDiv ${image.isFeatured ? "featured" : ""} ${
                  image.selected ? "glowing" : ""
                } ${index === 0 ? "FeaturedImageDiv" : "sameStyleDiv"}`}
              >
                <img
                  src={image.src}
                  alt="Image"
                  onClick={() => toggleFeatured(image.id)}
                />
                <input
                  type="checkbox"
                  checked={image.selected}
                  onChange={() => toggleSelection(image.id)}
                />
              </div>
            ))}
            <div className="sameStyleDiv">
              <input
                type="file"
                placeholder="Please add Picture"
                onChange={handleImageUpload}
                multiple
                ref={(input) => setImageInput(input)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
