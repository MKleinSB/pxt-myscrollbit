// tests go here; this will not be compiled when this package is used as a library

/*
basic.forever(() => {
    myscrollbit.scrollText("{Heart}")
    myscrollbit.scrollText("{SmallHeart}")
    myscrollbit.scrollText("{Yes}")
    myscrollbit.scrollText("{No}")
    myscrollbit.scrollText("{Happy}")
    myscrollbit.scrollText("{Sad}")
    myscrollbit.scrollText("{Confused}")
    myscrollbit.scrollText("{Angry}")
    myscrollbit.scrollText("{Asleep}")
    myscrollbit.scrollText("{Surprised}")
    myscrollbit.scrollText("{Silly}")
    myscrollbit.scrollText("{Fabulous}")
    myscrollbit.scrollText("{Meh}")
    myscrollbit.scrollText("{TShirt}")
    myscrollbit.scrollText("{Rollerskate}")
    myscrollbit.scrollText("{Duck}")
    myscrollbit.scrollText("{House}")
    myscrollbit.scrollText("{Tortoise}")
    myscrollbit.scrollText("{Butterfly}")
    myscrollbit.scrollText("{StickFigure}")
    myscrollbit.scrollText("{Ghost}")
    myscrollbit.scrollText("{Sword}")
    myscrollbit.scrollText("{Giraffe}")
    myscrollbit.scrollText("{Skull}")
    myscrollbit.scrollText("{Umbrella}")
    myscrollbit.scrollText("{Snake}")
    myscrollbit.scrollText("{Rabbit}")
    myscrollbit.scrollText("{Cow}")
    myscrollbit.scrollText("{QuarterNote}")
    myscrollbit.scrollText("{EightNote}")
    myscrollbit.scrollText("{Pitchfork}")
    myscrollbit.scrollText("{Target}")
    myscrollbit.scrollText("{Triangle}")
    myscrollbit.scrollText("{LeftTriangle}")
    myscrollbit.scrollText("{Chessboard}")
    myscrollbit.scrollText("{Diamond}")
    myscrollbit.scrollText("{SmallDiamond}")
    myscrollbit.scrollText("{Square}")
    myscrollbit.scrollText("{SmallSquare}")
    myscrollbit.scrollText("{Scissors}")
    myscrollbit.scrollText("{North}")
    myscrollbit.scrollText("{NorthEast}")
    myscrollbit.scrollText("{East}")
    myscrollbit.scrollText("{SouthEast}")
    myscrollbit.scrollText("{South}")
    myscrollbit.scrollText("{SouthWest}")
    myscrollbit.scrollText("{West}")
    myscrollbit.scrollText("{NorthW}")
})
*/

/*

basic.showIcon(IconNames.Heart)

let brightness: number = 128

for (let col: number = 0; col < myscrollbit.cols(); col++){
    for (let row: number = 0; row < myscrollbit.rows(); row++){
        let offset: number = (row * myscrollbit.cols()) + col
        let br: number = (brightness + 25) - ((offset * brightness) / 119)
        br = Math.max(0, br)
        if (offset > 117) br = 0
        myscrollbit.setPixel(col, row, br)
    }
}

myscrollbit.show()
*/

/*
// Test Jig Code

basic.forever(function(){

    for (let col: number = 0; col < myscrollbit.cols(); col++){
        for (let row: number = 0; row < myscrollbit.rows(); row++){
            let offset: number = (col * myscrollbit.cols()) + row
            myscrollbit.setPixel(col, row, 64 * (offset % 2))
        }
    }
    myscrollbit.show()
    control.waitMicros(1000000)
    for (let col: number = 0; col < myscrollbit.cols(); col++){
        for (let row: number = 0; row < myscrollbit.rows(); row++){
            let offset: number = (col * myscrollbit.cols()) + row
            myscrollbit.setPixel(col, row, 64 * ((offset + 1) % 2))
        }
    }
    myscrollbit.show()
    control.waitMicros(1000000)
    for (let col: number = 0; col < myscrollbit.cols(); col++){
        for (let row: number = 0; row < myscrollbit.rows(); row++){
            let offset: number = (col * myscrollbit.cols()) + row
            myscrollbit.setPixel(col, row, 64)
        }
    }
    myscrollbit.show()
    control.waitMicros(1000000)
    myscrollbit.clear()    
    myscrollbit.show()
    control.waitMicros(1000000)

})
*/

/*

myscrollbit.scrollText("Yarrrrrrrrrrrrrrrrrr")
myscrollbit.scrollText("The quick, brown fox jumped over the lazy dog! How slow does this get when displaying a really long sentence? I wonder. Let's see how far we can push this thing.", 128, 0)
myscrollbit.scrollText("Hello World! How are you today?", 128)
myscrollbit.scrollText("Super duper scrollalicious!", 128)
myscrollbit.setPixel(0,0,128)
myscrollbit.show()
*/