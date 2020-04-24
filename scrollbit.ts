enum ScrollDirections {
    //% block=Right
    Right = 0,
    //% block=Down
    Down = 1,
    //% block=Left
    Left = 2,
    //% block=Up
    Up = 3
}

//% weight=100
//% color=#0303F3
//% icon="\uf06e"
//% block="MyScroll:Bit"
//% blockGap=8
namespace myscrollbit {
    const SCREEN_WIDTH = 16
    const SCREEN_HEIGHT = 6
    const VIRTUAL_WIDTH = 17
    const VIRTUAL_HEIGHT = 7
    const I2C_ADDR: number = 0x74
    const REG_MODE: number = 0x00
    const REG_FRAME: number = 0x01
    const DISP_REG: number = 0x05
    const REG_AUDIOSYNC: number = 0x06
    const REG_SHUTDOWN: number = 0x0a
    const REG_BRIGHT: number = 0x24
    const REG_BLINK: number = 0x12
    const REG_ENABLE: number = 0x00
    const PIC_MODE: number = 0x00
    const CMD_REG: number = 0xfd
    const BANK_CONFIG: number = 0x0b
    const FRAME_OFF: number[] = [0, 144, 288]
    const COL_MAP = hex`100E0C0A080604020001030507090B0D0F11`
    const COL_ORDER = hex`0809070A060B050C040D030E020F01100011`
    const TWOS = hex`0102040810204080`
    export const REVERSE = hex`0040206010503070084828681858387804442464145434740c4c2c6c1c5c3c7c02422262125232720a4a2a6a1a5a3a7a06462666165636760e4e2e6e1e5e3e7e0141216111513171094929691959397905452565155535750d4d2d6d1d5d3d7d03432363135333730b4b2b6b1b5b3b7b07472767175737770f4f2f6f1f5f3f7f`

    const ARROWOFFSET: number = 40
    const ICONS: string[] = [
        "Heart", "SmallH", "Yes", "No", "Happy",
        "Sad", "Confus", "Angry", "Asleep", "Surpri",
        "Silly", "Fabulo", "Meh", "TShirt", "Roller",
        "Duck", "House", "Tortoi", "Butter", "StickF",
        "Ghost", "Sword", "Giraff", "Skull", "Umbrel",
        "Snake", "Rabbit", "Cow", "Quarte", "EigthN",
        "Pitchf", "Target", "Triang", "LeftTr", "Chessb",
        "Diamon", "SmallD", "Square", "SmallS", "Scisso",
        "North", "NorthE", "East", "SouthE", "South",
        "SouthW", "West", "NorthW"
    ]

    let isDraw: boolean = true
    let useBlink: boolean = false
    let frame: number = 0
    let currentWriteFrame = 0
    let currentDisplayFrame = 0


    let brightness: Buffer = pins.createBuffer(144)
    let pixelbuffer: Buffer = pins.createBuffer(18)
    let pixelblinkbuffer: Buffer = pins.createBuffer(18)
    let textbuffer: Buffer = pins.createBuffer(18)
    let textblinkbuffer: Buffer = pins.createBuffer(18)
    let p_buffer = pixelbuffer
    let b_buffer = pixelblinkbuffer

    // variables for window mode
    let windowbuffer: Buffer = null
    export let windowX = 0
    export let windowY = 0
    let windowWidth: number = 0
    let windowHeight: number = 0
    let windowMaxX: number = 0
    let windowMaxY: number = 0
    let useOverlay: boolean = false



    /**
     * Set a pixel at coords (x,y).
     * Pixels are stored in a buffer: display is only updated
     * if drawMode() is On. Otherwise a show() is required
     * @param x - column to set (0,16)
     * @param y - row to set (0,6)
     * @param state - on/off state
     */
    //% block="set pixel at |x %x |y %y| $state"
    //% state.shadow="toggleOnOff"
    //% state.defl=true
    //% inlineInputMode=inline
    //% blockGap=8
    export function setPixel(x: number, y: number, state: boolean): void {
        if (x > VIRTUAL_WIDTH) {
            return
        }
        if (x < 0) {
            return
        }
        if (state) {
            p_buffer[x] = p_buffer[x] | TWOS[y]
            if (isDraw) {
                writeColumnByte(x, p_buffer[x])
            }
        } else {
            let bitmask = ~TWOS[y]
            p_buffer[x] = p_buffer[x] & bitmask
            b_buffer[x] = b_buffer[x] & bitmask
            if (isDraw) {
                writeColumnByte(x, p_buffer[x])
                writeColumnByte(x, b_buffer[x], 18)
            }
        }
    }


