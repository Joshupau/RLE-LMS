'use client'

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function CarouselPlugin() {
  const images = [
    { src: '/NaoBanner.jpg' },
    { src: '/Naocarousel1.jpg' },
    { src: '/naocarousel.png' },
  ];

  const carouselRef = React.useRef(null);
  const autoplay = React.useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  return (
    <Carousel
      plugins={[autoplay.current]}
      onMouseEnter={() => autoplay.current.stop()}
      onMouseLeave={() => autoplay.current.reset()}
      >
      <CarouselContent  className="h-full">
        {images.map((image, index) => (
            <CarouselItem key={index}>
              <Card>
                  <img
                    src={image.src}
                    alt={`Image ${index + 1}`}
                    />
              </Card>
          </CarouselItem>
        ))}
      </CarouselContent>

    </Carousel>
  );
}

export default CarouselPlugin;
