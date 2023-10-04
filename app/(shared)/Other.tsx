import React from "react";
import Card from "./Card";
import { Post } from "@/types";

type Props = {
	otherPosts: Post[];
	elsePosts: Post[];
};

const Other = ({ otherPosts, elsePosts }: Props) => {
	// console.log(elsePosts);

	return (
		<section className="pt-4 mb-16">
			<hr className="border-1" />
			{/* HEADER */}
			<p className="font-bold text-2xl my-8">Other Trending Posts</p>
			<div className="sm:grid grid-cols-2 gap-16">
				{otherPosts.map(otherpost => (
					<React.Fragment key={otherpost.id}>
						<Card className="mt-5 sm:mt-0" imageHeight="h-80" post={otherpost} />
					</React.Fragment>
				))}

				{elsePosts.map(otherpost => (
					<React.Fragment key={otherpost.id}>
						<Card className="mt-5 sm:mt-0" imageHeight="h-80" post={otherpost} />
					</React.Fragment>
				))}

				{/* <Card
          className="mt-5 sm:mt-0"
          imageHeight="h-80"
          post={otherPosts[0]}
        />
        <Card
          className="mt-5 sm:mt-0"
          imageHeight="h-80"
          post={otherPosts[1]}
        />
        <Card
          className="mt-5 sm:mt-0"
          imageHeight="h-80"
          post={otherPosts[2]}
        />
        <Card
          className="mt-5 sm:mt-0"
          imageHeight="h-80"
          post={otherPosts[3]}
        /> */}
			</div>
		</section>
	);
};

export default Other;