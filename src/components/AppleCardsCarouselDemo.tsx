// A:\tarang\src\components\Tarangcourses.tsx

"use client";

import React from "react";
import { Carousel, Card } from "./ui/apple-cards-carousel";

import coursesData from "../data/music_courses.json";

interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  instructor: string;
  isFeatured: boolean;
  image: string;
  longDescription: string;
  whatYouWillLearn: string[];
  targetAudience: string;
}

export function Tarangcourses() {
  const courseItems: Course[] = coursesData.courses;

  const cards = courseItems.map((course, index) => (
    <Card
      key={course.id}
      card={{
        src: course.image,
        title: course.title,
        category: course.instructor,
        content: (
          // Adjusted max-width for expanded card content (again, slightly smaller)
          <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-200">
              {course.title}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-lg font-sans leading-relaxed">
              {course.longDescription}
            </p>

            <div className="bg-gray-50 dark:bg-neutral-800 p-6 rounded-lg shadow-inner">
              <h4 className="text-xl md:text-2xl font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
                What You Will Learn:
              </h4>
              <ul className="list-disc list-inside text-neutral-600 dark:text-neutral-400 text-base md:text-lg space-y-2">
                {course.whatYouWillLearn.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-lg font-sans">
              <span className="font-bold text-neutral-700 dark:text-neutral-300">
                Target Audience:
              </span>{" "}
              {course.targetAudience}
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-lg font-sans">
              <span className="font-bold text-neutral-700 dark:text-neutral-300">
                Instructor:
              </span>{" "}
              {course.instructor}
            </p>

            <p className="text-lg md:text-xl font-bold text-green-700 dark:text-green-400">
              Price: ${course.price.toFixed(2)}
            </p>

            {course.isFeatured && (
              <p className="text-sm md:text-base font-bold text-blue-600 dark:text-blue-400 mt-2">
                🌟 Featured Course! Don't miss out!
              </p>
            )}

            <button className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
              Enroll Now
            </button>

            <img
              src={course.image}
              alt={course.title}
              className="mt-8 rounded-lg shadow-md mx-auto max-w-full h-auto object-contain"
              style={{ maxHeight: "450px" }}
            />
          </div>
        ),
      }}
      index={index}
      className="rounded-xl"
    />
  ));

  return (
    <section className="w-full py-5 ml-0 h-full
                       ">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans text-center mb-6">
        Explore Our Music Courses
      </h2>
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
        <Carousel
          items={cards}
          // Adjusted max-width for carousel cards again for very large screens
          cardClassName="max-w-[16rem] sm:max-w-[18rem] md:max-w-xs lg:max-w-sm xl:max-w-md 2xl:max-w-lg"
        />
      </div>
    </section>
  );
}