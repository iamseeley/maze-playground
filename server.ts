import { extname } from "https://deno.land/std/path/mod.ts";

export function startServer() {
  console.log("Server running on http://localhost:8000");

  Deno.serve({ port: 8000 }, async (req) => {
    const url = new URL(req.url);
    let filePath = "." + url.pathname;

    // If root path, serve index.html from the /ui directory
    if (url.pathname === "/") {
      filePath = "./ui/index.html";
    }

   if (url.pathname.startsWith("/ui/")) {
     filePath = `.${url.pathname}`;
   } else if (url.pathname.endsWith(".css")) {
     filePath = `./ui${url.pathname}`;
   } else if (url.pathname.endsWith(".js")) {
     filePath = `./ui/js${url.pathname.slice(4)}`; 
   }


    try {
      // Get the file extension
      const ext = extname(filePath);

      // Determine the content type based on the file extension
      let contentType = "text/plain";
      if (ext === ".html") {
        contentType = "text/html";
      } else if (ext === ".css") {
        contentType = "text/css";
      } else if (ext === ".ts") {
        contentType = "application/typescript";
      }

      // Read and serve the requested file
      const file = await Deno.readFile(filePath);
      return new Response(file, {
        headers: { "content-type": contentType },
      });

    } catch (error) {
      console.error("Error serving file:", error);
      return new Response("File not found", { status: 404 });
    }
  });
}

