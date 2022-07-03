# bun-livereload

Wrap a function with `bun-livereload` to automatically reload any imports _inside_ the function the next time it is called.

```ts
import liveReload from "bun-livereload";

export default {
  fetch: liveReload(async function (req: Request) {
    const { render } = await import("./my-page.js");
    return new Response(render(req));
  }),
};
```

## Install

```bash
bun add bun-livereload
```
