import { Header } from "@/components/Header";
import Experience from "@/components/Experience";
import SmoothScroll from "@/components/SmoothScroll";
import Choreography from "@/components/Choreography";
import { Hero } from "@/components/sections/Hero";
import { Awareness } from "@/components/sections/Awareness";
import { Vitamins } from "@/components/sections/Vitamins";
import { Sport } from "@/components/sections/Sport";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Experience />
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
