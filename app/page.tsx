"use client"
import Hot from "@/(home)/Hot";
import Tech from "app/(home)/Tech";
import Travel from "app/(home)/Travel";
import Other from "app/(shared)/Other";
import Sidebar from "app/(shared)/Sidebar";
import { Post } from "./types";
import usePosts from "./utils/fetchPosts";
import Loading from "./post/loading";

export default function Home() {
  const posts = usePosts();

  const compareCreatedAt = (a: Post, b: Post) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  };

  const sortedPosts = posts.sort(compareCreatedAt);

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const hotPosts = sortedPosts.filter((post) => {
    const postDate = new Date(post.createdAt);
    const timeDifference = currentDate.getTime() - postDate.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);

    return daysDifference <= 100;
  });

  const techPosts: Post[] = [];
  const travelPosts: Post[] = [];
  const otherPosts: Post[] = [];

  sortedPosts.forEach((post) => {
    if (post?.category === "Tech") {
      techPosts.push(post);
    } else if (post?.category === "Travel") {
      travelPosts.push(post);
    } else {
      if (!techPosts.includes(post) && !travelPosts.includes(post) && !otherPosts.includes(post)) {
        otherPosts.push(post);
      }
    }
  });

  if (!posts.length) {
    return <Loading />;
  }

  return (
    <main className="px-5 sm:px-10 leading-7">
      {posts.length > 0 && (
        <>
          {hotPosts && <Hot hotPosts={hotPosts} />}
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


