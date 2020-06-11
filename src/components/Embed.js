import React, { useState } from "react";
import Carousel, { Dots } from "@brainhubeu/react-carousel";
import "@brainhubeu/react-carousel/lib/style.css";

import { FaChevronCircleLeft, FaChevronLeft, FaChevronCircleRight, FaChevronRight } from 'react-icons/fa';

export const Embed = ({ item }) => (
  <div key={item.id}>
    <h3>{item.name}</h3>
    <h4>{item.date}</h4>
    <div dangerouslySetInnerHTML={{ __html: item.html }} />
  </div>
);

export const EmbedSlider = ({slides}) => {
  const [value, setValue] = useState(0);

  return (
    <div>
      <Carousel
        arrowLeft={<FaChevronLeft />}
        arrowLeftDisabled={<FaChevronCircleLeft />}
        arrowRight={<FaChevronRight />}
        arrowRightDisabled={<FaChevronCircleRight />}
        addArrowClickHandler

        value={value}
        slides={slides}
        onChange={setValue}
      />
      <Dots
        value={value}
        onChange={setValue}
        number={slides.length}
      />
    </div>
  )
};
