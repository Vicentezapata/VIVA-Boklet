$(document).ready(function() {
    $.getJSON('matriz.json', function(data) {
        // Cargar opciones del navbar
        var navbar = data.navbar;
        var navbarHtml = '<div class="hori-selector"><div class="left"></div><div class="right"></div></div>';
        navbar.forEach(function(item, index) {
            var activeClass = index === 0 ? 'active' : '';
            navbarHtml += '<li class="nav-item ' + activeClass + '"><a class="nav-link" href="javascript:void(0);" data-year="' + item + '"><i class="far fa-address-book"></i>' + item + '</a></li>';
        });
        $('#navbarSupportedContent ul').html(navbarHtml);

        // Función para cargar el contenido basado en el año seleccionado
        function loadContent(year) {
            var fotos = data.fotos[year];
            var aventurasHtml = '';
            var sidebarHtml = '';
            for (var aventura in fotos) {
                aventurasHtml += '<h3 class="text-white" id="'+aventura+'">' + aventura + ' (' + year + ')</h3>';
                aventurasHtml += '<p class="text-white">' + fotos[aventura].descripcion + '</p>';
                aventurasHtml += '<div class="row">';
                fotos[aventura].imagenes.forEach(function(foto) {
                    // Convertir imagen HEIC a JPEG/PNG
                    if (foto.src.endsWith('.heic') || foto.src.endsWith('.HEIC')) {
                        fetch(foto.src)
                            .then(response => response.blob())
                            .then(blob => heicConvert({ blob: blob, format: 'JPEG' }))
                            .then(conversionResult => {
                                var reader = new FileReader();
                                reader.onload = function(event) {
                                    aventurasHtml += '<div class="col-6"><div class="polaroid"><img src="' + event.target.result + '" alt="' + foto.caption + '"><div class="caption">' + foto.caption + '</div></div></div>';
                                    $('#aventuras-content').html(aventurasHtml);
                                };
                                reader.readAsDataURL(conversionResult);
                            })
                            .catch(error => console.error('Error converting HEIC image:', error));
                    } else {
                        aventurasHtml += '<div class="col-6"><div class="polaroid"><img src="' + foto.src + '" alt="' + foto.caption + '"><div class="caption">' + foto.caption + '</div></div></div>';
                    }
                });
                aventurasHtml += '</div>'; // Cerrar la fila
                sidebarHtml += '<li class="nav-item"><a class="nav-link" href="#'+aventura+'">' + aventura + '</a></li>';
            }
            $('#aventuras-content').html(aventurasHtml);
            $('.sticky-sidebar .nav').html(sidebarHtml);
        }

        // Cargar contenido del primer año por defecto
        loadContent(navbar[0]);

        // Manejar clics en el navbar
        $('#navbarSupportedContent').on('click', 'li a', function() {
            var year = $(this).data('year');
            $('#navbarSupportedContent ul li').removeClass('active');
            $(this).parent().addClass('active');
            loadContent(year);
        });

        // Inicializar la animación del navbar
        test();
    });
});