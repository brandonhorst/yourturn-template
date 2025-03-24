# Claude Assistance Guidelines for yourturn-empty

This is a template for implementing an online turn-based game web app using a
library called yourturn (https://jsr.io/@brandonhorst/yourturn). It uses Deno
Fresh v1 and Tailwind v3 for styling.

## Implementing Games

Games are built with game logic in the `game` directory, by implementing
`yourturn` types. Before starting, access the yourturn type documentation by
running this shell command: `deno doc jsr:@brandonhorst/yourturn/types`. You
will need to use these types to build the game.

For the `processMove` function and the optional `refresh` function, it is highly
recommended to use `npm:immer@10` library (as shown in all examples). Also, use
the Deno Standard Library when necessary. `jsr:@std/random@0.1` is particularly
useful for games.

The UI is built using Preact views styled with inline Tailwind v3 classes. These
views live in the `components` directory. The root views are `PlayerView` and
`ObserverView` in `gameviews.tsx`, and `LobbyView` in `lobbyviews.tsx`.

After creating a game, makes sure to lint/typecheck it and fix errors.

## Examples

Important: When building a game, use the provided examples to understand how the
library should be used. Examples of both the game logic and the views live in
the `examples` directory. Read the examples you think are most appropriate to
the game you're building, and examples closely.

- `examples/rockpaperscissors` - basic actions, simultaneous gameplay, multiple
  rounds, configuration
- `examples/gomoku` - board rendering, timer, configuration
- `examples/uno` - card rendering, out-of-turn play, variable player count,
  configuration

## Commands

- Lint/Typecheck: `deno lint`
- Test: `deno test`
- Format: `deno fmt`

## Project Structure

- Fresh/Deno project, `routes`, `islands`, `components`, and `static` are all
  standard Deno Fresh directories.
- Deno KV database is used for persistent storage, but this is handled by the
  `yourturn` library itself.
- WebSockets are used for game state communication, but this is handled by the
  `yourturn` library itself.

In general, to build a game, the `islands` and `routes` directories will not
need to be touched. They govern the URL structure of the pages and WebSockets.
If you do need to modify them in order to change the URL structure or something
like that, you can access the documentation with one of these shell commands:
`deno doc jsr:@brandonhorst/yourturn/server`,
`deno doc jsr:@brandonhorst/yourturn/hooks`.
