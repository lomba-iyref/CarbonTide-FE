import Hero from "@/sections/landing/hero";
import Why from "@/sections/landing/why";
import Solution from "@/sections/landing/solution";

export default function Home() {
  return (
    <div className="flex flex-col w-xs md:w-2xl lg:w-5xl xl:w-7xl items-center justify-center gap-25 mt-40 mb-15">
      <Hero />
      <Why />
      <Solution />
    </div>
  );
}
