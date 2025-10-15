# yourturn-empty

Template repo for creating turn-based games with
[`yourturn`](https://github.com/brandonhorst/yourturn).

## Getting Started

Clone the repo, then spin up for development with

```sh
deno task dev
```

Note that Fresh v2 uses `vite`, which supports Hot Module Reloading (HMR), to
reload your page while maintaining state if your Preact components change. This
will not re-instantiate the websocket connections that govern gameplay and
matchmaking, so changes to game logic require you to kill and re-run
`deno task dev`.

## Development

This repo is optimized for AI-assisted development. A basic `AGENTS.md` is
provided, and high-quality examples are provided in the `examples` directory.

## Deployment

Games can easily be deployed to Deno Deploy using the "Fresh v2" configuration.
