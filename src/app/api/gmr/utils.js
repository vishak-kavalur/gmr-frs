import { POST as facePost } from "../proxy/route";
import { NextResponse } from "next/server";

const apiBase = process.env.INTERNAL_API_BASE;

// const updateFaceDB =  async (id, image) => {
//     const newRequest = new Request(
//       `${apiBase}/api/proxy?service=frs&endpoint=/subject/add-image`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           subjectName: id,
//           imageInBase64: image,
//         }),
//       }
//     );
//     const faceResult = await facePost(newRequest);
//     console.log("result", faceResult.status);
//     if (faceResult.status != 200) {
//         return NextResponse.json(
//         {
//             status: "error",
//             message: "Failed to update face image",
//             data: null,
//         },
//         { status: 500 }
//         );
//     }
//     const faceData = await faceResult.json();
//     console.log("faceData", faceData);
//     if (
//         !faceData.message ||
//         !faceData.message.includes("Image added successfully")
//     ) {
//         return NextResponse.json(
//         {
//             status: "error",
//             message: "Failed to update face image",
//             data: null,
//         },
//         { status: 500 }
//         );
//     }
// }

const updateFaceDB = async (id, image) => {
  // First API call to /subjects endpoint
  const firstRequest = new Request(
    `${apiBase}/api/proxy?service=frs&endpoint=/subjects`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject: id,
      }),
    }
  );

  const firstResult = await facePost(firstRequest);
  console.log("first result", firstResult.status);

  if (firstResult.status != 200) {
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to update face image",
        data: null,
      },
      { status: 500 }
    );
  }

  const firstData = await firstResult.json();
  console.log("firstData", firstData);

  // timeout before next request
  // console.log("Waiting for 2 seconds before next request:", new Date().toISOString());
  // await new Promise((r) => setTimeout(r, 2000));
  // console.log("Continuing after wait:", new Date().toISOString());


  // Second API call to /faces endpoint
  const secondRequest = new Request(
    `${apiBase}/api/proxy?service=frs&endpoint=/faces?subject=${id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file: image,
      }),
    }
  );

  const secondResult = await facePost(secondRequest);
  console.log("second result", secondResult.status);

  if (secondResult.status != 200) {
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to update face image",
        data: null,
      },
      { status: 500 }
    );
  }

  const secondData = await secondResult.json();
  console.log("secondData", secondData);
};

const oneToNMatch = async (image) => {
  const newRequest = new Request(
    `${apiBase}/api/proxy?service=frs&endpoint=/recognize`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file: image,
      }),
    }
  );
  const faceResult = await facePost(newRequest);
  console.log("result oneToNMatch", faceResult.status);
  
  const faceData = await faceResult.json();
  console.log(
    "faceData",
    faceData.result[0].subjects[0].similarity,
    faceData.result[0].subjects[0].subject
  );
  if (faceData.statusCode == 400 || !faceData.result[0].subjects[0].similarity) {
    return NextResponse.json(
      {
        status: "error",
        message: "Match not found",
        data: null,
      },
      { status: 500 }
    );
  }
  if (faceResult.status != 200) {
    return NextResponse.json(
      {
        status: "error",
        message: "Incorrect image type",
        data: null,
      },
      { status: faceResult.status }
    );
  }
  return faceData;
};

// const addToQueue =  async (data) => {
//   const newRequest = new Request(
//     "http://localhost:3000/api/proxy?service=mq&endpoint=/ipts-publish-to-queue",
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     }
//   );
//   const result = await facePost(newRequest);
//   console.log("result addToQueue", result.status);
//   if (result.status != 200) {
//     return NextResponse.json(
//       {
//         status: "error",
//         message: "Failed to add to queue",
//         data: null,
//       },
//       { status: faceResult.status }
//     );
//   }
//   return await result.json();
// }

export { updateFaceDB, oneToNMatch };