'use client'
import { Post } from "@/types";
import Card from "app/(shared)/Card";
import React from "react";
import useMedia from 'use-media'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import 'swiper/css/navigation';
import { useGroupedPosts } from "@/utils/groupPosts";

type Props = {
  techPosts: Post[];
};

const Tech = ({ techPosts }: Props) => {
  const isMobile = useMedia('(max-width: 767px)');
  const groupSize = isMobile ? 1 : 4;
  const groupedHotPosts = useGroupedPosts(techPosts, groupSize);

  return (
    <section>
      <hr className="border-1" />
      {/* HEADER */}
      <div className="flex items-center gap-3 my-8">
        <h4 className="bg-indigo-300 py-2 px-5 text-wh-900 text-sm font-bold">TECH</h4>
        <p className="font-bold text-2xl dark:text-accent-orange">Latest News in Technology</p>
      </div>

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
            <div className="sm:grid grid-cols-2 grid-rows-2 gap-x-8 gap-y-8 mt-5 mb-0 md:pb-3">
              {group.map((post, index) => (
                <React.Fragment key={post.id}>
                  {isMobile ?
                    <Card
                      className={"col-span-1 row-span-1"}
                      imageHeight={"h-80"}
                      post={post}
                    /> :
                    <Card
                      className={`col-span-1 row-span-1 ${index === 0 ? "row-span-3" : "flex justify-between"
                        } gap-3`}
                      imageHeight={index === 0 ? "sm:h-1/2 md:h-2/3" : "h-full"}
                      post={post}
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

export default Tech;
