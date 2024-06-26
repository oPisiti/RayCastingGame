# Ray Casting Demo

A game based on ray casting that got a bit out of hand

![raycast](https://github.com/oPisiti/RayCastingGame/assets/78967454/b18342f9-86f3-4b6d-8731-6b174e5c14b0)

## How it works

The base of the calculations is the minimap.

On every frame, 1200 lines are created from the player, given a certain angle.

If the line intercepts any wall, their distance is calculated. 

Then, a vertical rectangle is drawn on screen. Its x position is determined by the angle. Its size and shade, by the distance. This creates the illusion of depth and a light fog.

For movement, the position of the player is updated accordingly. For the FOV slider, the difference in the angle of the lines is increased or decreased.

## Usage

Just clone the repo and open `index.html`.

WASD is used for walking and the arrow keys left and right move the camera. Space jumps.

The slider on the bottom left corner adjusts the FOV on the fly.

## Shooter variation

The `Shooter` branch enables a mode in which the left mouse button shoots a light beam.

Such beam bounces of the walls and illuminates them for the player.

![shooter](https://github.com/oPisiti/RayCastingGame/assets/78967454/815dfaf3-3c1c-4a15-a80e-9c1265683810)

# P5js library

This project uses the p5js library.

Thank you to all the contributors.

For the latest release, go to https://p5js.org/download/
