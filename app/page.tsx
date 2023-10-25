import Trending from "app/(home)/Trending";
import Tech from "app/(home)/Tech";
import Travel from "app/(home)/Travel";
import Other from "app/(shared)/Other";
import Sidebar from "app/(shared)/Sidebar";
import { Post } from "./types";
import { getPosts } from "./utils/fetchPosts";

export default async function Home() {
  const posts = await getPosts()

  const formatPosts = () => {
    const trendingPosts: Post[] = [];
    const techPosts: Post[] = [];
    const travelPosts: Post[] = [];
    const otherPosts: Post[] = [];
    const elsePosts: Post[] = [];

    posts.forEach((post, i: number) => {
      if (i < 4) {
        trendingPosts.push(post);
      }
      if (post?.category === "Tech") {
        techPosts.push(post);
      } else if (post?.category === "Travel") {
        travelPosts.push(post);
      } else if (post?.category === "Interior Design") {
        otherPosts.push(post);
      } else {
        elsePosts.push(post)
      }
    });

    return [trendingPosts, techPosts, travelPosts, otherPosts, elsePosts];
  };

  const [trendingPosts, techPosts, travelPosts, otherPosts, elsePosts] = formatPosts();

  return (
    <main className="px-10 leading-7">
      <Trending trendingPosts={trendingPosts} />
      <div className="md:flex gap-10 mb-5">
        <div className="basis-3/4">
          <Tech techPosts={techPosts} />
          <Travel travelPosts={travelPosts} />
          <Other otherPosts={otherPosts} elsePosts={elsePosts} />
        </div>
        <div className="basis-1/4">
          <Sidebar />
        </div>
      </div>
    </main>
  );
}
