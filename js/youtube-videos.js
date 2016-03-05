
function onPlayerReady(event) {
    event.target.setVolume(event.target.j.j.volumen);
    setTimeout(function() {
        event.target.playVideo();
    }, 200);    
}

(function($){
    
		var methods = {
        init: function(options) {
            var settings = $.extend({
                'id': this.selector,
                'idyoutube': 'Gt_YxNg21QM',
                'contenedorVideo': 'winVideo',
                'initonclick': true,
                'usefancy': true,
                'videoYT': null,
                'controlsYT': 0,
                'disablekbYT': 1,
                'fsYT': 0,
                'loopYT': 1,
                'modestbrandingYT': 1,
                'relYT': 0,
                'showinfoYT': 0,
                'videoWidth': 'ajust',
                'videoHeight': 'ajust',
                'eventosYT': '',
                'volume': 0
            }, options);

            return this.each(function() {
                $(this).videos('startVideo', settings);
            });
        },
        createVideo: function(settings) {
            if(settings.videoWidth == 'ajust') 
                var vw = $(window).width();
            else
                var vw = settings.videoWidth;

            if(settings.videoHeight == 'ajust') 
                var vh = $(window).height()+($(window).width()/21);
            else
                var vh = settings.videoHeight;

            settings.videoYT = new YT.Player(settings.contenedorVideo, {
                height: vh,
                width: vw,
                volumen: settings.volume,
                videoId: settings.idyoutube,
                playerVars: { 'controls': settings.controlsYT, 'disablekb': settings.disablekbYT, 'fs': settings.fsYT, 'loop': settings.loopYT,
                    'modestbranding': settings.modestbrandingYT, 'rel': settings.relYT, 'showinfo': settings.showinfoYT, 'wmode': 'opaque' },
                events: { 'onReady': onPlayerReady }
            });
        },
        startVideo: function(settings) {
            if(settings.usefancy) {
                var output = '<div class="cvpresen">' +
                    '<div class="innervbck"></div>' +
                    '<div class="innervpresen">' +
                        '<div id="winVideo"></div>'+
                    '</div>'+
                '<button class="cvm"><span>Volver</span></button>' +
                '</div>';

                $('body').append(output);
            }

            $('.innervbck').bind('click', function() {
                $(this).videos('closeVideo', settings);
            });
            $('.cvm').bind('click', function() {
                $(this).videos('closeVideo', settings);
            });

            $(this).videos('createVideo', settings);

            $('body').css('overflow', 'hidden');

            if(settings.usefancy)
                $('.cvpresen').fadeIn();
        },
        closeVideo: function(settings) {
            $('body').css('overflow', 'auto');
            settings.videoYT.stopVideo();
            $('.cvpresen').fadeOut(400, function() {$('.cvpresen').remove();});
        }
    };

    $.fn.videos = function(method) {
        var videos = {};

        if(methods[method])
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        else if(typeof method == 'object' || ! method)
            return methods.init.apply(this, arguments);
        else
            $.error('El metodo '+method+' no existe en el plugin');
    }

}(jQuery));

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var players = new Array();
    var canal;

    function onYouTubeIframeAPIReady() {
      $('.js-inicia-video').each(function(i) {
        $(this).bind('click', function() {
            var ytid = $(this).data('idyt');
            $(this).videos({'idyoutube': ytid, 'volume': 100});
        });
      })
  
}