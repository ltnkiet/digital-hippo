import React from "react";
import { formatPrice, renderStar } from "utils/helpers";
import {Link} from 'react-router-dom'

const ProductCardV2 = ({ data }) => {
  return (
    <Link className="w-full border flex flex-auto"
    to={`/${data?.category?.name}/${data?._id}/${data?.title}`}
    >
      <img src={data?.thumb} alt="" className="w-[150px] object-contain p-4 hover:p-0" />
      <div className="flex flex-col py-4 gap-2">
        <p class="text-sm font-semibold tracking-tight text-gray-900 dark:text-white line-clamp-2">
          {data?.title}
        </p>
        <div class="flex items-center">
          {renderStar(data?.totalRating)}
          <span class="bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">
            {data?.totalRating}
          </span>
        </div>
        <div>
          <span className="italic">{`{${data?.rating.length}}: lượt đánh giá`}</span>
        </div>
        <span class="text-sm font-bold text-gray-900 dark:text-white hover:underline cursor-pointer">
          {formatPrice(data?.price)}
        </span>
      </div>
    </Link>
  );
};

export default ProductCardV2;
