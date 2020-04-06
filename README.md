# myscroll:bit

 

### Light a single pixel

Light a single pixel on scroll:bit. Note, you must call `show` to display your changes.

* `col` is the column, from 0-16
* `row` is the row, from 0-6
* `brightness` is the brightness, from 0-255

```
myscrollbit.setPixel(col: number, row:number, brightness: number)
```

For example:

```
myscrollbit.setPixel(5, 5, 255)
```

### Display your changes

When you've finished setting pixels and drawing text, you must call `show` to display your changes.

```
myscrollbit.show()
```

### Clear the display

To clear the display, you can call `clear`, you must also call `show` if you want to display your changes.

```
myscrollbit.clear()
myscrollbit.show()
```

### Display a text string

To show a string of text on scroll:bit you should use `drawText`:

* `col` is the column, from 0-16
* `row` is the row, from 0-6
* `text` is the text you want to show
* `brightness` is the brightness, from 0-255

```
myscrollbit.drawText(col: number, row:number, text: string, brightness: number)
```

For example:

```
myscrollbit.drawText(0, 1, "Hello World", 128)
```

### Scroll a text string across the display

Since a long string of text wont fit on scroll:bit, you have to scroll it across the display.

You can do this manually with `drawText` and `measureText` but we've included a convinient function for you:

* `text` is the text you want to show
* `brightness` is the brightness, from 0-255
* `delay` (optional) is the time, in milliseconds, to delay each scroll step - a bigger number equals slower scrolling

```
myscrollbit.scrollText(text: string, brightness: number, delay: number=50)
```

For example:

```
myscrollbit.scrollText("The quick brown fox jumped over the lazy dog!", 128)
```

Scrolling text is always vertically centered, starts off the right edge of the display, and scrolls across until it's gone.

### Draw a single character

If you just want to draw a single lett, you can use `drawChar`:

* `col` is the column, from 0-16
* `row` is the row, from 0-6
* `char` is the text you want to show
* `brightness` is the brightness, from 0-255

```
myscrollbit.drawChar(col: number, row: number, char: string, brightness: number)
```

For example:

```
myscrollbit.drawChar(1, 1, 'H', 128)
myscrollbit.drawChar(7, 1, 'a', 128)
myscrollbit.drawChar(12,1, 'i', 128)
```

### Measure a text string

It can be useful to know how long a string of text might be, in pixels, on scroll:bit. Use `measureText` to find out:

```
mycrollbit.measureText(text: string)
```

For example:

```
let width: number = myscrollbit.measureText("Hello World")
```

This will return a number of pixels corresponding to the length of the text as it's displayed on scroll:bit (using the built-in 5x5 micro:bit font).

### Icons & Arrows

You can use icons and arrows in your text, just place their name in curly brackets like so: `"Hello {Heart} World"` or: `"Boo! Went the {Ghost}"` or: `"{Heart}{SmallHeart}{Heart} Happy Birthday! {Heart}{SmallHeart}{Heart}"`

Here's a list of icons you can use:

* Heart
* SmallHeart
* Yes
* No
* Happy
* Sad
* Confused
* Angry
* Asleep
* Surprised
* Silly
* Fabulous
* Meh
* TShirt
* Rollerskate
* Duck
* House
* Tortoise
* Butterfly
* StickFigure
* Ghost
* Sword
* Giraffe
* Skull
* Umbrella
* Snake
* Rabbit
* Cow
* QuarterNote
* EigthNote
* Pitchfork
* Target
* Triangle
* LeftTriangle
* Chessboard
* Diamond
* SmallDiamond
* Square
* SmallSquare
* Scissors
* North
* NorthEast
* East
* SouthEast
* South
* SouthWest
* West
* NorthWest

## License

MIT License

Copyright (c) 2018 Pimoroni Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Supported targets

* for PXT/microbit

```package
myscrollbit=github:MTKilpatrick/pxt-myscrollbit
```
