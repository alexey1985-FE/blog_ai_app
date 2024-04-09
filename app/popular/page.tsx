"use client"
import React, { useEffect, useState } from "react";
import usePosts, { getPopularSortedPosts } from "@/utils/fetchPosts";
import Card from "@/(shared)/Card";
import { Post } from "@/types";
import Loading from "@/post/loading";

const PopularPosts = () => {
  const allPosts = usePosts();
  const [popularSortedPosts, setPopularSortedPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPopularSortedPosts = async () => {
      try {
        const posts = await getPopularSortedPosts(allPosts);
        setPopularSortedPosts(posts);
      } catch (error) {
        console.error("Error fetching popular sorted posts:", error);
      }
    };

    fetchPopularSortedPosts();
  }, [allPosts]);

  if (!popularSortedPosts.length) {
    return <Loading />;
  }

  return (
    <section className="p-6 pb-10 grow">
      {popularSortedPosts.length > 0 &&
        <>
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-wh-900 py-2 px-8 text-wh-10 text-sm font-bold">POPULAR</div>
            <p className="text-sm">
              Nunc enim lobortis quam risus et feugiat nibh eu ornare. Molestie sit nulla
              dolor diam turpis.
            </p>
          </div>

          <div className="md:grid gap-10 grid-cols-3 grid-rows-2 my-3">
            {popularSortedPosts.map(post => (
              <Card
                className="col-span-1 row-span-1 mb-10 md:mb-0"
                post={post}
                key={post.id}
                imageHeight="h-80"
              />
            ))}
          </div>
        </>}
    </section>
  );
};

export default PopularPosts;
