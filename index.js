var dust = require('dust')();
var serand = require('serand');
var utils = require('utils');
var Vehicle = require('vehicles-service');

require('gallery');

var user;

dust.loadSource(dust.compile(require('./template'), 'vehicles-findone'));

module.exports = function (sandbox, fn, options) {
    Vehicle.findOne({id: options.id, images: '800x450'}, function (err, vehicle) {
        if (err) {
            return fn(true, serand.none);
        }
        dust.render('vehicles-findone', vehicle, function (err, out) {
            sandbox.append(out);
            if (!fn) {
                return fn(true, serand.none);
            }
            fn(false, {
                clean: function () {
                    $('.vehicles-findone', sandbox).remove();
                },
                done: function () {
                    var i;
                    var o = [];
                    var photos = vehicle.photos;
                    var length = photos.length;
                    var photo;
                    for (i = 0; i < length; i++) {
                        photo = photos[i];
                        o.push({
                            href: photo.url,
                            thumbnail: 'https://farm6.static.flickr.com/5587/30453547284_436620c829_b.jpg'
                        });
                    }
                    blueimp.Gallery(o, {
                        container: $('.blueimp-gallery-carousel', sandbox),
                        carousel: true,
                        thumbnailIndicators: true,
                        stretchImages: true
                    });
                }
            });
        });
    });
};

serand.on('user', 'ready', function (usr) {
    user = usr;
});

serand.on('user', 'logged in', function (usr) {
    user = usr;
});

serand.on('user', 'logged out', function (usr) {
    user = null;
});