    /**
      * Set the blink on/off for a pixel at coords (col,row).
      * Pixels are stored in a buffery: display is only updated
      * if drawMode() is On. Otherwise a show() is required.
      * Requires blink mode to be set - see setBlinkMode()
      * @param x - column to set (0,16)
      * @param y - row to set (0,6)
      */
    //% blockID=myscrollbit_blink_pixle
    //% block="blink pixel at |x %x |y %y |blink $blink"
    //% blink.shadow="toggleOnOff"
    //% blink.defl=false
    //% inlineInputMode=inline
    //% blockGap=8
    export function blinkPixel(x: number, y: number, blink: boolean): void {
        if (x > VIRTUAL_WIDTH) {
            return
        }
        if (x < 0) {
            return
        }
        if (blink) {
            b_buffer[x] = b_buffer[x] | TWOS[y]
        }
        else {
            b_buffer[x] = b_buffer[x] & ~TWOS[y]
        }
        if (isDraw) {
            writeColumnByte(x, b_buffer[x], 18)
        }
    }

    /**
     * Plot a line from (x0,y0) to (x1,y1)
     * @param x0 - column  (0,16)
     * @param y0 - row (0,6)
     * @param x1 - column  (0,16)
     * @param y1 - row (0,6)
     */
    //% blockID=myscrollbit_plot_line
    //% block="plot line from |x %x0 y %y0 |to x %x1 y %y1 | $state"
    //% state.shadow="toggleOnOff"
    //% state.defl=true
    //% inlineInputMode=inline
    //% blockGap=12
    export function plotLine(x0: number, y0: number, x1: number, y1: number, state: boolean): void {
        let dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0)
        let xa = x0, xb = x1, ya = y0, yb = y1
        if (dx > dy) {
            if (x0 > x1) {
                xa = x1; ya = y1; xb = x0; yb = y0
            }
            let yc = (yb > ya) ? 1 : -1
            let mid = (x0 + x1) >> 1
            let a = dy << 1, p = a - dx, b = p - dx
            setPixel(xa, ya, state)
            while (xa < xb) {
                if ((p < 0) || ((p == 0) && (xa >= mid))) {
                    p = p + a
                } else {
                    p = p + b; ya = ya + yc
                }
                xa += 1; setPixel(xa, ya, state)
            }
        } else {
            if (y0 > y1) {
                xa = x1; ya = y1; xb = x0; yb = y0
            }
            let xc = (xb > xa) ? 1 : -1
            let mid = (y0 + y1) >> 1
            let a = dx << 1, p = a - dy, b = p - dy
            setPixel(xa, ya, true)
            while (ya < yb) {
                if ((p < 0) || ((p == 0) && (ya >= mid))) {
                    p = p + a
                } else {
                    p = p + b; xa = xa + xc
                }
                ya += 1; setPixel(xa, ya, state)
            }
        }
    }

    /**
     * Returns boolean - is the pixel at (x,y) set?
     * @param x - column  (0,16)
     * @param y - row (0,6)
     */
    //% blockID=myscrollbit_is_pixel
    //% block="is pixel set at |x %x |y %y"
    //% inlineInputMode=inline
    //% blockGap=32
    export function isPixel(x: number, y: number): boolean {
        return ((p_buffer[x] & TWOS[y]) != 0)
    }

    /**
     * Clear pixel and blink buffers. Redraw if drawMode() is On
     */
    //% blockId=myscrollbit_clear
    //% block="clear scroll:bit"
    //% icon=""
    //% blockGap=8
    export function clear(): void {
        p_buffer.fill(0)
        b_buffer.fill(0)
        if (isDraw) {
            show()
        }
    }
    /**
     * Draw scroll:bit. Transfers the pixel buffer to the LED display
     * Transfers the blink buffer if useBlinks() is On.
     */
    //% blockId=myscrollbit_show
    //% block="show scroll:bit"
    //% icon=""
    //% blockGap=8
    export function show(): void {
        if (!useBlink) {
            let temp = pins.createBuffer(18)
            temp[0] = 0
            for (let x = 0; x <= SCREEN_WIDTH; x++) {
                let col = COL_ORDER[x]
                if (col > 8) {
                    temp[x + 1] = p_buffer[col]
                } else {
                    temp[x + 1] = REVERSE[p_buffer[col]]
                }
            }
            pins.i2cWriteBuffer(I2C_ADDR, temp, false);
        } else {
            let temp = pins.createBuffer(37)
            temp[0] = 0
            for (let x = 0; x < 18; x++) {
                let col = COL_ORDER[x]
                if (col > 8) {
                    temp[x + 1] = p_buffer[col]
                    temp[x + 19] = b_buffer[col]
                } else {
                    temp[x + 1] = REVERSE[p_buffer[col]]
                    temp[x + 19] = REVERSE[b_buffer[col]]
                }
            }
            pins.i2cWriteBuffer(I2C_ADDR, temp, false);
        }
    }

    function writeColumnByte(col: number, value: number, register: number = 0): void {
        let temp = pins.createBuffer(2);
        temp[0] = COL_MAP[col] + register;
        if (col > 8) {
            temp[1] = value;
        } else {
            temp[1] = REVERSE[value]
        }
        pins.i2cWriteBuffer(I2C_ADDR, temp, false);
    }

    /**
     * Scroll buffers right/down/left/up.
     * Display only updated if DrawMode() is On.
     * Left : column(16) assumes values of inivisible column(17).
     * Right: column(0) is blank
     * Up: row(0) is blank
     * Down: row(7) assumes values of invisibile row(8)
     * @param direction - right/down/left/up 0,1,2,3
     */
    //% blockId=myscrollbit_scroll
    //% block="scroll scroll:bit %direction"
    //% blockGap=32
    export function scrollDisplay(direction: ScrollDirections): void {
        if (direction & 1) {
            if (direction & 2) {
                for (let i = 0; i < 18; i++) { p_buffer[i] <<= 1 }
                if (useBlink) {
                    for (let i = 0; i < 18; i++) { b_buffer[i] <<= 1 }
                }
            } else {
                for (let i = 0; i < 18; i++) { p_buffer[i] >>= 1 }
                if (useBlink) {
                    for (let i = 0; i < 18; i++) { b_buffer[i] >>= 1 }
                }
            }
        } else {
            let dir = (direction & 2) - 1
            p_buffer.shift(dir)
            if (useBlink) {
                b_buffer.shift(dir)
            }
        }
        if (isDraw) {
            show()
        }
    }


    /**
     * Scroll text across scroll:bit. Preseves and restores existing display
     * by using a separate text frame buffer.
     * @param text - text to scroll
     * @param delay - additional delay in milliseconds (0-100)
     * @param y - vertical position from bottom [0-2]
     */
    //% blockId=myscrollbit_scroll_text 
    //% block="scroll %text delay (ms) %delay y %y"
    //% delay.min=0 delay.max=100 delay.defl=50
    //% y.min=0 y.max=2 y.defl=1
    export function scrollText(text: string, delay: number = 50, y: number = 1) {
        let savebuf = p_buffer
        p_buffer = textbuffer
        setWriteFrame(7)
        setDisplayFrame(7)
        let save_draw = isDraw
        setDrawMode(false)
        text = tokenize(text)
        let len: number = measureText(text)
        clear()
        for (let x: number = 0; x <= len + SCREEN_WIDTH; x++) {
            _drawText(text, SCREEN_WIDTH + 1 - x, y)
            show()
            if (delay > 0) {
                control.waitMicros(delay * 1000)
            }
        }
        p_buffer = savebuf
        setWriteFrame(0)
        setDisplayFrame(0)
        setDrawMode(save_draw)
    }

    export function _drawText(text: string, x: number, y: number = 1): void {
        let offset_x: number = 0
        for (let i: number = 0; i < text.length; i++) {
            let width: number = charWidth(text.charAt(i))
            if (x + offset_x > SCREEN_WIDTH) {
                return
            }
            if (x + offset_x + width < 0) {
                offset_x += width + 1
                continue
            }
            drawChar(text.charAt(i), x + offset_x, y)
            offset_x += width + 1
        }
    }

    /**
     * Draw a single alphanumeric character.
     * @param char - character to display
     * @param x - column position (0-16)
     * @param y - row position (0-6)
     */
    export function drawChar(char: string, x: number, y: number): void {
        if (char.charCodeAt(0) > DAL.MICROBIT_FONT_ASCII_END + ARROWOFFSET) {
            setImage(images.arrowImage(char.charCodeAt(0) - DAL.MICROBIT_FONT_ASCII_END - ARROWOFFSET - 1), x, y)
            return;
        }
        if (char.charCodeAt(0) > DAL.MICROBIT_FONT_ASCII_END) {
            setIcon(char.charCodeAt(0) - DAL.MICROBIT_FONT_ASCII_END - 1, x, y)
            return;
        }
        let data: Buffer = getChar(char)
        y = Math.constrain(y, 0, 2)
        for (let x_col = 4; x_col >= 0; x_col--) {
            let bits = 0x00
            bits |= data[0] & 1 ? 1 : 0; data[0] >>= 1; bits <<= 1
            bits |= data[1] & 1 ? 1 : 0; data[1] >>= 1; bits <<= 1
            bits |= data[2] & 1 ? 1 : 0; data[2] >>= 1; bits <<= 1
            bits |= data[3] & 1 ? 1 : 0; data[3] >>= 1; bits <<= 1
            bits |= data[4] & 1 ? 1 : 0; data[4] >>= 1
            bits <<= y
            let column = x + x_col
            if (column <= SCREEN_WIDTH) {
                p_buffer[column] = bits
                if (isDraw) {
                    writeColumnByte(column, bits)
                }
            }
        }
    }


    /**
     * Draw text on scroll:bit
     * @param text - text to show
     * @param x - column to set (0-16)
     * @param y - row to set (0-6)
     */
    //% blockId=myscrollbit_draw_text
    //% block="draw %text at|x %x |y %y"
    //% advanced color=#220000
    //% x.min=0 x.max=16
    //% y.min=0 y.max=2 y.defl=1
    export function drawText(text: string, x: number, y: number): void {
        text = tokenize(text)
        _drawText(text, x, y)
    }

    function tokenize(text: string): string {
        let result: string = ""
        let icon: string = ""
        for (let i = 0; i < text.length; i++) {
            let char: string = text.charAt(i)
            if (char == "}" && icon.length > 0) {
                let index: number = ICONS.indexOf(icon.substr(1, 6))
                icon += char
                if (index > -1) {
                    icon = String.fromCharCode(DAL.MICROBIT_FONT_ASCII_END + 1 + index)
                }
                result += icon
                icon = ""
                continue
            }
            if (char == "{" || icon.length > 0) {
                icon += char
                continue
            }
            result += char
        }
        return result
    }

    /**
     * Display an icon on scroll:bit
     * @param icon - icon to display
     * @param x - column to set (0-16)
     * @param y - row to set (0-6)
     */
    //% blockId=myscrollbit_set_icon
    //% block="display icon %icon at|x %x | y %y"
    //% icon.fieldEditor="gridpicker"
    //% icon.fieldOptions.width="400" icon.fieldOptions.columns="5"
    //% icon.fieldOptions.itemColour="black" icon.fieldOptions.tooltips="true"
    //% x.min=0 x.max=16
    //% y.min=0 y.max=6
    export function setIcon(icon: IconNames, x: number, y: number): void {
        let image: Image = images.iconImage(icon)
        setImage(image, x, y)
    }

    /**
     * Display an image on scroll:bit
     * @param image - image to display
     * @param x - column to set (0-16)
     * @param y - row to set (0-6)
     */
    //% blockId=myscrollbit_set_image
    //% block="display image %image at |x %x |y %y"
    //% x.min=0 x.max=16
    //% y.min=0 y.max=6
    export function setImage(image: Image, x: number, y: number): void {
        for (let y_row = 0; y_row < 5; y_row++) {
            for (let x_col = 0; x_col < image.width(); x_col++) {
                if (image.pixelBrightness(x_col, y_row)) {
                    setPixel(x + x_col, y + y_row, true)
                }
            }
        }
    }

    /**
     * mask a byte (one column of pixels) with AND/OR
     * to set and/or clear any combination of pixels
     * @param x - column (0,16)
     * @param maskand - 7-bit mask for logical AND
     * @param maskor - 7-bit mask for logical OR
     */
    //% blockID=myscrollbit_maskcolumn
    //% block="mask column |%x : |AND %maskand |OR %maskor"
    //% advanced=true
    export function maskColumn(x: number, maskand: number, maskor: number): void {
        p_buffer[x] = (p_buffer[x] & maskand) | maskor
        if (isDraw) {
            writeColumnByte(x, p_buffer[x])
        }
    }
    function getChar(character: string): Buffer {
        return getFontData(character.charCodeAt(0))
    }

    function charWidth(character: string): number {
        let charcode: number = character.charCodeAt(0)
        if (charcode > DAL.MICROBIT_FONT_ASCII_END) {
            return 5
        }
        return getCharWidth(charcode)
    }


    /**
     * Return the maximum x coordinate
     */
    //% blockId=myscrollbit_max_x
    //% block="max X of scrollbity"
    export function maxX(): number {
        return SCREEN_WIDTH
    }
    /**
      * Return the maximum y coordinate
      */
    //% blockId=myscrollbit_max_y
    //% block="max Y of scrollbity"
    export function maxY(): number {
        return SCREEN_HEIGHT
    }


    /**
    * Set blink mode. When off, graphics are faster. When on, pixels may be blinbked individually.
    * See blinkPixel() & setAllBlinks().
    * Note: pixel blink buffer is not cleared
    * @param mode - On/Off
    * @param freq - blink frequency [0-7]
    */
    //% block="set blink mode $mode| freq %freqe"
    //% mode.shadow="toggleOnOff"
    //% advanced=true
    export function setBlinkMode(mode: boolean, freq: number = 0): void {
        setCmdRegMode()
        writeByte(DISP_REG, (mode ? 8 : 0) + freq)
        useBlink = mode
        setWriteFrame(currentWriteFrame)
    }

    /**
     * Set all pixel blinks on/off.
     * Sets all blink buffer bits to '1' and updates display.
     * @param blink - On/Off
     */
    //% block="set all blinks $blink"
    //% blink.shadow="toggleOnOff"
    //% advanced=true
    export function setAllBlinks(blink: boolean): void {
        b_buffer.fill(blink ? 0x7F : 0x00)
        let temp = pins.createBuffer(b_buffer.length + 1);
        temp[0] = REG_BLINK;
        for (let i = 0; i < b_buffer.length; i++) {
            temp[i + 1] = b_buffer[i];
        }
        pins.i2cWriteBuffer(I2C_ADDR, temp, false)
    }


    /**
     * Set brightness of the scroll:bit display
     * @param level - brightness to set (0-255)
     */
    //% blockId=myscrollbit_set_all_bright
    //% block="set all brightness to %level"
    //% level.min=0 brightness.max=255 brightness.defl=128
    //% advanced=true
    export function setAllBrightness(level: number = 128): void {
        brightness.fill(Math.clamp(0, 255, level))
        let temp = pins.createBuffer(brightness.length + 1);
        temp[0] = REG_BRIGHT;
        for (let i = 0; i < brightness.length; i++) {
            temp[i + 1] = brightness[i];
        }
        pins.i2cWriteBuffer(I2C_ADDR, temp, false)
    }

    /**
     * Set draw mode: On - update display at every action. Off - display not updated.
     * @param mode - On/Off
     */
    //% block="set draw mode $mode"
    //% mode.shadow="toggleOnOff"
    //% mode.defl=true
    //% advanced=true
    export function setDrawMode(mode: boolean): void {
        isDraw = mode
    }

    /**
     * Set the frame to be displayed on the scroll:bit.
     * Scroll:bit returned to frame write mode aftewards.
     * @param frame - frame number [0-7]
    */
    //% blockId=myscrollbit_display_frame
    //% block="display frame |%frame"
    //% frame.defl=0
    //% advanced=true
    export function setDisplayFrame(frame: number): void {
        currentDisplayFrame = frame
        setCmdRegMode()
        writeByte(REG_FRAME, frame)
        setWriteFrame(currentWriteFrame)
    }

    /**
     * Set the frame to be written to on the scroll:bit
     * @param frame - frame number [0-7]
     */
    //% blockId=myscrollbit_write_frame
    //% block="write to frame |%frame"
    //% frame.defl=0
    //% advanced=true
    export function setWriteFrame(frame: number): void {
        currentWriteFrame = frame
        writeByte(CMD_REG, frame)
    }

    //% block="set window mode %x cols and %y rows | overlay $overlay"
    //% overlay.shadow="toggleOnOff"
    //% overlay.defl=false x.min=0 y.min=0
    //% advanced=true
    export function setWindowMode(x: number, y: number, overlay: boolean = false): void {
        windowMaxX = x - 16
        windowMaxY = y - 7
        let byte_y = (y + 7) >> 3
        windowbuffer = pins.createBuffer(x * byte_y)
        windowWidth = x
        windowHeight = y
        windowX = 0
        windowY = 0
        useOverlay = overlay
    }

    //% blockId=myscrollbit_window_position
    //% block="set window positon x %x y %y"
    //% advanced=true
    export function positionWindow(x: number, y: number) {
        windowX = Math.constrain(x, 0, SCREEN_WIDTH)
        windowY = Math.constrain(y, 0, SCREEN_HEIGHT)

    }

    //% blockId=myscrollbit_draw_window
    //% block="draw window"
    //% advanced=true
    export function drawWindow() {
        let temp = pins.createBuffer(18)
        temp[0] = 0
        let y_l = windowY & 7
        let y_m = windowY >> 3
        let offset = SCREEN_WIDTH * y_m + windowX
        if (useOverlay) {
            for (let i = 0; i < 17; i++) {
                let x = COL_ORDER[i]
                let a = windowbuffer[x + offset] >> y_l
                let b = windowbuffer[x + offset + SCREEN_WIDTH] << (8 - y_l)
                let byte = (p_buffer[x] | a | b) & 0x7f
                if (x > 8) {
                    temp[i + 1] = byte
                } else {
                    temp[i + 1] = REVERSE[byte]
                }
            }
        } else {
            for (let i = 0; i < 17; i++) {
                let x = COL_ORDER[i]
                let a = windowbuffer[x + offset] >> y_l
                let b = windowbuffer[x + offset + SCREEN_WIDTH] << (8 - y_l)
                if (x > 8) {
                    temp[i + 1] = (a | b) & 0x7F
                } else {
                    temp[i + 1] = REVERSE[(a | b) & 0x7F]
                }
            }
        }
        pins.i2cWriteBuffer(I2C_ADDR, temp, false);
    }

    /**
     * TODO: describe your function here
     */
    //% block="make image"
    //% blockId=myscrollbit_make_image
    //% imageLiteral=1
    //% imageLiteralColumns=17
    //% imageLiteralRows=7
    //% shim=images::createImage
    export function makeImage(i: string): Image {
        // this is not pretty but basically, i is an Image
        const im = <Image><any>i;
        return im
    }

    //% blockID=myscrollbit_display_image
    //% block="display image %im"
    //% advanced=true
    export function displayImage(im: Image): void {
        for (let x = 0; x < im.width(); x++) {
            let bits: number = 0
            for (let y = im.height(); y >= 0; y--) {
                bits <<= 1
                bits |= im.pixel(x, y) ? 1 : 0
            }
            p_buffer[x] = bits
        }
        show()
    }


    /**
     * Measure text, returns a length in pixels
     * @param text - text string to measure
     */
    //% blockId=myscrollbit_measure_text
    //% block="get length of %text in pixels"
    //% advanced=true color=#554444
    export function measureText(text: string): number {
        let len: number = 0
        for (let i: number = 0; i < text.length; i++) {
            len += charWidth(text.charAt(i)) + 1
        }
        return len
    }

    /* switch to Function Register mode */
    function setCmdRegMode(): void {
        writeByte(CMD_REG, BANK_CONFIG)
    }

    /* switch to Picture Display Mode */
    function setDisplayMode(mode: number): void {
        setCmdRegMode()
        writeByte(REG_MODE, mode)
    }

    /* set audiosync mode */
    function setAudioSyncMode(mode: number): void {
        setCmdRegMode()
        writeByte(REG_MODE, mode)
    }

    /**
     * Setup myscroll:bit. Is called automatically.
     * Default is no blink mode, brightness=128, write/diplay frame 0
     */
    export function setup(): void {
        setCmdRegMode() /* switch to f-reg mode and reset*/
        control.waitMicros(1000)
        writeByte(REG_SHUTDOWN, 0)
        control.waitMicros(1000)
        writeByte(REG_SHUTDOWN, 1)
        control.waitMicros(1000)
        setDisplayMode(PIC_MODE) /* set to pic mode */
        setAudioSyncMode(0);
        setBlinkMode(true, 1)
        for (let frame = 7; frame >= 0; frame--) {
            setDisplayFrame(frame);
            setWriteFrame(frame)
            /* no longer in CMD Reg Mode */
            setDrawMode(true)
            setAllBlinks(true)
            setAllBrightness(200) /* fill brightness to 255 */
            clear()
        }
    }

    function writeByte(register: number, value: number): void {
        let temp = pins.createBuffer(2);
        temp[0] = register;
        temp[1] = value;
        pins.i2cWriteBuffer(I2C_ADDR, temp, false);
    }

    //% shim=myscrollbit::getFontDataByte
    function getFontDataByte(index: number): number {
        return 0
    }

    //% shim=myscrollbit::getFontData
    function getFontData(index: number): Buffer {
        return pins.createBuffer(5)
    }

    //% shim=myscrollbit::getCharWidth
    function getCharWidth(char: number): number {
        return 5
    }



}
myscrollbit.setup();
