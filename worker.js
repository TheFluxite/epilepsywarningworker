export default {
  async fetch(request) {
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");

    // Expected path: /id/<number>
    if (pathParts.length !== 3 || pathParts[1] !== "id") {
      return new Response(JSON.stringify({ error: "Invalid endpoint" }), {
        headers: { "Content-Type": "application/json" },
        status: 400
      });
    }

    const idToCheck = Number(pathParts[2]);
    if (isNaN(idToCheck)) {
      return new Response(JSON.stringify({ error: "Invalid ID" }), {
        headers: { "Content-Type": "application/json" },
        status: 400
      });
    }

    // Fetch the JSON from GitHub
    const jsonUrl = "https://raw.githubusercontent.com/TheFluxite/epilepsywarningsdatabase/blob/main/id.json";
    const response = await fetch(jsonUrl);
    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Could not fetch JSON" }), {
        headers: { "Content-Type": "application/json" },
        status: 500
      });
    }

    const idList = await response.json();

    // Check if ID exists
    const exists = idList.includes(idToCheck);
    return new Response(JSON.stringify(exists), {
      headers: { "Content-Type": "application/json" }
    });
  }
};
