import { Header } from "@/components/Header";
import Experience from "@/components/Experience";
import SmoothScroll from "@/components/SmoothScroll";
import Choreography from "@/components/Choreography";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { Hero } from "@/components/sections/Hero";
import { Awareness } from "@/components/sections/Awareness";
import { Vitamins } from "@/components/sections/Vitamins";
import { Sport } from "@/components/sections/Sport";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Experience />
      <HeroBackdrop />
      <Choreography />

      <Header />

      <main id="page">
        <Hero />
        <Awareness />
        <Vitamins />
        <Sport />
      </main>

      <div className="grain" aria-hidden />
    </>
  );
}
