"use client";

import React from "react";
import { motion } from "framer-motion";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

interface PhilosophySection {
  title: string;
  items: {
    heading: string;
    text: string;
  }[];
}

const philosophySections: PhilosophySection[] = [
  {
    title: "Origin of Form",
    items: [
      {
        heading: "Extensions of Thought",
        text: "Then came the human. The human began to shape the world. A stone became a tool. A wall became a shelter. A vessel held water. A table gathered people around it. Objects were never merely objects. They were extensions of thought.",
      },
      {
        heading: "Ways of Understanding",
        text: "Architecture became a way of understanding space. Clothing became a way of understanding the body. Art became a way of understanding what could not be explained. Ritual became a way of understanding time. Civilisation was built from these things.",
      },
    ],
  },
  {
    title: "The Modern Condition",
    items: [
      {
        heading: "A Louder World",
        text: "And then, somewhere along the way, we began making everything louder. More information. More images. More objects. More opinions. More signals. The world became increasingly intelligent. And increasingly difficult to hear.",
      },
      {
        heading: "The Step Toward Less",
        text: "Perhaps the next step is not more. Perhaps it is less. Less noise. Less explanation. Less performance. More attention. More permanence. More physicality. More thought.",
      },
    ],
  },
  {
    title: "What Remains",
    items: [
      {
        heading: "Spaces & Objects",
        text: "A room that makes you stop. An object that makes you wonder. A garment that changes the way you occupy your body. A building that makes technology disappear. A book that remains on a table long after the screen has gone dark.",
      },
      {
        heading: "Beyond Clothing",
        text: "We are interested in the things that remain when everything unnecessary has been removed. This is why KSHAUM does not begin with clothing. Clothing is only one language. We look at architecture, objects, art, technology, philosophy, culture and the human body as parts of the same world.",
      },
    ],
  },
  {
    title: "Future Intelligence",
    items: [
      {
        heading: "Harmony of Opposites",
        text: "A world where ancient intelligence can meet future intelligence. Where stone can exist beside computation. Where the primitive and the advanced are no longer opposites. Where technology becomes invisible. Where objects regain their weight. Where silence becomes a form of luxury. Where a person does not need to announce who they are.",
      },
      {
        heading: "Silence to Think",
        text: "We make things for that world. Some are worn. Some are held. Some are inhabited. Some simply exist to make you think. And perhaps that is what an object should do. Not tell you what to think. But leave enough silence for you to think for yourself.",
      },
    ],
  },
  {
    title: "The Quiet Choice",
    items: [
      {
        heading: "Belonging to Silence",
        text: "Because the future does not necessarily belong to those who make the most noise. It may belong to those who can remain entirely themselves within it.",
      },
      {
        heading: "POWER WITHOUT PERFORMANCE",
        text: "THE QUIET CHOICE",
      },
    ],
  },
];

export default function PhilosophyPage() {
  return (
    <div className="bg-[#635F58] text-[#F4F4F1] min-h-screen flex flex-col justify-between selection:bg-[#F4F4F1] selection:text-[#635F58]">
      <Navbar />

      <main className="flex-1 pt-32 sm:pt-40 md:pt-44 pb-28 sm:pb-36 px-6 sm:px-10 md:px-16 lg:px-24 max-w-5xl mx-auto w-full">
        {/* Intro / Header Section (2-Column Layout like screenshot) */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 pb-14 sm:pb-16"
        >
          {/* Left Column: Title & Subtitle */}
          <div className="md:col-span-5 lg:col-span-4">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#F4F4F1]">
              KSHAUM
            </h1>
            <p className="text-sm sm:text-base text-[#F4F4F1]/60 font-light mt-1 tracking-normal">
              Philosophy & Manifesto
            </p>
          </div>

          {/* Right Column: Lead Narrative */}
          <div className="md:col-span-7 lg:col-span-8">
            <p className="text-sm sm:text-base md:text-lg text-[#F4F4F1]/85 leading-relaxed font-light">
              <span className="font-medium text-[#F4F4F1] uppercase tracking-wide">
                First came the world.
              </span>{" "}
              Before the object, there was matter. Stone. Water. Light. Shadow. Air.
              Before anyone named them, they simply existed.
            </p>
          </div>
        </motion.section>

        {/* Content Sections (Divider + 2-Column Item Grid) */}
        {philosophySections.map((section, sIndex) => (
          <motion.section
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: sIndex * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-[#F4F4F1]/15 py-12 sm:py-16 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12"
          >
            {/* Left Column: Section Title */}
            <div className="md:col-span-5 lg:col-span-4">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#F4F4F1]">
                {section.title}
              </h2>
            </div>

            {/* Right Column: Stacked Items with Title & Description */}
            <div className="md:col-span-7 lg:col-span-8 space-y-8 sm:space-y-10">
              {section.items.map((item, iIndex) => (
                <div key={iIndex} className="group">
                  <h3 className="text-base sm:text-lg font-medium tracking-tight text-[#F4F4F1] mb-1.5">
                    {item.heading}
                  </h3>
                  <p className="text-sm sm:text-base text-[#F4F4F1]/75 leading-relaxed font-light">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>
        ))}
      </main>

      <Footer />
    </div>
  );
}
