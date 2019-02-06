var dust = require('dust')();
var serand = require('serand');
var utils = require('utils');
var Vehicle = require('vehicles-service');

require('gallery');

var user;

dust.loadSource(dust.compile(require('./template'), 'vehicles-findone'));

module.exports = function (ctx, container, options, done) {
    var sandbox = container.sandbox;
    Vehicle.findOne({id: options.id, resolution: '800x450'}, function (err, vehicle) {
        if (err) {
            return done(err);
        }
        dust.render('vehicles-findone', vehicle, function (err, out) {
            if (err) {
                return done(err);
            }
            sandbox.append(out);
            done(null, {
                clean: function () {
                    $('.vehicles-findone', sandbox).remove();
                },
                ready: function () {
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
