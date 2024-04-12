"use client"
import Hot from "@/(home)/Hot";
import Tech from "app/(home)/Tech";
import Travel from "app/(home)/Travel";
import Other from "app/(shared)/Other";
import Sidebar from "app/(shared)/Sidebar";
import { Post } from "./types";
import usePosts from "./utils/fetchPosts";
import Loading from "./post/loading";
import { compareCreatedAt, toDate } from "./utils/formattDate";
import { useEffect } from "react";

const Home = () => {
  const posts = usePosts();
  const sortedPosts = posts.slice().sort(compareCreatedAt);

  const hotPosts: Post[] = sortedPosts.filter((post) => {
    const currentDate = new Date().getTime();
    const postDate = toDate(post.createdAt);
    const timeDifference = currentDate - postDate.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);

    return daysDifference <= 100;
  });

  const techPosts: Post[] = [];
  const travelPosts: Post[] = [];
  const otherPosts: Post[] = [];

  sortedPosts.forEach((post) => {
    if (post.category === "Tech") {
      techPosts.push(post);
    } else if (post.category === "Travel") {
      travelPosts.push(post);
    } else {
      otherPosts.push(post);
    }
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!posts.length) {
    return <Loading />;
  }

  return (
    <main className="px-5 sm:px-10 leading-7">
      {posts.length > 0 && (
        <>
          {hotPosts.length > 0 && <Hot hotPosts={hotPosts} />}
          <div className="md:flex gap-10 mb-5">
            <div className="basis-3/4">
              <Tech techPosts={techPosts} />
              <Travel travelPosts={travelPosts} />
              <Other otherPosts={otherPosts} />
            </div>
            <div className="basis-1/4">
              <Sidebar />
            </div>
          </div>
        </>
      )}
    </main>
  );
}

export default Home

