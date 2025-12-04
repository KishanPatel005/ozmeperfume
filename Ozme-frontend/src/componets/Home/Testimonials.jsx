import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Simran Narang',
    instagram: 'simrannaranggg',
    rating: 5,
    review: 'Absolutely love the fragrance! It lasts all day and gets me so many compliments. The packaging is beautiful too!',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    location: 'Mumbai, India'
  },
  {
    id: 2,
    name: 'Rahul Sharma',
    instagram: 'rahulsharma',
    rating: 5,
    review: 'Best perfume I\'ve ever used. The scent is unique and long-lasting. Highly recommended!',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    location: 'Delhi, India'
  },
  {
    id: 3,
    name: 'Priya Patel',
    instagram: 'priyapatel',
    rating: 5,
    review: 'Amazing quality and the fragrance is just perfect. Will definitely buy again!',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    location: 'Bangalore, India'
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
      setTimeout(() => setIsAnimating(false), 700);
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
      );
      setTimeout(() => setIsAnimating(false), 700);
    }
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="min-h-[500px] bg-gradient-to-br from-gray-50 to-gray-100 py-10  flex items-center justify-center">
      <div className="max-w-6xl w-full  mx-auto relative">
        {/* Navigation Buttons */}
        <button 
          onClick={prevSlide}
          disabled={isAnimating}
          className="absolute left-0 md:-left-20 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-transparent hover:bg-gray-200/50 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="text-gray-600" size={36} strokeWidth={1.5} />
        </button>
        
        <button 
          onClick={nextSlide}
          disabled={isAnimating}
          className="absolute right-0 md:-right-20 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-transparent hover:bg-gray-200/50 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next testimonial"
        >
          <ChevronRight className="text-gray-600" size={36} strokeWidth={1.5} />
        </button>

        {/* Testimonial Card */}
        {/* <div className="bg-white shadow-sm py-6 px-8 md:px-10 relative overflow-hidden"> */}
          <div className="relative z-10 max-w-4xl mx-auto">
            {/* Quote Icon */}
            <div className="flex justify-center mb-6">
              <Quote className="text-gray-900" size={64} strokeWidth={3} fill="currentColor" />
            </div>

            {/* Review Text */}
            <blockquote className="text-2xl md:text-3xl lg:text-4xl text-gray-900 text-center leading-relaxed mb-14 font-serif italic font-light">
              {currentTestimonial.review}
            </blockquote>

            {/* Customer Info */}
            <div className="flex flex-col items-center justify-center gap-5">
              {/* Profile Image - Small Size */}
              <img 
                src={currentTestimonial.image} 
                alt={currentTestimonial.name}
                className="w-16 h-16 rounded-full object-cover"
              />

              {/* Name */}
              <div className="text-center">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-1">
                  {currentTestimonial.name}
                </h3>
              </div>
            </div>
          {/* </div> */}
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-12 gap-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isAnimating) {
                  setIsAnimating(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsAnimating(false), 700);
                }
              }}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex 
                  ? 'w-2.5 h-2.5 bg-gray-900' 
                  : 'w-2.5 h-2.5 bg-gray-400 hover:bg-gray-600'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;