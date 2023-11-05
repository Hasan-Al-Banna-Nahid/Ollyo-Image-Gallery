/* eslint-disable react/prop-types */

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const ImageSlideshow = ({ images, selectedImages }) => {
  // Filter selected images
  const selectedImagesList = images.filter((image) =>
    selectedImages.includes(image.id)
  );

  return (
    <div className="slideshow-container mx-auto w-[650px] bg-slate-700 p-6 rounded-lg">
      <Carousel
        showStatus={false}
        showThumbs={false}
        infiniteLoop
        autoPlay
        dynamicHeight={1}
        width={600}
        swipeable={true}
      >
        {selectedImagesList.map((image) => (
          <div key={image.id}>
            <img
              src={image.src}
              alt={`Image ${image.id}`}
              width={500}
              height={400}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ImageSlideshow;
