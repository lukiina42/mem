import React, { useState } from 'react'

type Dimensions = {
  naturalWidth: number;
  naturalHeight: number;
};

interface MemItemInterface {
  url: string;
  //pixels
  imgMaxH?: number | undefined;
}

export default function CustomImage({url, imgMaxH}: MemItemInterface) {
  const [dimensions, setDimensions] = useState<Dimensions>({
    naturalWidth: 1200,
    naturalHeight: 800,
  });

  const scale = imgMaxH !== undefined ? imgMaxH / dimensions.naturalHeight : null;

  const width = scale === null ? dimensions.naturalWidth : scale * dimensions.naturalWidth
  const height = imgMaxH !== undefined ? dimensions.naturalHeight : imgMaxH 

  return (
    <img
      onLoad={(e) => {
        console.log('loaded')
        const target = e.target as HTMLImageElement;
        setDimensions({
          naturalWidth: target.naturalWidth,
          naturalHeight: target.naturalHeight,
        });
      }}
      src={url}
      alt="Image xd"
      width={width} // Adjust these numbers based on the image's aspect ratio
      height={height}
    />
  )
}
