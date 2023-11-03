"use client"
import React from "react";
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
  const isMobile = useMedia('(max-width: 767px)');
  const groupSize = isMobile ? 2 : 4;
  const groupedHotPosts = useGroupedPosts(otherPosts, groupSize);

  return (
    <section className="pt-4 mb-16">
      <hr className="border-1" />
      {/* HEADER */}
      <p className="font-bold text-2xl my-8">Other Trending Posts</p>
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
