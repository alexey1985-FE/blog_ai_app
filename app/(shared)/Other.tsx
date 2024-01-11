"use client"
import React, { useEffect, useState } from "react";
import Card from "./Card";
import { Post } from "@/types";
import { useGroupedPosts } from "@/utils/groupPosts";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import useMedia from "use-media";

type Props = {
  otherPosts: Post[];
};

const Other = ({ otherPosts }: Props) => {
  const isPhone = useMedia('(max-width: 450px)');
  const isMobile = useMedia('(max-width: 767px)');
  const groupSize = isMobile ? 2 : 4;

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedCategory(selectedValue);
  };

  const uniqueCategories = Array.from(new Set(otherPosts.map(post => post.category)));

  const filteredPosts = selectedCategory
    ? otherPosts.filter(post => post.category === selectedCategory)
    : otherPosts;

  useEffect(() => {
    if (selectedCategory && !uniqueCategories.includes(selectedCategory)) {
      setSelectedCategory(null);
    }
  }, [selectedCategory, uniqueCategories]);

  const groupedFilteredPosts = useGroupedPosts(filteredPosts, groupSize);

  return (
    <section className="pt-4 mb-16">
      <hr className="border-1" />
      {/* HEADER */}
      <div className={`my-8 ${isPhone ? 'block' : 'flex justify-between'}`}>
        <p className={`font-bold text-2xl ${isPhone ? 'block mb-6' : 'flex justify-between'}`}>Other Trending Posts</p>
        <select
          value={selectedCategory || ""}
          onChange={handleCategoryChange}
          className={`border-4 border-accent-orange rounded-[3.25rem] p-2 focus:outline-none ${isPhone && 'w-full'}`}
        >
          <option value="">Default posts</option>
          {uniqueCategories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <Swiper
        grabCursor
        modules={[Navigation]}
        spaceBetween={30}
        slidesPerView={1}
        className="max-w-[100vw] md:max-w-[75vw]"
        speed={800}
      >
        {groupedFilteredPosts.map((group, groupIndex) => (
          <SwiperSlide key={groupIndex}>
            <div className="sm:grid grid-cols-2 gap-16">
              {group.map((post, index) => (
                <React.Fragment key={post.id}>
                  {isMobile ?
                    <Card
                      className={`col-span-1 row-span-1 gap-x-2 ${index === 0 ? 'mb-8' : 'mb-0'}`}
                      imageHeight={"h-80"}
                      post={post}
                      postsName="Other"
                    /> :
                    <Card
                      className="mt-5 sm:mt-0"
                      imageHeight="h-80"
                      post={post}
                      postsName="Other"
                      isLongForm={index === 0}
                      isSmallCard={index !== 0}
                    />
                  }
                </React.Fragment>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Other;
