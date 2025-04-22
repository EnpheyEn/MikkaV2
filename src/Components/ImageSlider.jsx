import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./ImageSlider.css";

const ImageSlider = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // ถ้ามี 5 รูปชื่อ 1.jpg ถึง 5.jpg
const img = Array.from({ length: 3 }, (_, i) => `/Images/${i + 1}.jpg`);

  const openModal = (image) => {
    setSelectedImage(image);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedImage(null);
  };

  // function ImageSlider({ images }) {
  //   return (
  //     <div className="image-slider">
  //       {images.map((src, index) => (
  //         <img key={index} src={src} alt={`Slide ${index + 1}`} />
  //       ))}
  //     </div>
  //   );
  // }

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
        {img.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              className="w-full max-h-72 object-contain rounded-lg cursor-pointer"
              src={image}
              alt={`Slide ${index + 1}`}
              onClick={() => openModal(image)}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Popup Modal */}
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
