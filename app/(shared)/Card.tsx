"use client"
import { Post } from "@/types";
import { toDate } from "@/utils/formattDate";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  className?: string;
  post: Post;
  postsName?: string;
  imageHeight: string;
  isSmallCard?: boolean;
  isLongForm?: boolean;
};

const Card = ({
  className,
  imageHeight,
  post,
  postsName,
  isSmallCard = false,
  isLongForm = false,
}: Props) => {
  const { title, author, createdAt, image, snippet, category, id } = post;
  const pathName = usePathname();
  const pageName = pathName.split('/').pop();

  const date = toDate(createdAt)
  const options = { year: "numeric", month: "long", day: "numeric" } as any;
  const formattedDate = date.toLocaleDateString("en-US", options);

  return (
    <>
      {postsName === 'Hot' && imageHeight === '' ?
        (<Link
          className={`${className} sm:mt-0 sm:h-auto relative mt-7 block w-full h-96 hover:opacity-70`}
          href={`${process.env.NEXT_PUBLIC_URL}/post/${id}`}
        >
          <div className="z-0 relative w-full h-full">
            {image && (
              <Image
                fill
                alt="tech"
                src={image}
                sizes="(max-width: 480px) 100vw,
            (max-width: 768px) 75vw,
            (max-width: 1060px) 50vw,
            33vw"
                style={{ objectFit: "cover" }}
                placeholder="blur"
                blurDataURL="/assets/blurred_loading.jpg"
              />
            )}
          </div>
          <div className="absolute z-2 bottom-0 left-0 p-3">
            <h4 className="inline-block px-5 py-1 font-semibold bg-accent-orange text-wh-900">
              {category}
            </h4>
            <div className="text-slate-200 mt-2 text-lg">
              {title}
            </div>
          </div>
        </Link>) :
        (<div className={className}>
          <Link
            className="basis-full hover:opacity-70 relative"
            href={`${process.env.NEXT_PUBLIC_URL}/post/${id}`}
          >
            <div className={`relative w-auto mb-3 ${imageHeight}`}>
              {image && (
                <Image
                  fill
                  alt="tech"
                  src={image}
                  sizes="(max-width: 480px) 100vw,
                    (max-width: 768px) 75vw,
                    (max-width: 1060px) 50vw,
                    33vw"
                  style={{ objectFit: "cover" }}
                  placeholder="blur"
                  blurDataURL="/assets/blurred_loading.jpg"
                />
              )}
              {postsName === 'Other' && (
                <div className="absolute z-2 bottom-0 left-0 p-3">
                  <h4 className="inline-block px-5 py-1 font-semibold bg-accent-orange text-wh-900">
                    {category}
                  </h4>
                  <p className="text-white mt-2 text-lg">
                    {title}
                  </p>
                </div>
              )}
            </div>
          </Link>
          <div className="basis-full">
            {pageName === 'popular' && <Link href={`${process.env.NEXT_PUBLIC_URL}/post/${id}`}>
              <h4
                className={`font-bold hover:text-accent-green
              ${isSmallCard ? "text-base" : "text-lg"}
              ${isSmallCard ? "line-clamp-2" : ""}
            `}
              >
                {title}
              </h4>
            </Link>}

            <div className={`${isSmallCard ? "my-2" : "my-3"} flex flex-wrap gap-3`}>
              <h5 className="font-semibold text-xs">{author}</h5>
              <h6 className="text-wh-300 text-xs">{formattedDate}</h6>
            </div>
            <p className={`text-wh-500 dark:text-wh-100 ${isLongForm ? "line-clamp-5" : "line-clamp-3"}`}>
              {snippet}
            </p>
          </div>
        </div>)}
    </>
  );
};

export default Card;
