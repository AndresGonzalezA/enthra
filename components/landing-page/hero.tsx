"use client";

import { useState } from "react";
import { useKeenSlider, KeenSliderPlugin } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    title: "Monitoreo solar",
    text: "Visualiza el rendimiento de tus sistemas solares en tiempo real, desde cualquier lugar.",
  },
  {
    title: "Equipos biomédicos",
    text: "Localiza y gestiona tus equipos críticos en hospitales con tecnología indoor tracking.",
  },
  {
    title: "Captura desde PLC",
    text: "Extrae datos de tus procesos industriales para análisis y automatización.",
  },
  {
    title: "Desarrollo a medida",
    text: "Creamos soluciones IoT totalmente personalizadas para tus procesos únicos.",
  },
];

const autoplay: KeenSliderPlugin = (slider) => {
  let timeout: ReturnType<typeof setTimeout>;
  let mouseOver = false;
  const clearNext = () => clearTimeout(timeout);
  const next = () => {
    clearNext();
    if (!mouseOver) timeout = setTimeout(() => slider.next(), 6000);
  };
  slider.on("created", () => {
    slider.container.addEventListener("mouseover", () => {
      mouseOver = true;
      clearNext();
    });
    slider.container.addEventListener("mouseout", () => {
      mouseOver = false;
      next();
    });
    next();
  });
  slider.on("dragStarted", clearNext);
  slider.on("animationEnded", next);
  slider.on("updated", next);
};

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      slideChanged(s) {
        setCurrentSlide(s.track.details.rel);
      },
      created() {
        setLoaded(true);
      },
    },
    [autoplay]
  );

  const bgImage = "/images/landing-page/dashboard-screenshot.png";

  return (
    <section id="hero" className="relative overflow-hidden">
      {/* Slider */}
      <div ref={sliderRef} className="keen-slider">
        {slides.map(({ title, text }, i) => (
          <div key={i} className="keen-slider__slide">
            <div
              className="relative h-[600px] bg-cover bg-center"
              style={{ backgroundImage: `url('${bgImage}')` }}
            >
              <div className="absolute inset-0 bg-white/30 dark:bg-black/50" />
              <motion.div
                className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center text-default-900 dark:text-white max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  {title}
                </h2>
                <p className="mb-6 text-lg">{text}</p>
                <div className="flex gap-4">
                  <Button asChild size="lg">
                    <Link href="#contact">Contáctanos</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="#projecttools">Ver tecnologías</Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        ))}
      </div>

      {/* Flechas sobrias */}
      {loaded && instanceRef.current && (
        <>
          <button
            onClick={() => instanceRef.current?.prev()}
            className="absolute top-1/2 left-4 -translate-y-1/2 p-2 text-white dark:text-white/90 hover:text-primary transition"
            aria-label="Anterior"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={() => instanceRef.current?.next()}
            className="absolute top-1/2 right-4 -translate-y-1/2 p-2 text-white dark:text-white/90 hover:text-primary transition"
            aria-label="Siguiente"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}

      {/* Indicadores */}
      {loaded && instanceRef.current && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={`w-3 h-3 rounded-full transition-colors ${
                idx === currentSlide
                  ? "bg-primary"
                  : "bg-white/60 dark:bg-white/30"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
