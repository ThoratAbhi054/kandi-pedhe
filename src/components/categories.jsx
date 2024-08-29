import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Import the necessary styles
import "swiper/css/free-mode";

export const CategorySlider = ({ categories }) => {
  return (
    <div className="mt-10">
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        freeMode={true}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
      >
        {categories.map((category) => (
          <SwiperSlide key={category.name}>
            <a href={category.href} className="group block">
              <div
                aria-hidden="true"
                className="w-[300px] h-[400px] overflow-hidden rounded-lg group-hover:opacity-75"
              >
                <img
                  alt={category.name}
                  src={category.thumbnail}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">
                {category.name}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {category.description}
              </p>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
