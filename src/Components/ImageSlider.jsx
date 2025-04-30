import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./ImageSlider.css";

const ImageSlider = () => {
  const [images, setImages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("https://apikaegoal.mmm2007.net/api/Member/imageFeed", {
          method: "POST"});
        const data = await response.json();

        if (Array.isArray(data)) {
          // เช็คว่ามีฟิลด์ url และ alt หรือไม่
          setImages(data);
        } else {
          console.error("Invalid response format:", data);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="w-full h-auto">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={true}
        breakpoints={{
          320: { slidesPerView: 1 },
          768: { slidesPerView: 1 },
          1024: { slidesPerView: 1 },
        }}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              className="w-full max-h-72 object-contain rounded-lg cursor-pointer"
              src={image.url} // ใช้ url จาก API
              alt={image.alt || `Slide ${index + 1}`} // ใช้ alt ถ้ามี
              onClick={() => openModal(image.url)}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div className="relative">
            <img
              src={selectedImage}
              alt="Full Size"
              className="max-w-full max-h-[90vh] rounded-lg"
            />
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 bg-white text-black px-3 py-1 rounded-full text-xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
