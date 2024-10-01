document.addEventListener("DOMContentLoaded", function() {
    const links = document.querySelectorAll("nav a");
    const contents = document.querySelectorAll(".tab-content");
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const favoritesBtn = document.getElementById('favorites-btn');
    const favoritesContent = document.getElementById('favorites-content');
    const favoritesProducts = document.getElementById('favorites-products');

    const ayudaLink = document.getElementById('ayuda-link');
    const politicasLink = document.getElementById('politicas-link');
    const ayudaContent = document.getElementById('ayuda-content');
    const politicasContent = document.getElementById('politicas-content');

    const jsonFiles = {
        "consolas": "productos_consolas.json",
        "juegos": "productos_juegos.json",
        "procesadores": "productos_procesadores.json",
        "placas-de-video": "productos_placas-de-video.json",
        "monitores": "productos_monitores.json",
        "perifericos": "productos_perifericos.json"
    };

    function cargarProductos() {
        for (let categoria in jsonFiles) {
            fetch(jsonFiles[categoria])
                .then(response => response.json())
                .then(productos => {
                    productos.forEach(producto => {
                        const productElement = document.createElement('div');
                        productElement.classList.add('product');
                        productElement.innerHTML = `
                            <h2>${producto.nombre}</h2>
                            <img src="${producto.imagen}" alt="${producto.nombre}">
                            <p>${producto.descripcion}</p>
                            <p>Precio: $${producto.precio.toLocaleString()}</p>
                            <button class="add-to-favorites">Añadir a favoritos</button>
                        `;
                        const targetContent = document.getElementById(`${categoria}-content`);
                        targetContent.appendChild(productElement);

                        productElement.querySelector('.add-to-favorites').addEventListener('click', function() {
                            agregarAFavoritos(producto);
                        });
                    });
                })
                .catch(error => console.error('Error al cargar los productos:', error));
        }
    }

    cargarProductos();

    links.forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const targetId = link.id.replace("-link", "-content");

            contents.forEach(content => {
                content.style.display = "none";
            });

            const targetContent = document.getElementById(targetId);
            targetContent.style.display = "flex";
            targetContent.style.flexWrap = "wrap";
            targetContent.style.overflowX = "auto";
        });
    });

    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const query = searchInput.value.toLowerCase();
        let resultsFound = false;
        searchResults.innerHTML = '';
        contents.forEach(content => {
            const products = content.querySelectorAll('.product');
            products.forEach(product => {
                const title = product.querySelector('h2').textContent.toLowerCase();
                const description = product.querySelector('p').textContent.toLowerCase();
                if (title.includes(query) || description.includes(query)) {
                    const clonedProduct = product.cloneNode(true);
                    searchResults.appendChild(clonedProduct);
                    resultsFound = true;
                }
            });
        });

        if (resultsFound) {
            contents.forEach(content => content.style.display = 'none');
            searchResults.style.display = 'flex';
            searchResults.style.flexWrap = 'wrap';
            searchResults.style.overflowX = 'auto';
        } else {
            searchResults.innerHTML = '<p>No se encontraron productos.</p>';
            searchResults.style.display = 'block';
        }
    });

    // Función para agregar a favoritos
    function agregarAFavoritos(producto) {
        let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
        if (!favoritos.some(fav => fav.nombre === producto.nombre)) {
            favoritos.push(producto);
            localStorage.setItem('favoritos', JSON.stringify(favoritos));
            
            // Usar Toastify para mostrar una notificación
            Toastify({
                text: `${producto.nombre} añadido a favoritos.`,
                duration: 3000,
                gravity: "top",  // Posición: 'top' o 'bottom'
                position: "center",  // Posición: 'left', 'center' o 'right'
                backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",  // Color personalizado
                close: true
            }).showToast();
        } else {
            // Notificación para cuando el producto ya está en favoritos
            Toastify({
                text: `${producto.nombre} ya está en favoritos.`,
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "linear-gradient(to right, #007BFF, #00BFFF)",  // Color diferente
                close: true
            }).showToast();
        }
    }

    // Función para quitar de favoritos
    function quitarDeFavoritos(nombreProducto) {
        let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
        favoritos = favoritos.filter(producto => producto.nombre !== nombreProducto);
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
        cargarFavoritos();
        
        // Usar Toastify para mostrar una notificación al quitar de favoritos
        Toastify({
            text: `${nombreProducto} fue eliminado de favoritos.`,
            duration: 3000,
            gravity: "top",
            position: "center",
            backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
            close: true
        }).showToast();
    }

    function cargarFavoritos() {
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
        favoritesProducts.innerHTML = '';
        if (favoritos.length > 0) {
            favoritos.forEach(producto => {
                const productElement = document.createElement('div');
                productElement.classList.add('product');
                productElement.innerHTML = `
                    <h2>${producto.nombre}</h2>
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <p>${producto.descripcion}</p>
                    <p>Precio: $${producto.precio.toLocaleString()}</p>
                    <button class="remove-from-favorites">Quitar de favoritos</button>
                `;
                productElement.querySelector('.remove-from-favorites').addEventListener('click', function() {
                    quitarDeFavoritos(producto.nombre);
                });
                favoritesProducts.appendChild(productElement);
            });
        } else {
            favoritesProducts.innerHTML = '<p>No hay productos en favoritos.</p>';
        }
    }

    // Mostrar favoritos
    favoritesBtn.addEventListener('click', function() {
        contents.forEach(content => content.style.display = 'none');
        cargarFavoritos();
        favoritesContent.style.display = 'flex';
        favoritesContent.style.flexWrap = 'wrap';
        favoritesContent.style.overflowX = 'auto';
    });

    // Mostrar ayuda
    ayudaLink.addEventListener('click', function() {
        contents.forEach(content => content.style.display = 'none');
        ayudaContent.style.display = 'block';
        ayudaContent.style.flexWrap = 'wrap';
        ayudaContent.style.overflowX = 'auto';
    });

    // Mostrar políticas
    politicasLink.addEventListener('click', function() {
        contents.forEach(content => content.style.display = 'none');
        politicasContent.style.display = 'block'; // Cambiado a block
        politicasContent.style.flexWrap = 'wrap';
        politicasContent.style.overflowX = 'auto';
    });

    // Funcionalidad para copiar el correo al portapapeles
    document.getElementById("copy-email").addEventListener("click", function(event) {
        event.preventDefault(); // Evita el comportamiento predeterminado del enlace
    
        const email = "electromundosoporte42@gmail.com";
    
        const tempInput = document.createElement("input");
        tempInput.value = email;
        document.body.appendChild(tempInput);
    
        tempInput.select();
        document.execCommand("copy");
    
        document.body.removeChild(tempInput);
    
        document.getElementById("copy-message").style.display = "inline";
        
        setTimeout(function() {
            document.getElementById("copy-message").style.display = "none";
        }, 3000);
    });

    // Funcionalidad para mostrar productos aleatorios en la página de inicio
    const homeContent = document.getElementById('home-content');
    let allProducts = [];

    // Función para cargar todos los productos de las categorías
    function cargarProductosInicio() {
        let fetchPromises = [];

        for (let categoria in jsonFiles) {
            fetchPromises.push(
                fetch(jsonFiles[categoria])
                    .then(response => response.json())
                    .then(productos => {
                        allProducts = allProducts.concat(productos);
                    })
                    .catch(error => console.error('Error al cargar los productos:', error))
            );
        }

        // Cuando todas las promesas de fetch se resuelvan, seleccionamos los productos aleatorios
        Promise.all(fetchPromises).then(() => {
            mostrarProductosAleatorios(6);  // Mostrar 6 productos aleatorios
        });
    }

    // Función para mostrar productos aleatorios
    function mostrarProductosAleatorios(cantidad) {
        let productosAleatorios = obtenerProductosAleatorios(allProducts, cantidad);

        productosAleatorios.forEach(producto => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');
            productElement.innerHTML = `
                <h2>${producto.nombre}</h2>
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <p>${producto.descripcion}</p>
                <p>Precio: $${producto.precio.toLocaleString()}</p>
                <button class="add-to-favorites">Añadir a favoritos</button>
            `;
            homeContent.appendChild(productElement);

            // Añadir el evento para el botón de favoritos
            productElement.querySelector('.add-to-favorites').addEventListener('click', function() {
                agregarAFavoritos(producto);
            });
        });

        homeContent.style.display = 'flex';
        homeContent.style.flexWrap = 'wrap';
    }

    // Función para obtener una cantidad específica de productos aleatorios
    function obtenerProductosAleatorios(productos, cantidad) {
        let productosAleatorios = [];
        let productosCopia = [...productos];

        while (productosAleatorios.length < cantidad && productosCopia.length > 0) {
            let indiceAleatorio = Math.floor(Math.random() * productosCopia.length);
            productosAleatorios.push(productosCopia.splice(indiceAleatorio, 1)[0]);
        }

        return productosAleatorios;
    }

    // Cargar todos los productos y mostrar 6 aleatorios en la página de inicio
    cargarProductosInicio();
});