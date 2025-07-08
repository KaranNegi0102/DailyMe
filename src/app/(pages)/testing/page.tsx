import React from "react";
import Image from "next/image";

const page = () => {
  return (
    <div>
      <Image
        src="https://res.cloudinary.com/dyia5zkkd/image/upload/v1751986603/an-anime-girl-serene-fall-sh-1400x900_vvfgbx.jpg"
        alt="Blog"
        width={400}
        height={400}
        className="w-146 m-20 h-68 object-cover"
      />
    </div>
  );
};

export default page;
