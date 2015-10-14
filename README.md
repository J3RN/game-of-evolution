# Darwin's Game of Evolution

Check out a live running version [on my website](http:/j3rn.com/goe).

## Running
- Simply open `index.html` in your browser.

## Rules

### Individuals

- Each color represents a species. Individuals can only mate with other individuals in their species.
- When mating, the offspring can appear on the left or right of a mating pair (their left and right).
- Offspring have a set of DNA that is a arbitrary subset of constant size of the union of it's parents DNA strands.
- Individuals who do not eat after 14 turns (~ 1.4 seconds) die of starvation.
- Individuals can eat any other individuals, in accordance with their DNA.
- Individuals have a size (1 - 10, inclusive). Individuals can only eat other individuals that are smaller than them.
    - TODO: Hitpoints?
- Individuals have a maximum lifespan (10 seconds)
- Individuals have a speed, but it is not currently used
    - TODO: Make it do something
- TODO: Memory system?

### Game

- The game will end only by one of the following:
    - All individuals are dead
    - The maximum time (30 seconds) have expired
- The game starts with:
    - 20 species
    - 600 individuals (30 per species)

## Development

The game code is in four files:
- `js/game.js`
- `js/creature.js`
- `js/dna.js`
- `js/species.js`

It used to rely on jQuery, but jQuery was far too slow. There is also `js/canvas_adapter.js`, but it should not need to be modified other than for performance reasons.

### `game.js`

- Should contain all non-creature game logic
- Creates the board
- Creates species and individuals and places them on the board
- Redraws the game
- Restarts the game when it is "over", as defined above

### `creature.js`

- All creature behavior
- Creature configuration (lifespan, starvation)

### `dna.js`

- Handles creation of DNA
- Handles merging of DNA to create a new individual
    - TODO: Possible mutation

### `species.js`

- Holds all species
- Handles creation of new species
