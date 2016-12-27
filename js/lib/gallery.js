function operaEvento(evento){
    if($('.zoom_overlay').hasClass('open')) {
        switch(evento.which) {
            case 39:
                $('.zoom_next').trigger('click');
                break;
            case 37:
                $('.zoom_prev').trigger('click');
                break;
            case 27:
                $('.zoom_close').trigger('click');
                break;
            default:
                break;
        }
    }
}

var imgs;
var index = 0;

var swipeOptions = {
    triggerOnTouchEnd: true,
    swipeStatus: swipeStatus,
};

function swipeStatus(event, phase, direction, distance) {
   if (phase == "end") {
        if (direction == "right") {
            $('.zoom_prev').trigger('click');
        } else if (direction == "left") {
            $('.zoom_next').trigger('click');
        }
    }
}

function hex2rgb(hexStr){
    var hex = parseInt(hexStr.substring(1), 16);
    var r = (hex & 0xff0000) >> 16;
    var g = (hex & 0x00ff00) >> 8;
    var b = hex & 0x0000ff;
    return [r, g, b];
}

(function($){
    var total;
    $(document).keydown(operaEvento);

    var methods = {
        init: function(options) {

            var settings = $.extend({
               //por defecto se usa el selector que llama al constructor
                'id': this.selector,
                'idclick': this.selector,

                //clases de los botones
                'buttonClose': '<a class="zoom_close"></a>',
                'buttonNext': '<a class="zoom_next"><span></span></a>',
                'buttonPrev': '<a class="zoom_prev"><span></span></a>',

                // expand: valores aceptados true o false; Usado para que el fondo ocupe toda la pantalla (true) o no (false);
                'expand': false,
                'allowscroll': false,

                //tipo de salida, valores permitidos: button, click, both
                //button: sale pulsando el boton cerrar
                //click: sale pulsando fuera del contenedor del fancy
                //both: los dos anteriores juntos
                'exit': 'button',

                //muestra los botones de cerrar y navegacion
                'showClose': true,
                'showNav': true,

                //Mostrar las miniaturas
                'showThumbs': false,
                'thumbsPosition': 'bottom',

                //Tamaño de las imagenes por defecto el tamaño de la imagen
                'imgWidth': 'ajust',
                'imgHeight': 'ajust',

                //borde del contenedor de la imagen valor en pixeles, NO en %
                'borderContentHeight': '100',
                'borderContentWidth': '100',

                //Los colores tienen que estar en formato de 6 caracteres #ffffff;

                //Los 2 siguientes campos solo se aplican si expand == false
                'bgColor': '#ffffff',
                'bgOpacity': '0.7',

                'colorContent': '#ffffff',
                'opacityContent': '1',
                'hasBorderContent': true,
                'borderContent': '1px solid #656565',
            }, options);

            return $(settings.idclick).each(function() {
                $(this).bind('click', function() {
                    $(this).gallery('openGallery', settings);
                });
            });
        },
        destroyGallery: function() {
            $('.zoom_overlay').remove();
            return this.each(function() {
                $(this).unbind('click');
            });
        },
        openGallery: function(settings) {
            total = $(settings.id).length;

            var output = '<div class="zoom_overlay">' + 
                    '<div class="zoom_content">';

            if(settings.showClose)
                output += '<a class="zoom_close"></a>';

            if(settings.showNav) {
                output += '<a class="zoom_prev"><span></span></a>' +
                            '<a class="zoom_next"><span></span></a>';
            }

            output += '<div class="zoom_view">';

            var addsizes = '';
            if(settings.imgWidth != 'ajust')
                addsizes += 'width: ' + settings.imgWidth + '; ';

            if(settings.imgHeight != 'ajust')
                addsizes += 'height: ' + settings.imgHeight + ';';

            output +=  '<img src="" style="' + addsizes +'">';

            output += '</div>';

            if(settings.showThumbs) {
                output += '<div class="zoom_thumbs">';

                $(settings.id).each(function(i) {
                    if(settings.thumbsPosition == 'left' || settings.thumbsPosition == 'right')
                        output += '<img style="display: block; cursor: pointer; margin-top: 10px;" data-index="' + $(this).data('index') + '" src="'+ $(this).children('.background-img').css('background-image').replace(/^url\(['"]?/,'').replace(/['"]?\)$/,'') +'" />';
                    else
                        output += '<img style="cursor: pointer;" data-index="' + $(this).data('index') + '" src="'+ $(this).children('.background-img').css('background-image').replace(/^url\(['"]?/,'').replace(/['"]?\)$/,'') +'" />';
                });

                output += '</div>';
            }
                
            output += '</div>'+
             '</div>';

            $('body').append(output);

            imgs = $(".zoom_view");
            imgs.swipe(swipeOptions);

            if((settings.showClose && (settings.exit == 'button' || settings.exit == 'both')) || settings.expand) {
                $('.zoom_close').bind('click', function() {
                    $(this).gallery('closeGallery');
                });
            }

            if((settings.exit == 'click' || settings.exit == 'both') && !settings.expand) {
                $('.zoom_overlay').bind('click', function() {
                    $(this).gallery('closeGallery');
                });

                $('.zoom_content').bind('click', function(event) {
                    event.stopPropagation();
                });
            }

            if(settings.showThumbs) {
                $('.zoom_thumbs img').bind('click', function() {
                    $(this).gallery('goTo', settings, $(this).data('index'));
                }); 
            }

            if(settings.showNav) {
                $('.zoom_prev').bind('click', function() {
                    $(this).gallery('prevGallery', settings);
                });

                $('.zoom_next').bind('click', function() {
                    $(this).gallery('nextGallery', settings);
                });
            }

            index = $(this).data('index');

            //$("header, footer, .content_page").addClass("displaynone");
            //$('body').css('overflow', 'hidden');
            $(".zoom_view img").attr('src', $(this).children('.background-img').css('background-image').replace(/^url\(['"]?/,'').replace(/['"]?\)$/,''));

            //$(".zoom_overlay").fadeIn('fast');
            $(".zoom_overlay").fadeIn();

            var color = hex2rgb(settings.bgColor);
            $('.zoom_overlay').css('background-color', 'rgba('+ color[0] +', '+ color[1] +', '+ color[2] +', '+ settings.bgOpacity +')');

            color = hex2rgb(settings.colorContent);
            $('.zoom_content').css('background-color', 'rgba('+ color[0] +', '+ color[1] +', '+ color[2] +', '+ settings.opacityContent +')');

            if(settings.hasBorderContent && !settings.expand)
                $('.zoom_content').css('border', settings.borderContent);

            var imgw = $(".zoom_view img").outerWidth();
            var imgh = $(".zoom_view img").outerHeight();

            var winwidth = $(window).outerWidth();
            var winheight = $(window).outerHeight();

            var proporcion = imgw/imgh;
            var extra = 0;

            if(settings.showThumbs && (settings.thumbsPosition == 'bottom' || settings.thumbsPosition == 'top')) {
                extra = $('.zoom_thumbs').outerHeight() + 10;
            }

            if(settings.imgWidth == 'ajust') {
                if(imgw >= (winwidth - (winwidth * 0.1))) {
                    imgw = (winwidth - (winwidth * 0.1)) * 0.9;

                    $(".zoom_view img").css('width', imgw);
                    imgh = (imgw / proporcion);
                    $(".zoom_view img").css('height', imgh);
                }
            }

            if(settings.imgHeight == 'ajust') {
                if(imgh >= (winheight - (winheight * 0.1 + extra))) {
                    imgh = (winheight - (winheight * 0.1 + extra)) * 0.9;

                    $(".zoom_view img").css('height', imgh);
                    imgw = (imgh * proporcion);
                    $(".zoom_view img").css('width', imgw);
                }
            }

            if(settings.showThumbs && settings.thumbsPosition == 'top')
                extra = extra * -1;

            $(".zoom_view img").css({'margin-left': (imgw / 2) * -1, 'margin-top': ((imgh + extra) / 2) * -1});

            if(settings.showThumbs) {
                if(settings.thumbsPosition == 'bottom') {
                    $('.zoom_thumbs').css('bottom', 10);
                    $('.zoom_thumbs').css('left', '50%');
                    $('.zoom_thumbs').css('margin-left', ($('.zoom_thumbs').width() / 2) * -1);
                } else {
                    $('.zoom_thumbs').css('top', 10);

                    if(settings.thumbsPosition == 'top') {
                        $('.zoom_thumbs').css('left', '50%');
                        $('.zoom_thumbs').css('margin-left', ($('.zoom_thumbs').width() / 2) * -1);
                    } 

                    if(settings.thumbsPosition == 'left') {
                        if(settings.expand)
                            $('.zoom_thumbs').css('left', $('.zoom_view img').offset().left - $('.zoom_thumbs').width() - 20);
                        else
                            $('.zoom_thumbs').css('left', $('.zoom_view').offset().left - $('.zoom_thumbs').width() - 20);
                    } 

                    if(settings.thumbsPosition == 'right') {
                        if(settings.expand)
                            $('.zoom_thumbs').css('left', ($('.zoom_view img').offset().left + $('.zoom_view img').width()) + 20);
                        else
                            $('.zoom_thumbs').css('left', ($('.zoom_view').offset().left + $('.zoom_view').width()) + 20);
                    } 
                }
            }

            if(!settings.expand) {
                $('.zoom_content').css({'width': (imgw) + parseInt(settings.borderContentWidth), 'height': (imgh) + parseInt(settings.borderContentHeight)});

                var cw = $(".zoom_content").width();
                var ch = $(".zoom_content").height();
                $(".zoom_content").css({'margin-left': (cw / 2) * -1, 'margin-top': (ch / 2) * -1, 'left': '50%', 'top': '50%'});
            }

            $(".zoom_overlay").addClass("open");
        },
        nextGallery: function(settings) {
            var next = parseInt(index)+1;
            if(next == total) {  next=0; }
            $(".zoom_view img").fadeOut(400, function() {
                $(".zoom_view img").attr('src', $(settings.id+'[data-index='+next+'] .background-img').css('background-image').replace(/^url\(['"]?/,'').replace(/['"]?\)$/,'') );

                $(".zoom_view img").css({'width': 'auto', 'height': 'auto'});

                var imgw = $(".zoom_view img").outerWidth();
                var imgh = $(".zoom_view img").outerHeight();

                var winwidth = $(window).outerWidth();
                var winheight = $(window).outerHeight();

                var proporcion = imgw/imgh;

                var extra = 0;

                if(settings.showThumbs && (settings.thumbsPosition == 'bottom' || settings.thumbsPosition == 'top')) {
                    extra = $('.zoom_thumbs').outerHeight() + 10;
                }

                if(settings.imgWidth == 'ajust') {
                    if(imgw >= (winwidth - (winwidth * 0.1))) {
                        imgw = (winwidth - (winwidth * 0.1)) * 0.9;

                        $(".zoom_view img").css('width', imgw);
                        imgh = (imgw / proporcion);
                        $(".zoom_view img").css('height', imgh);
                    }
                }

                if(settings.imgHeight == 'ajust') {
                    if(imgh >= (winheight - (winheight * 0.1 + extra))) {
                        imgh = (winheight - (winheight * 0.1 + extra)) * 0.9;

                        $(".zoom_view img").css('height', imgh);
                        imgw = (imgh * proporcion);
                        $(".zoom_view img").css('width', imgw);
                    }
                }

                if(settings.showThumbs && settings.thumbsPosition == 'top')
                    extra = extra * -1;

                $(".zoom_view img").css({'margin-left': (imgw / 2) * -1, 'margin-top': ((imgh + extra) / 2) * -1});

                if(!settings.expand) {
                    $('.zoom_content').css({'width': (imgw) + parseInt(settings.borderContentWidth), 'height': (imgh) + parseInt(settings.borderContentHeight)});

                    var cw = $(".zoom_content").width();
                    var ch = $(".zoom_content").height();
                    $(".zoom_content").css({'margin-left': (cw / 2) * -1, 'margin-top': (ch / 2) * -1, 'left': '50%', 'top': '50%'});
                }

             }).fadeIn(400);

            if(settings.showThumbs) {
                if(settings.thumbsPosition == 'bottom') {
                    $('.zoom_thumbs').css('bottom', 10);
                    $('.zoom_thumbs').css('left', '50%');
                    $('.zoom_thumbs').css('margin-left', ($('.zoom_thumbs').width() / 2) * -1);
                } else {
                    $('.zoom_thumbs').css('top', 10);

                    if(settings.thumbsPosition == 'top') {
                        $('.zoom_thumbs').css('left', '50%');
                        $('.zoom_thumbs').css('margin-left', ($('.zoom_thumbs').width() / 2) * -1);
                    } 

                    if(settings.thumbsPosition == 'left') {
                        if(settings.expand)
                            $('.zoom_thumbs').css('left', $('.zoom_view img').offset().left - $('.zoom_thumbs').width() - 20);
                        else
                            $('.zoom_thumbs').css('left', $('.zoom_view').offset().left - $('.zoom_thumbs').width() - 20);
                    } 

                    if(settings.thumbsPosition == 'right') {
                        if(settings.expand)
                            $('.zoom_thumbs').css('left', ($('.zoom_view img').offset().left + $('.zoom_view img').width()) + 20);
                        else
                            $('.zoom_thumbs').css('left', ($('.zoom_view').offset().left + $('.zoom_view').width()) + 20);
                    } 
                }
            }

            index = next;
        },
        prevGallery: function(settings) {
            var next = parseInt(index)-1;
            if(next == -1) {  next=parseInt(total)-1; }
            $(".zoom_view img").fadeOut(400, function() {
                $(".zoom_view img").attr('src', $(settings.id+'[data-index='+next+'] .background-img').css('background-image').replace(/^url\(['"]?/,'').replace(/['"]?\)$/,'') );

                $(".zoom_view img").css({'width': 'auto', 'height': 'auto'});

                var imgw = $(".zoom_view img").outerWidth();
                var imgh = $(".zoom_view img").outerHeight();

                var winwidth = $(window).outerWidth();
                var winheight = $(window).outerHeight();

                var proporcion = imgw/imgh;

                var extra = 0;

                if(settings.showThumbs && (settings.thumbsPosition == 'bottom' || settings.thumbsPosition == 'top')) {
                    extra = $('.zoom_thumbs').outerHeight() + 10;
                }

                if(settings.imgWidth == 'ajust') {
                    if(imgw >= (winwidth - (winwidth * 0.1))) {
                        imgw = (winwidth - (winwidth * 0.1)) * 0.9;

                        $(".zoom_view img").css('width', imgw);
                        imgh = (imgw / proporcion);
                        $(".zoom_view img").css('height', imgh);
                    }
                }

                if(settings.imgHeight == 'ajust') {
                    if(imgh >= (winheight - (winheight * 0.1 + extra))) {
                        imgh = (winheight - (winheight * 0.1 + extra)) * 0.9;

                        $(".zoom_view img").css('height', imgh);
                        imgw = (imgh * proporcion);
                        $(".zoom_view img").css('width', imgw);
                    }
                }

                if(settings.showThumbs && settings.thumbsPosition == 'top')
                    extra = extra * -1;

                $(".zoom_view img").css({'margin-left': (imgw / 2) * -1, 'margin-top': ((imgh + extra) / 2) * -1});

                if(!settings.expand) {
                    $('.zoom_content').css({'width': (imgw) + parseInt(settings.borderContentWidth), 'height': (imgh) + parseInt(settings.borderContentHeight)});

                    var cw = $(".zoom_content").width();
                    var ch = $(".zoom_content").height();
                    $(".zoom_content").css({'margin-left': (cw / 2) * -1, 'margin-top': (ch / 2) * -1, 'left': '50%', 'top': '50%'});
                }

             }).fadeIn(400);

            if(settings.showThumbs) {
                if(settings.thumbsPosition == 'bottom') {
                    $('.zoom_thumbs').css('bottom', 10);
                    $('.zoom_thumbs').css('left', '50%');
                    $('.zoom_thumbs').css('margin-left', ($('.zoom_thumbs').width() / 2) * -1);
                } else {
                    $('.zoom_thumbs').css('top', 10);

                    if(settings.thumbsPosition == 'top') {
                        $('.zoom_thumbs').css('left', '50%');
                        $('.zoom_thumbs').css('margin-left', ($('.zoom_thumbs').width() / 2) * -1);
                    } 

                    if(settings.thumbsPosition == 'left') {
                        if(settings.expand)
                            $('.zoom_thumbs').css('left', $('.zoom_view img').offset().left - $('.zoom_thumbs').width() - 20);
                        else
                            $('.zoom_thumbs').css('left', $('.zoom_view').offset().left - $('.zoom_thumbs').width() - 20);
                    } 

                    if(settings.thumbsPosition == 'right') {
                        if(settings.expand)
                            $('.zoom_thumbs').css('left', ($('.zoom_view img').offset().left + $('.zoom_view img').width()) + 20);
                        else
                            $('.zoom_thumbs').css('left', ($('.zoom_view').offset().left + $('.zoom_view').width()) + 20);
                    } 
                }
            }

            index = next;
        },
        goTo: function(settings, index) {
            var next = index;
            if(next == -1) {  next=parseInt(total)-1; }
            $(".zoom_view img").fadeOut(400, function() {
                $(".zoom_view img").attr('src', $(settings.id+'[data-index='+next+'] img').attr('src') );

                $(".zoom_view img").css({'width': 'auto', 'height': 'auto'});

                var imgw = $(".zoom_view img").outerWidth();
                var imgh = $(".zoom_view img").outerHeight();

                var winwidth = $(window).outerWidth();
                var winheight = $(window).outerHeight();

                var proporcion = imgw/imgh;

                var extra = 0;

                if(settings.showThumbs && (settings.thumbsPosition == 'bottom' || settings.thumbsPosition == 'top')) {
                    extra = $('.zoom_thumbs').outerHeight() + 10;
                }

                if(settings.imgWidth == 'ajust') {
                    if(imgw >= (winwidth - (winwidth * 0.1))) {
                        imgw = (winwidth - (winwidth * 0.1)) * 0.9;

                        $(".zoom_view img").css('width', imgw);
                        imgh = (imgw / proporcion);
                        $(".zoom_view img").css('height', imgh);
                    }
                }

                if(settings.imgHeight == 'ajust') {
                    if(imgh >= (winheight - (winheight * 0.1 + extra))) {
                        imgh = (winheight - (winheight * 0.1 + extra)) * 0.9;

                        $(".zoom_view img").css('height', imgh);
                        imgw = (imgh * proporcion);
                        $(".zoom_view img").css('width', imgw);
                    }
                }

                if(settings.showThumbs && settings.thumbsPosition == 'top')
                    extra = extra * -1;

                $(".zoom_view img").css({'margin-left': (imgw / 2) * -1, 'margin-top': ((imgh + extra) / 2) * -1});

                if(!settings.expand) {
                    $('.zoom_content').css({'width': (imgw) + parseInt(settings.borderContentWidth), 'height': (imgh) + parseInt(settings.borderContentHeight)});

                    var cw = $(".zoom_content").width();
                    var ch = $(".zoom_content").height();
                    $(".zoom_content").css({'margin-left': (cw / 2) * -1, 'margin-top': (ch / 2) * -1, 'left': '50%', 'top': '50%'});
                }

             }).fadeIn(400);

            if(settings.showThumbs) {
                if(settings.thumbsPosition == 'bottom') {
                    $('.zoom_thumbs').css('bottom', 10);
                    $('.zoom_thumbs').css('left', '50%');
                    $('.zoom_thumbs').css('margin-left', ($('.zoom_thumbs').width() / 2) * -1);
                } else {
                    $('.zoom_thumbs').css('top', 10);

                    if(settings.thumbsPosition == 'top') {
                        $('.zoom_thumbs').css('left', '50%');
                        $('.zoom_thumbs').css('margin-left', ($('.zoom_thumbs').width() / 2) * -1);
                    } 

                    if(settings.thumbsPosition == 'left') {
                        if(settings.expand)
                            $('.zoom_thumbs').css('left', $('.zoom_view img').offset().left - $('.zoom_thumbs').width() - 20);
                        else
                            $('.zoom_thumbs').css('left', $('.zoom_view').offset().left - $('.zoom_thumbs').width() - 20);
                    } 

                    if(settings.thumbsPosition == 'right') {
                        if(settings.expand)
                            $('.zoom_thumbs').css('left', ($('.zoom_view img').offset().left + $('.zoom_view img').width()) + 20);
                        else
                            $('.zoom_thumbs').css('left', ($('.zoom_view').offset().left + $('.zoom_view').width()) + 20);
                    } 
                }
            }

            index = next;
        },
        closeGallery: function() {
            $(".zoom_overlay").removeClass("open");
            //$("header, footer, .content_page").removeClass("displaynone");
            //$('body').css('overflow', 'auto');
            $(".zoom_overlay").fadeOut('fast', function() { $('.zoom_overlay').remove();});
        }
    };

    $.fn.gallery = function(method) {
        var gallery = {};

        if(methods[method])
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        else if(typeof method == 'object' || ! method)
            return methods.init.apply(this, arguments);
        else
            $.error('El metodo '+method+' no existe en el plugin');
    }

}(jQuery));