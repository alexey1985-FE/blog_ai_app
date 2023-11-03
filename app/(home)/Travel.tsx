"use client"
import React from "react";
import Card from "app/(shared)/Card";
import { Post } from "@/types";
import useMedia from "use-media";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useGroupedPosts } from "@/utils/groupPosts";

type Props = {
  travelPosts: Post[];
};

const Travel = ({ travelPosts }: Props) => {
  const isMobile = useMedia('(max-width: 767px)');
  const groupSize = isMobile ? 1 : 4;
  const groupedHotPosts = useGroupedPosts(travelPosts, groupSize);

  return (
    <section className="mt-10">
      <hr className="border-1" />
      {/* HEADER */}
      <div className="flex items-center gap-3 my-8">
        <h4 className="bg-accent-green py-2 px-5 text-wh-900 text-sm font-bold">
          TRAVEL
        </h4>
        <p className="font-bold text-2xl">New Travel Experiences</p>
      </div>

      {/* CARDS ROW */}
      {/* <div className="sm:flex justify-between gap-8">
        <Card
          className="basis-1/3 mt-5 sm:mt-0"
          imageHeight="h-80"
          post={travelPosts[0]}
        />
        <Card
          className="basis-1/3 mt-5 sm:mt-0"
          imageHeight="h-80"
          post={travelPosts[1]}
        />
        <Card
          className="basis-1/3 mt-5 sm:mt-0"
          imageHeight="h-80"
          post={travelPosts[2]}
        />
      </div>
      <Card
        className="sm:flex justify-between items-center gap-3 mt-7 mb-5"
        imageHeight="h-80"
        post={travelPosts[3]}
      /> */}

      <Swiper
        grabCursor
        modules={[Navigation]}
        spaceBetween={30}
        slidesPerView={1}
        className="max-w-[100vw] md:max-w-[75vw]"
        speed={800}
      >
        {groupedHotPosts.map((group, groupIndex) => (
          <SwiperSlide key={groupIndex}>
            <div className="sm:flex justify-between gap-8">
              {group.slice(0, 3).map((post, index) => (
                <Card
                  key={post.id}
                  className="basis-1/3 mt-5 sm:mt-0"
                  imageHeight="h-80"
                  post={post}
                />
              ))}
            </div>
            {group.slice(3).map((post) => (
              <Card
                key={post.id}
                className="sm:flex justify-between items-center gap-3 mt-7 mb-5"
                imageHeight="h-80"
                post={post}
              />
            ))}
          </SwiperSlide>
        ))}
      </Swiper>




    </section>
  );
};

export default Travel;
