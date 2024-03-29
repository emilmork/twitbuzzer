
var graph = (function (Raphael, $) {
    "use strict";

    Raphael.fn.drawGrid = function (x, y, w, h, wv, hv, color) {
        color = color || "#ddd";
        var path = ["M", Math.round(x), Math.round(y), "L", Math.round(x + w), Math.round(y), Math.round(x + w), Math.round(y + h), Math.round(x), Math.round(y + h) , Math.round(x), Math.round(y)],
            rowHeight = h / hv,
            columnWidth = w / wv;
        for (var i = 1; i < hv; i++) {
            path = path.concat(["M", Math.round(x), Math.round(y + i * rowHeight), "H", Math.round(x + w)]);
        }
        for (i = 1; i < wv; i++) {
            path = path.concat(["M", Math.round(x + i * columnWidth), Math.round(y), "V", Math.round(y + h)]);
        }
        return this.path(path.join(",")).attr({stroke: color});
    };

    function getAnchors(p1x, p1y, p2x, p2y, p3x, p3y) {
        var l1 = (p2x - p1x) / 2,
            l2 = (p3x - p2x) / 2,
            a = Math.atan((p2x - p1x) / Math.abs(p2y - p1y)),
            b = Math.atan((p3x - p2x) / Math.abs(p2y - p3y));
        a = p1y < p2y ? Math.PI - a : a;
        b = p3y < p2y ? Math.PI - b : b;
        var alpha = Math.PI / 2 - ((a + b) % (Math.PI * 2)) / 2,
            dx1 = l1 * Math.sin(alpha + a),
            dy1 = l1 * Math.cos(alpha + a),
            dx2 = l2 * Math.sin(alpha + b),
            dy2 = l2 * Math.cos(alpha + b);
        return {
            x1: p2x - dx1,
            y1: p2y + dy1,
            x2: p2x + dx2,
            y2: p2y + dy2
        };
    }


    // Taken from the analytics example by Raphael.js: http://raphaeljs.com/analytics.html
    var graph = function (elm, labels, data, width, height) {

        // Draw
        var leftgutter = 0,
            bottomgutter = 25,
            topgutter = 25,
            colorhue = 0.6 || Math.random(),
            color = "hsl(" + [colorhue, 0.5, 0.5] + ")",
            r = Raphael(elm, width, height),
            txt = {font: '12px Helvetica, Arial', fill: "#fff"},
            txt1 = {font: '10px Helvetica, Arial', fill: "#fff"},
            txt2 = {font: '12px Helvetica, Arial', fill: "#000"},
            X = (width - leftgutter) / labels.length,
            max = Math.max(Math.max.apply(Math, data), 1),
            Y = (height - bottomgutter - topgutter) / max;

        r.drawGrid(leftgutter + X * 0.5 + 0.5, topgutter + 0.5, width - leftgutter - X, height - topgutter - bottomgutter, 14, 5, "#ccc");

        var path = r.path().attr({stroke: color, "stroke-width": 4, "stroke-linejoin": "round"}),
            bgp = r.path().attr({stroke: "none", opacity: 0.3, fill: color}),
            label = r.set(),
            lx = 0, ly = 0,
            is_label_visible = false,
            leave_timer,
            blanket = r.set();
        label.push(r.text(60, 12, "24 hits").attr(txt));
        label.push(r.text(60, 27, "22 September 2008").attr(txt1).attr(txt1));
        label.hide();

        var frame = r.popup(100, 100, label, "right").attr({fill: "#000", stroke: "#666", "stroke-width": 2, "fill-opacity": 0.7}).hide();

        var p, bgpp;
        for (var i = 0, ii = labels.length; i < ii; i++) {
            var y = Math.round(height - bottomgutter - Y * data[i]),
                x = Math.round(leftgutter + X * (i + 0.5));
                //t = r.text(x, height - 6, labels[i]).attr(txt).toBack();
            if (!i) {
                p = ["M", x, y, "C", x, y];
                bgpp = ["M", leftgutter + X * 0.5, height - bottomgutter, "L", x, y, "C", x, y];
            }
            if (i && i < ii - 1) {
                var Y0 = Math.round(height - bottomgutter - Y * data[i - 1]),
                    X0 = Math.round(leftgutter + X * (i - 0.5)),
                    Y2 = Math.round(height - bottomgutter - Y * data[i + 1]),
                    X2 = Math.round(leftgutter + X * (i + 1.5));
                var a = getAnchors(X0, Y0, x, y, X2, Y2);
                p = p.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
                bgpp = bgpp.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
            }

            var dot = r.circle(x, y, 4).attr({fill: "#333", stroke: color, "stroke-width": 2});

            blanket.push(r.rect(leftgutter + X * i, 0, X, height - bottomgutter).attr({stroke: "none", fill: "#fff", opacity: 0}));

            var rect = blanket[blanket.length - 1];

            (function (x, y, data, lbl, dot) {
                var timer, i = 0;
                rect.hover(function () {
                    clearTimeout(leave_timer);
                    var side = "right";
                    if (x + frame.getBBox().width > width) {
                        side = "left";
                    }
                    var ppp = r.popup(x, y, label, side, 1),
                        anim = Raphael.animation({
                            path: ppp.path,
                            transform: ["t", ppp.dx, ppp.dy]
                        }, 200 * is_label_visible);
                    lx = label[0].transform()[0][1] + ppp.dx;
                    ly = label[0].transform()[0][2] + ppp.dy;
                    frame.show().stop().animate(anim);
                    label[0].attr({text: data + " tweet" + (data == 1 ? "" : "s")}).show().stop().animateWith(frame, anim, {transform: ["t", lx, ly]}, 200 * is_label_visible);
                    label[1].attr({text: lbl}).show().stop().animateWith(frame, anim, {transform: ["t", lx, ly]}, 200 * is_label_visible);
                    dot.attr("r", 6);
                    is_label_visible = true;
                }, function () {
                    dot.attr("r", 4);
                    leave_timer = setTimeout(function () {
                        frame.hide();
                        label[0].hide();
                        label[1].hide();
                        is_label_visible = false;
                    }, 1);
                });
            })(x, y, data[i], labels[i], dot);

        }
        p = p.concat([x, y, x, y]);
        bgpp = bgpp.concat([x, y, x, y, "L", x, height - bottomgutter, "z"]);
        path.attr({path: p});
        bgp.attr({path: bgpp});
        frame.toFront();
        label[0].toFront();
        label[1].toFront();
        blanket.toFront();
    };

    return graph;
})(window.Raphael, jQuery);

