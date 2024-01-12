# Better (send)Beacon

A better version of `navigator.sendBeacon`, that doesn't break when you try to queue too many events!<sup><a href="#whaaa">1</a></sup>

## Installation:

```sh
bun add better-beacon
```

## Usage:

```tsx
import BetterBeacon from "better-beacon";

let bbeacon = new BetterBeacon({
  autoTransformJSON: true,
});

// Works just like `navigator.sendBeacon`!
bbeacon.send("/path", "true");

// Automatically converts objects to Blobs under the hood
bbeacon.send("/path", { data: true });
```

## Context:

<div id="#whaaa"></div>
You might be wondering, why does this library exist? Well fortunately for you, I wrote up a short blog post about it available here: [TODO](https://matthamlin.me/)

## Contributing:

### `build`

```sh
bun run build
```

### `test`

```sh
bun test
```

### Tools:

- Typescript
- SWC
- Bun
