// import { NextResponse } from "next/server";



// export async function POST(req: Request) {
//   const headers = new Headers();
//   headers.append("Access-Control-Allow-Origin", "http://localhost:3002"); // Frontend URL
//   headers.append("Access-Control-Allow-Methods", "POST, OPTIONS");
//   headers.append("Access-Control-Allow-Headers", "Content-Type, Authorization");

//   // Handle preflight request for CORS
//   if (req.method === "OPTIONS") {
//     return new NextResponse(null, { status: 204, headers });
//   }

//   try {
//     const formData = await req.formData();
//     const file = formData.get("file");

//     if (!file) {
//       return new NextResponse(JSON.stringify({ error: "No file uploaded" }), {
//         status: 400,
//         headers,
//       });
//     }


//     console.log("File received:", file);

//     return new NextResponse(
//       JSON.stringify({ success: true, message: "File uploaded successfully" }),
//       {
//         status: 200,
//         headers,
//       }
//     );
//   } catch (errorInfo: unknown) {
//     return new NextResponse(
//       JSON.stringify({ error: "Failed to upload file" }),
//       {
//         status: 500,
//         headers,
//       }
//     );
//   }
// }





import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

// Allowed file types and max file size
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: Request) {
  // CORS Headers
  const headers = new Headers();
  headers.append("Access-Control-Allow-Origin", "http://localhost:3002");
  headers.append("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.append("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight request for CORS
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers });
  }

  try {
    // Validate request is FormData
    const contentType = req.headers.get("content-type");
    if (!contentType?.includes("multipart/form-data")) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid request format" }),
        { status: 400, headers }
      );
    }

    // Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File;

    // Validate file exists
    if (!file) {
      return new NextResponse(
        JSON.stringify({ error: "No file uploaded" }),
        { status: 400, headers }
      );
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return new NextResponse(
        JSON.stringify({
          error: "Invalid file type",
          allowedTypes: ALLOWED_FILE_TYPES
        }),
        { status: 400, headers }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return new NextResponse(
        JSON.stringify({
          error: "File too large",
          maxSize: `${MAX_FILE_SIZE / 1024 / 1024}MB`
        }),
        { status: 400, headers }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 7);
    const fileExtension = path.extname(file.name);
    const uniqueFilename = `${timestamp}-${randomString}${fileExtension}`;

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Full path for file
    const filePath = path.join(uploadDir, uniqueFilename);

    // Convert file to buffer and write
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Return success response
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "File uploaded successfully",
        filename: uniqueFilename,
        path: `/uploads/${uniqueFilename}`
      }),
      { status: 200, headers }
    );

  } catch (error: unknown) {
    // Detailed error logging
    console.error("File upload error:", error);

    // Determine error message
    const errorMessage = error instanceof Error
      ? error.message
      : "An unexpected error occurred during file upload";

    // Error response
    return new NextResponse(
      JSON.stringify({
        error: "Failed to upload file",
        details: errorMessage
      }),
      { status: 500, headers }
    );
  }
}

// CORS pre-flight handler
export async function OPTIONS() {
  const headers = new Headers();
  headers.append("Access-Control-Allow-Origin", "http://localhost:3002");
  headers.append("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.append("Access-Control-Allow-Headers", "Content-Type, Authorization");

  return new NextResponse(null, {
    status: 204,
    headers
  });
}