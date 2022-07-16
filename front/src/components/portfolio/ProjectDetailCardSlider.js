import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const ProjectDetailCardSlider = ({ slides }) => {
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
    <Container>
      <SliderContainer ref={slideRef}>
        {slides.map((slide, idx) => (
          <Slide key={idx} src={slide.saveFilePath} />
        ))}
      </SliderContainer>
      <PrevBtn onClick={() => handleSlide("prev")}>
        <FontAwesomeIcon
          icon={faChevronLeft}
          style={{ background: "transparent" }}
        />
      </PrevBtn>
      <NextBtn onClick={() => handleSlide("next")}>
        <FontAwesomeIcon
          icon={faChevronRight}
          style={{ background: "transparent" }}
        />
      </NextBtn>
    </Container>
  );
};

export default ProjectDetailCardSlider;

const Container = styled.div`
  width: 500px;
  margin: auto;
  height: 500px;
  position: relative;
  overflow: hidden;
`;

const SliderContainer = styled.div`
  width: 500px;
  height: 500px;
  margin: auto;
  display: flex;
`;

const Slide = styled.img`
  width: 500px;
  height: 500px;
`;

const PrevBtn = styled.div`
  position: absolute;
  top: 220px;
  left: 10px;
  border: none;
  color: white;
  font-size: 50px;
  background: transparent;
  cursor: pointer;
`;

const NextBtn = styled.div`
  position: absolute;
  top: 220px;
  right: 10px;
  border: none;
  color: white;
  font-size: 50px;
  background: transparent;
  cursor: pointer;
`;
