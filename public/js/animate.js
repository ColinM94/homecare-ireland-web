class Animate{
    // SRC: https://stackoverflow.com/questions/15191058/css-rotation-cross-browser-with-jquery-animate
    static rotate(angle, id) {
        var element = $(id)

        // we use a pseudo object for the animation
        // (starts from `0` to `angle`), you can name it as you want
        $({deg: 0}).animate({deg: angle}, {
            duration: 1000,
            step: function(now) {
                // in the step-callback (that is fired each step of the animation),
                // you can use the `now` paramter which contains the current
                // animation-position (`0` up to `angle`)
                element.css({
                    transform: 'rotate(' + now + 'deg)'
                })
            }
        })
    }
}
