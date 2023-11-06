import { useState } from "react";
import "./App.css";
import { useEffect } from "react";
import FileUpload from "./Components/FileUpload";
import ImageSlideshow from "./Components/ImageSlideshow";

const App = () => {
  const [images, setImages] = useState([
    // Default images, one featured and others in sameStyleDiv
    {
      id: 1,
      src: "/asset/image-1.webp",
      isFeatured: true,
      selected: false,
    },
    {
      id: 2,
      src: "/asset/image-2.webp",
      isFeatured: false,
      selected: false,
    },
    {
      id: 3,
      src: "/asset/image-3.webp",
      isFeatured: false,
      selected: false,
    },
    {
      id: 4,
      src: "/asset/image-4.webp",
      isFeatured: false,
      selected: false,
    },
    {
      id: 5,
      src: "/asset/image-5.webp",
      isFeatured: false,
      selected: false,
    },
    {
      id: 6,
      src: "/asset/image-6.webp",
      isFeatured: false,
      selected: false,
    },
    {
      id: 7,
      src: "/asset/image-7.webp",
      isFeatured: false,
      selected: false,
    },
    {
      id: 8,
      src: "/asset/image-8.webp",
      isFeatured: false,
      selected: false,
    },
    {
      id: 9,
      src: "/asset/image-9.webp",
      isFeatured: false,
      selected: false,
    },
    {
      id: 10,
      src: "/asset/image-10.jpeg",
      isFeatured: false,
      selected: false,
    },
    {
      id: 11,
      src: "/asset/image-11.jpeg",
      isFeatured: false,
      selected: false,
    },
  ]);
  // States
  const [draggedImage, setDraggedImage] = useState(null);
  const [sortCriteria, setSortCriteria] = useState("featured"); // Initial sorting criteria
  const [sortOrder, setSortOrder] = useState("asc"); // Initial sorting order ('asc' or 'desc')
  const [zoomedImage, setZoomedImage] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [slideshow, setSlideShow] = useState(false);
  const [draggedDivPosition, setDraggedDivPosition] = useState({ x: 0, y: 0 });

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

  const handleSlideShow = () => {
    setSlideShow((prev) => !prev);
  };

  // Apply the selected filter to the image
  const filterStyle = {
    filter: selectedFilter,
  };

  // Function to handle filter change
  const handleFilterChange = (filter) => {
    setSelectedFilter((prevFilter) => {
      // Toggle the filter off if it's already selected
      return prevFilter === filter ? "none" : filter;
    });
  };

  // Sorting The Images

  const sortImages = () => {
    let sortedImages = [...images];

    if (sortCriteria === "id") {
      sortedImages.sort((a, b) =>
        sortOrder === "asc" ? a.id - b.id : b.id - a.id
      );
      sortedImages.sort((b, a) =>
        sortOrder === "dsc" ? a.id - b.id : b.id - a.id
      );
    } else if (sortCriteria === "featured") {
      sortedImages.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      });
      if (sortOrder === "desc") {
        sortedImages.reverse();
      }
    }

    return sortedImages;
  };
  const sortedImages = sortImages();

  // Drag And Drop Images
  const dragOverClass = "drag-over";
  const glowClass = "glow";
  const featuredClass = "featured";

  const handleDragStart = (e, image) => {
    setDraggedImage(image);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", JSON.stringify(image));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add(dragOverClass);

    // Prevent the default behavior to allow dropping
    e.dataTransfer.dropEffect = "move";
  };
  const handleDragLeave = (e) => {
    // Remove the visual indication when leaving the drop target
    e.currentTarget.classList.remove(dragOverClass);
  };
  const handleDrop = (e, targetImage) => {
    e.preventDefault();
    const sourceImage = JSON.parse(e.dataTransfer.getData("text/plain"));

    if (sourceImage.id !== targetImage.id) {
      const updatedImages = images.map((image) => {
        if (image.id === targetImage.id) {
          // When dragging an image from a same styleDiv to the FeaturedImageDiv or vice versa
          // Toggle its isFeatured property
          if (targetImage.isFeatured === true) {
            return { ...sourceImage, isFeatured: !sourceImage.isFeatured };
          }
          return { ...sourceImage, isFeatured: sourceImage.isFeatured };
        }

        if (image.id === sourceImage.id) {
          // When moving an image to the same styleDiv, make sure it's not featured
          return { ...targetImage, isFeatured: false };
        }

        return image;
      });

      setImages(updatedImages);
      setDraggedImage(null);
      e.currentTarget.classList.remove(dragOverClass);
    }
  };

  // Function to handle image upload
  const handleImageUpload = (acceptedFiles) => {
    const newImages = acceptedFiles.map((file) => ({
      id: new Date().getTime(),
      src: URL.createObjectURL(file),
      isFeatured: images.length === 0,
      selected: false,
    }));

    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  // Function to toggle 'isFeatured' for an image
  const toggleFeatured = (id) => {
    // Toggle the "isFeatured" property for the clicked image
    setImages((prevImages) =>
      prevImages.map((image) =>
        image.id === id ? { ...image, isFeatured: !image.isFeatured } : image
      )
    );
  };

  // Function to toggle the selection of images
  const toggleSelection = (id) => {
    // Toggle the "selected" property for the clicked image
    setImages((prevImages) =>
      prevImages.map((image) =>
        image.id === id ? { ...image, selected: !image.selected } : image
      )
    );
  };
  const handleClick = (e, id) => {
    e.stopPropagation(); // Prevent the click event from bubbling up to parent elements
    toggleSelection(id);
    // Find the clicked image by ID
    const clickedImage = images.find((image) => image.id === id);

    if (clickedImage) {
      // Determine the styleDivId for the clicked image
      const styleDivId = clickedImage.styleDivId;

      // Set isFeatured to true for the clicked image and any other image within the same styleDiv
      setImages((prevImages) =>
        prevImages.map((image) =>
          image.styleDivId === styleDivId
            ? { ...image, isFeatured: true }
            : image
        )
      );
    }
  };

  // Function to count the number of selected images
  const updateFeaturedImage = () => {
    const featuredImage = images.find((image) => image.isFeatured);

    // If there's no featured image, set the first image as featured (if available)
    if (!featuredImage && images.length > 0) {
      images[0].isFeatured = true;
    } else if (featuredImage) {
      // If the featured image was deleted, set the first available image as featured
      const newFeaturedImage = images.find(
        (image) => image.id !== featuredImage.id
      );
      if (newFeaturedImage) {
        newFeaturedImage.isFeatured = true;
      }
    }
  };
  // Delete Images
  const deleteSelectedImages = () => {
    const remainingImages = images.filter((image) => !image.selected);

    // Check if there are no featured images among the remaining images
    const noFeaturedImages = remainingImages.every(
      (image) => !image.isFeatured
    );

    // If no featured images are remaining, set the first image as featured
    if (noFeaturedImages && remainingImages.length > 0) {
      remainingImages[0].isFeatured = true;
    }

    setImages(remainingImages);
    updateFeaturedImage(); // Update the featured image after deletion
  };

  // Zoom Effect
  const handleZoom = (id) => {
    setZoomedImage(id);
  };
  const handleSelectAll = () => {
    const allSelected = isAllSelected();
    const updatedImages = images.map((image) => ({
      ...image,
      selected: !allSelected,
    }));
    setImages(updatedImages);
  };

  const isAllSelected = () => {
    return images.every((image) => image.selected);
  };

  return (
    <div>
      <div className="colorFilter text-[#182C61] bg-[#6D214F] font-bold text-[14px]">
        <div>
          <button onClick={() => handleFilterChange("none")}>No Filter</button>
        </div>
        <div>
          {" "}
          <button onClick={() => handleFilterChange("grayscale(100%)")}>
            Grayscale
          </button>
        </div>

        <div>
          <button onClick={() => handleFilterChange("sepia(100%)")}>
            Sepia
          </button>
        </div>
        <div>
          <button onClick={() => handleFilterChange("brightness(70%)")}>
            Brightness
          </button>
        </div>

        <div>
          <button onClick={() => handleFilterChange("contrast(70%)")}>
            contrast
          </button>
        </div>
        <div>
          <button onClick={() => handleFilterChange("blur(50px)")}>blur</button>
        </div>
        <div>
          <button onClick={() => handleFilterChange("hue-rotate(100deg)")}>
            hue-rotate
          </button>
        </div>
        <div>
          <button onClick={() => handleFilterChange("saturate(100%)")}>
            saturate
          </button>
        </div>
        <div>
          <button onClick={() => handleFilterChange("invert(100%)")}>
            invert
          </button>
        </div>
        <div>
          <button
            onClick={() =>
              handleFilterChange(
                "drop-shadow(16px 16px 10px rgba(0, 0, 0, 0.3))"
              )
            }
          >
            drop-shadow
          </button>
        </div>
        <div>
          <button
            onClick={() =>
              handleFilterChange(
                "grayscale(100%) sepia(100%) hue-rotate(100deg) saturate(100%)"
              )
            }
          >
            Combination 1
          </button>
        </div>
        <div>
          <button
            onClick={() =>
              handleFilterChange(
                "brightness(100%) contrast(100%) blur(0px) grayscale(0%) sepia(0%) hue-rotate(0deg) saturate(100%)"
              )
            }
          >
            Combination 2
          </button>
        </div>
      </div>
      <div className="Filter">
        <label htmlFor="sortCriteria" className="font-bold text-2xl">
          Sort by:
        </label>
        <select
          id="sortCriteria"
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value)}
          className="font-bold text-2xl p-4"
        >
          <option value="featured">Featured</option>
          <option value="id">ID</option>

          {/* Add more sorting criteria options if needed */}
        </select>
        <label htmlFor="sortOrder" className="font-bold text-2xl">
          Order:
        </label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="font-bold text-2xl p-4"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {slideshow === true
        ? images.some((image) => image.selected) && (
            <ImageSlideshow
              images={images}
              selectedImages={images
                .filter((image) => image.selected)
                .map((image) => image.id)}
            />
          )
        : ""}
      <div className="md:w-[800px] mx-auto p-6">
        <div className="md:flex justify-between mx-auto items-center gap-6">
          {images.some((image) => image.selected) ? (
            <>
              <div className="selectedImageCount text-[26px] font-bold text-[#182C61]">
                {images.filter((image) => image.selected).length} Image selected
              </div>
              <div>
                <button
                  onClick={deleteSelectedImages}
                  className=" link-error font-bold text-[26px] h-[70px]"
                >
                  Delete Selected
                </button>
              </div>
              <div>
                <button
                  onClick={handleSlideShow}
                  className="btn btn-primary p-4 w-[200px]"
                >
                  View SlideShow
                </button>
              </div>
            </>
          ) : (
            <h2 className="text-[28px] font-bold text-[#182C61]">Gallery</h2>
          )}
        </div>
        <hr className="md:w-[800px] border-red-200 border-2 mt-2" />
      </div>
      <h2 className="text-red-600 font-bold text-center">
        User Can Drag And Drop Images Only When SortBy : Featured is Selected
      </h2>
      <div className="w-[400px] mx-auto p-6 text-center text-purple-800 font-bold ">
        <label htmlFor="" className="text-2xl font-bold">
          Select All
        </label>
        <input
          type="checkbox"
          multiple
          onChange={handleSelectAll}
          checked={isAllSelected()}
          className="w-[60px] h-[40px]"
        />
      </div>
      <div className="imageGrid my-12">
        {sortedImages.map((image, index) => (
          <div
            key={index}
            className={`imageDiv ${image.isFeatured ? featuredClass : ""} ${
              image.selected ? glowClass : ""
            } ${image.isFeatured ? "FeaturedImageDiv" : "sameStyleDiv"}`}
            onClick={() => {
              toggleSelection(image.id);
            }}
            draggable={true}
            onDragStart={(e) => handleDragStart(e, image)}
            onDragOver={(e) => handleDragOver(e)}
            onDragLeave={(e) => handleDragLeave(e)}
            onDrop={(e) => handleDrop(e, image)}
          >
            <img
              src={image.src}
              alt="Image"
              id="zoom"
              onClick={() => {
                handleClick(image.id);
                toggleFeatured(image.id);
                handleZoom(image.id);
              }}
              className={zoomedImage === image.id ? "zoomed-image" : ""}
              style={filterStyle}
            />

            <input
              type="checkbox"
              checked={image.selected}
              onChange={() => {}}
            />
          </div>
        ))}

        <div className="sameStyleDiv">
          <FileUpload handleImageUpload={handleImageUpload} />
        </div>
      </div>
    </div>
  );
};

export default App;
