import Image from 'next/image'
import React from 'react'

interface IAvatar {
  src: string
  alt: string
  width: number
  height: number
}

export const Avatar = ({ src, alt, width, height }: IAvatar) => (
  <Image
    src={src}
    alt={alt}
    width={width}
    height={height}
    style={{
      borderRadius: '50%',
      border: '1px solid gray',
    }}
  />
)
