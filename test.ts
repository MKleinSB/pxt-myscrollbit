// tests go here; this will not be compiled when this package is used as a library

/*
basic.forever(() => {
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
