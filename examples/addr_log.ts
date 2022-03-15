for await (const conn of Deno.listen({ port: 8000 })) {
    console.log(conn.remoteAddr);
    conn.close();
}
