#KiCad SVG viewer

This is a simple proof-of-concept browser based viewer for the SVG files KiCad exports. The viewer runs completely in client-side code, reads separate layer files (for now from the same directory) and attempts to present them in a fairly practical way.

The idea is to be able to use this for discussing a design as well as a quick reference for assembly of a board. It's current state the result of a few hours of tinkering on a rainy Sunday and as such not yet feature complete.

For a live demo, have a look here: https://prjct.net/kicad_viewer/

##Usage
1. Copy the repository files in a directory on your favourite web server. The project comes with some example files. To view your own, just modify the `projectName` in `kicad_viewer.js`.
2. Point your browser to your upload location.

##License
Copyright 2015, [Stefan Hamminga](https://prjct.net).
Project home: https://github.com/StefanHamminga/KiCad_SVG_viewer.

This project may be freely adapted and distributed, under the terms of the Creative Commons Attribution-ShareAlike 4.0 International license.

Also included is the MIT licensed [Simple-hint](https://github.com/catc/simple-hint) CSS tooltip file, by [Catalin Covic](https://github.com/catc).
