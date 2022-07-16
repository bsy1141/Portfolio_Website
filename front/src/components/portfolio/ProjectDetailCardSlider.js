import { useState, useEffect, useRef } from "react";
//import styled from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const ProjectDetailCardSlider = ({ slides }) => {
  console.log(slides[0].saveFilePath);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideRef = useRef(null);

  useEffect(() => {
    slideRef.current.style.transition = "all 0.5s ease-in-out";
    slideRef.current.style.transform = `translateX(-${currentSlide}00%)`;
  }, [currentSlide]);

  const handleSlide = (dir) => {
    if (dir === "prev" && currentSlide > 0) {
      setCurrentSlide((cur) => cur - 1);
    } else if (dir === "next" && currentSlide < slides.length - 1) {
      setCurrentSlide((cur) => cur + 1);
    }
  };
  return (
    <div className="slider_container">
      <div className="slider_wrapper" ref={slideRef}>
        {slides.map((slide, idx) => (
          <img
            className="slider_slide"
            key={idx}
            src={slide.saveFilePath}
            alt="slide_image"
          />
        ))}
      </div>
      <div className="slider_prevBtn" onClick={() => handleSlide("prev")}>
        <FontAwesomeIcon
          icon={faChevronLeft}
          style={{ background: "transparent" }}
        />
      </div>
      <div className="slider_nextBtn" onClick={() => handleSlide("next")}>
        <FontAwesomeIcon
          icon={faChevronRight}
          style={{ background: "transparent" }}
        />
      </div>
    </div>
  );
};

export default ProjectDetailCardSlider;
