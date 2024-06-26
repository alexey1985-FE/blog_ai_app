"use client"
import React from "react";
import { Post } from "@/types";
import Card from "@/(shared)/Card";
import useMedia from "use-media";
import { Swiper, SwiperSlide } from "swiper/react";
import { useGroupedPosts } from "@/utils/groupPosts";
import 'swiper/css/bundle';

type Props = {
  hotPosts: Post[];
};

const Hot = ({ hotPosts }: Props) => {
  const isMobile = useMedia('(max-width: 767px)');
  const groupSize = isMobile ? 1 : 4;
  const groupedHotPosts = useGroupedPosts(hotPosts, groupSize);

  return (
    <section className="pt-3 pb-10">
      <hr className="border-1 pt-10" />
      <div className="flex items-center gap-3">
        <div className="bg-red-500 py-2 px-8 text-wh-10 text-sm font-bold">HOT</div>
        <p className="font-bold text-2xl dark:text-accent-orange">
          Recent
        </p>
      </div>

      <Swiper
        grabCursor
        spaceBetween={30}
        slidesPerView={1}
        className="max-w-[100vw]"
        speed={800}
      >
        {groupedHotPosts.map((group, groupIndex) => (
          <SwiperSlide key={groupIndex}>
            <div className="sm:grid gap-5 grid-cols-4 grid-rows-2 sm:h-[600px] my-3">
              {group.map((post, index) => (
                <React.Fragment key={post.id}>
                  {isMobile ?
                    <Card
                      className={"col-span-1 row-span-1"}
                      imageHeight={""}
                      post={post}
                      postsName="Hot"
                    /> :
                    <Card
                      className={`${index === 0 ? "col-span-2 row-span-2"
                        : index === 1 ? "col-span-2" : "col-span-1 row-span-1"
                        } gap-3`}
                      imageHeight={""}
                      post={post}
                      postsName="Hot"
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

export default Hot;
