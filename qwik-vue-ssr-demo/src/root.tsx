import { component$ } from "@builder.io/qwik";
import Home from "./routes/index";
import "./global.css";

export default component$(() => {
  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <title>Qwik-Vue SSR Interop</title>
      </head>
      <body>
        <Home />
      </body>
    </>
  );
});
