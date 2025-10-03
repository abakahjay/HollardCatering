// import React, { useEffect, useState } from 'react';
// import { fetchImage } from './fetchImage';


// export const ProfileUrl = (Id) => {
//     const [url, setUrl] = useState({});
//     useEffect(() => {
//         const fetchImages = async () => {
//                 try {
//                     const imageURL = await fetchImage(Id);
//                     setUrl(imageURL);
//                 } catch (err) {
//                     console.error(err);
//                 }
//         };

        
//             fetchImages();
//     }, []);

//     return url;
// };

// utils/imageUrl.js
export const ProfileUrl = (imageId) => {
  if (!imageId) return "";
  const apiUrl = import.meta.env.VITE_API_URL;
  return `${apiUrl}/api/v1/posts/image/${imageId}`;
};
