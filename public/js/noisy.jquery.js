
(function ($, document) {
    // http://forrst.com/posts/jQuery_background_noise_generator-muq
    $.fn.noisy = function(opacity) {
        if (typeof(opacity) === 'undefined') {
            opacity = 0.1;
        }

        return this.each(function () {
            var wrapper = $(this);
            var canvas = document.createElement("canvas");
            canvas.width = 100;
            canvas.height = 100;
            var ctx = canvas.getContext("2d");
            var x, y;
            var v = 75;

            for (x = 0; x < canvas.width; x += 1) {
                for (y = 0; y < canvas.height; y += 1) {
                    var r = Math.floor(Math.random() * v);
                    var g = Math.floor(Math.random() * v);
                    var b = Math.floor(Math.random() * v);
                    ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + opacity + ")";
                    ctx.fillRect(x, y, 1, 1);
                }
            }

            wrapper.css({
                'background-image': "url(" + canvas.toDataURL("image/png") + ")",
                width: '100%',
                height: '100%'
            });
        });
    };
})(jQuery, document);


$(function () {
    $('body').noisy(.1);
})
