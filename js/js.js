'use strict';

const SearchComponent = {
    data(){
      return {
          query: ''
      }
    },
    template: `<div>
            <input type="text" class="search" v-model="query" placeholder="Search for Item...">
            <button class="submit__button"><i @click="handlerSearchGoods(query)" class="fas fa-search"></i></button>
        </div>`,
    methods: {
        handlerSearchGoods(query){
            event.preventDefault();
            this.$emit('onsearchclick',query);
        }
    }
};

const CartComponent = {
    props: ['cart','total'],
    data(){
        return {

        }
    },
    template: `<div class="header__cart">
                <a class="header__cart_link" href="shopping.html"></a>
                <div class="cart-menu">
                    <div class="goods">
                        <div v-if="cart.length === 0">Корзина пуста</div>
                        <div v-for="product in cart" :key="product.id" class="cart-menu-section">
                            <img :src="product.img" class="cart-product" alt="#"/>
                            <div class="cart-menu-info">
                                <p class="cart-menu-info-caption">{{product.caption}}</p>
                                <img class="cart-menu-info-rating" src="img/stars.png" alt="rating"/>
                                <p class="cart-menu-info-price">{{product.qty}}<span class="quantity"></span><span class="multi"> x </span><span class="price">{{'$' + product.price}}</span></p>
                            </div>
                            <a @click="handleDeleteFromCart(product.id)" class="cart-menu-iconClosed"><i :data-id="product.id" class="far fa-times-circle"></i></a>
                        </div>
                    </div>
                    <div v-if="cart.length !== 0" class="commonInfo hide">
                        <div class="cart-menu-total_price">
                            <p class="total_price">TOTAL</p>
                            <p class="total_price sumCost">{{total}}</p>
                        </div>
                        <div class="cart-menu-buttons">
                            <a href="checkout.html" class="cart-menu-button">Checkout</a>
                            <a href="shopping.html" class="cart-menu-button">Go to cart</a>
                        </div>
                    </div>
                </div>
            </div>`,
    methods: {
        handleDeleteFromCart(id){
            this.$emit('deletegoods',id);
        }
    }
};

const HeaderComponent = {
    props: ['cart','total'],
    data(){
        return {

        }
    },
    methods: {
        searchGoods(query){
            this.$emit('searchgoods',query);
        },
        deleteFromCart(id){
            this.$emit('deletegoodsfromcart',id);
        }
    },
    template: `<div class="container header__flex">
                    <div class="header__left">
                        <a href="index.html" class="logo">
                            <img class="img" src="img/logo.png" alt="logo"/>BRAN<span class="letter">D</span>
                        </a>
                        <form class="form" action="#">
                            <div class="browse">
                                Browse
                                <div class="arrow-bottom"></div>
                                <div class="browse__drop">
                                    <div class="mega-menu-section">
                                        <div class="mega-menu-section-caption">Women</div>
                                        <ul class="mega-menu-list">
                                            <li class="mega-menu-item"><a class="mega-menu-link" href="#">Dresses</a></li>
                                            <li class="mega-menu-item"><a class="mega-menu-link" href="#">Tops</a></li>
                                            <li class="mega-menu-item"><a class="mega-menu-link" href="#">Sweaters/Knits</a></li>
                                            <li class="mega-menu-item"><a class="mega-menu-link" href="#">Jackets/Coats</a></li>
                                            <li class="mega-menu-item"><a class="mega-menu-link" href="#">Blazers</a></li>
                                            <li class="mega-menu-item"><a class="mega-menu-link" href="#">Denim</a></li>
                                            <li class="mega-menu-item"><a class="mega-menu-link" href="#">Leggings/Pants</a></li>
                                            <li class="mega-menu-item"><a class="mega-menu-link" href="#">Skirts/Shorts</a></li>
                                            <li class="mega-menu-item"><a class="mega-menu-link" href="#">Accessories</a></li>
                                        </ul>

                                        <div class="mega-menu-section-caption">Men</div>
                                        <ul class="mega-menu-list">
                                            <li class="mega-menu-item"><a class="mega-menu-link" href="#">Tees/Tank tops</a></li>
                                            <li class="mega-menu-item"><a class="mega-menu-link" href="#">Shirts/Polos</a></li>
                                            <li class="mega-menu-item"><a class="mega-menu-link" href="#">Sweaters</a></li>
                                            <li class="mega-menu-item"><a class="mega-menu-link" href="#">Sweatshirts/Hoodies</a></li>
                                            <li class="mega-menu-item"><a class="mega-menu-link" href="#">Blazers</a></li>
                                            <li class="mega-menu-item"><a class="mega-menu-link" href="#">Jackets/vests</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <search-component @onsearchclick="searchGoods"></search-component>
                        </form>
                    </div>
                    <div class="header__right">
                        <cart-component :cart="cart" :total="total" @deletegoods="deleteFromCart"></cart-component>
                        <a href="#" class="cart_button">My Account</a>
                    </div>
                </div>`,
    components: {
        'search-component': SearchComponent,
        'cart-component': CartComponent,
    }
};

const GalleryGoods = {
    props: ['products'],
    template:
        `<div class="product__gallery">
            <div v-for="product in products" :key="product.id" class="product__container">
                <img :src="product.img" @click="toSinglePage(product.id)" class="product__img" alt="#"/>
                <div class="product__items-text">
                    <p class="product__items-caption">{{product.caption}}</p>
                    <p class="product__items-price">{{'$' + product.price}}</p>
                    <p class="product__stars"><img src="img/stars.png" alt="stars"/></p>
                </div>
                <a @click="addToCart(product.id)" href="#" :data-id="product.id" class="product__addToCart">Add to Cart</a>
            </div>
        </div>`,
    methods: {
        addToCart(id){
            let product = this.products.find(item => +item.id === +id);
            this.$emit('addtocart',product);
        },
        toSinglePage(id){
            this.$emit('tosinglepage',+id);
        }
    }
};

const PaginationComponent = {
    props: ['count_product','count_view'],
    data(){
        return {
            last_page: '',
            countArrowForVisible: 2,
            countPagesForEllipsis: 10,
            activeItem: 1,
            allProduct: false,
        }
    },
    template:
        `
        <div v-if="!allProduct" class="nav__pages">
            <div class="nav__pages__menu">
                <ul class="nav__pages__menu-block">
                    <li v-if="pages.length > countArrowForVisible" class="nav__pages__menu-item">
                        <a @click="changePage('prev')" class="nav__pages__menu-link" href="#">&lt;</a>
                    </li>
                    <li v-for="page in pages" class="nav__pages__menu-item">
                        <a @click="changePage(page.page)" :class="[page.active ? 'pageColor' : '']" :data-page="page.page" class="nav__pages__menu-link" href="#">{{page.page}}</a>
                    </li>
                    <li v-if="pages.length > countPagesForEllipsis" class="nav__pages__menu-item"><a class="nav__pages__menu-link" href="#">...</a></li>
                    <li v-if="pages.length > countPagesForEllipsis" class="nav__pages__menu-item"><a class="nav__pages__menu-link" href="#">{{last_page}}</a></li>
                    <li v-if="pages.length > countArrowForVisible" class="nav__pages__menu-item">
                        <a @click="changePage('next')" class="nav__pages__menu-link" href="#">&gt;</a>
                   </li>
                </ul>
            </div>
            <p @click="changePage('all')" class="nav__pages__buttonAll">View All</p>
        </div>`,
    methods: {
        changePage(page){
            let rpage;
            switch (page){
                case 'prev':
                    rpage = this.activeItem - 1;
                    if (rpage < 1) rpage = 1;
                    break;
                case 'next':
                    rpage = this.activeItem + 1;
                    if (rpage > this.last_page) rpage = this.last_page;
                    break;
                case 'all':
                    rpage = 'all';
                    this.allProduct = true;
                    break;
                default:
                    rpage = page;
            }
            if (rpage !== 'all'){
                this.pages[this.activeItem-1].active = false;
                this.activeItem = rpage;
                this.pages[rpage-1].active = true;
            }
            this.$emit('clickpage',rpage);
        }
    },
    computed: {
        pages(){
            this.countPage = Math.round(this.count_product / this.count_view);
            let p = this.count_product % this.count_view;
            if (p === 0){
                this.countPage--;
            }
            this.last_page = this.countPage;
            let arr_pages = [];
            for (let n = 0; n < this.countPage; n++){
                (n === 0) ? arr_pages.push({'page': n+1, 'active': true}) : arr_pages.push({'page': n+1, 'active': false});

            }
            return arr_pages;
        }
    }
};

const CartInfoComponent = {
    props: ['cart'],
    template:
        `<div class="shopping">
                <div class="container shopping__flex">
                    <div class="shopping__product_caption">
                        <div class="shopping__details-width">Product Details</div>
                        <div class="shopping__info-block shopping__info_block-width">
                            <p class="shopping__items_value-width">unite Price</p>
                            <p class="shopping__items_value-width">Quantity</p>
                            <p class="shopping__items_value-width">shipping</p>
                            <p class="shopping__items_value-width">Subtotal</p>
                            <p class="shopping__items_value-width">ACTION</p>
                        </div>
                    </div>
                    <div v-if="cart.length === 0">Корзина пуста</div>
                    <div v-for="product in cart" :key="product.id" class="shopping__product">
                        <div class="shopping__details shopping__details-width">
                            <img :src="product.img" class="shopping__details_image" alt="#"/>
                            <div class="shopping__parametrs">
                                <a href="#" class="shopping__parametrs_name">{{product.caption}}</a>
                                <p class="shopping__parametrs_property">Color: <span class="shopping__paramerts_slimText">{{product.color}}</span></p>
                                <p class="shopping__parametrs_property">Size: <span class="shopping__paramerts_slimText">{{product.size}}</span></p>
                            </div>
                        </div>
                        <div class="shopping__info-block shopping__info_block-width shopping__info-text">
                            <p class="shopping__items_value-width">{{'$' + product.price}}</p>
                            <p class="shopping__items_value-width"><input v-model="product.qty" class="shopping__input-param" type="number"></p>
                            <p class="shopping__items_value-width">FREE</p>
                            <p class="shopping__items_value-width">{{'$' + product.qty*product.price}}</p>
                            <p class="shopping__items_value-width shopping_button-close">
                                <i @click="handleDeleteFromCart(product.id)" class="fas fa-times-circle"></i>
                            </p>
                        </div>
                    </div>
                </div>
            </div>`,
    methods:{
        handleDeleteFromCart(id){
            this.$emit('deletegoods',id);
        }
    }
}

const CarouselComponent = {
    props: ['product'],
    template:
        `<div>
            <div class="carousel">
                    <div class="carousel__flex">
                        <div class="carousel__left">
                            <a class="carousel__button" href="#">&lt;</a>
                        </div>
                        <img class="carousel__img" src="img/slim_women.png" alt="slim_women"/>
                        <div class="carousel__right">
                            <a class="carousel__button" href="#">&gt;</a>
                        </div>
                    </div>
                </div>
            <div class="description">
                    <div class="container description__content">
                        <div class="description__collection-block">
                            <p class="description__collection">WOMEN COLLECTION</p>
                            <div class="navigation">
                                <a class="navigation-link" href="#"></a>
                                <a class="navigation-link" href="#"></a>
                                <a class="navigation-link" href="#"></a>
                            </div>
                        </div>
                        <p class="description__name">Moschino Cheap And Chic</p>
                        <div class="description__">
                            Compellingly actualize fully researched processes before proactive outsourcing. Progressively syndicate
                            collaborative architectures before cutting-edge services. Completely visualize parallel core
                            competencies rather than exceptional portals.
                        </div>
                        <div class="description__property">
                            <p class="description__property-text">MATERIAL: <span class="description__property-text-value">COTTON</span></p>
                            <p class="description__property-text">DESIGNER: <span class="description__property-text-value">BINBURHAN</span></p>
                        </div>
                        <p class="description__price">$561</p>
                        <div class="description__options__wrapper">
                            <div class="description__options">
                                <div class="description__options-block">
                                    <p class="description__options__caption">CHOOSE COLOR</p>
                                    <div class="wrapper">
                                        <select class="description__options__select" name="#">
                                            <option class="description__option_color" value="#ff0000">Red</option>
                                        </select>
                                        <div class="block_color"></div>
                                    </div>
                                </div>
                                <div class="description__options-block">
                                    <p class="description__options__caption">CHOOSE SIZE</p>
                                    <select class="description__options__select" name="#">
                                        <option value="XXL">XXL</option>
                                    </select>
                                </div>
                                <div class="description__options-block">
                                    <p class="description__options__caption">QUANTITY</p>
                                    <input type="number" class="description__options__select description__options__input" value="2">
                                </div>
                            </div>
                            <a class="description__add-cart-button" href="#">
                                <div class="header__cart"></div>
                                <p href="#" class="description__add-cart-label">Add to Cart</p>
                            </a>
                        </div>
                    </div>
                </div>
        </div>`
}

const SubscribeComponent = {
    data(){
        return {
            email: ''
        }
    },
    template:
        `<div class="subscribe">
                <div class="subscribe__background"></div>
                <div class="container subscribe__content">
                    <div class="subscribe__left">
                        <div class="subscribe__left-content">
                            <img class="subscribe_img" src="img/subscribe_face.png" alt="subscribe_face"/>
                            <div class="subscribe-text">
                                <p class="subscribe__comment">“Vestibulum quis porttitor dui! Quisque viverra nunc mi,
                                    a pulvinar purus condimentum a. Aliquam condimentum mattis neque sed pretium”</p>
                                <p class="subscribe__author">Bin Burhan</p>
                                <p class="subscribe__place">Dhaka, Bd</p>
                                <div class="subscribe__slider">
                                    <a class="subscriber__slider-item" href="#"></a>
                                    <a class="subscriber__slider-item" href="#"></a>
                                    <a class="subscriber__slider-item" href="#"></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="subscribe__right">
                        <div class="subscribe__right-content">
                            <div class="subscribe__caption">
                                <p>Subscribe</p>
                                <p>FOR OUR NEWLETTER AND PROMOTION</p>
                            </div>
                        </div>
                        <form class="subscribe__form" action="">
                            <input v-model="email" class="subscribe__form-input" type="text" placeholder="Enter Your Email"/>
                            <a @click="addSubscribe" class="subscribe__form-submit" href="#">Subscribe</a>
                        </form>
                    </div>
                </div>
            </div>`,
    methods: {
        addSubscribe(){
            event.preventDefault();
            if (!this.checkEmail()){
                console.log('Не верный формат email');
                return;
            }
            fetch('/subscribe', {
                method: 'POST',
                body: JSON.stringify({email: this.email}),
                headers: {
                    'Content-type': 'application/json',
                }
            })
                .then(response => response.json())
                .then(response => {
                    if (response.result){
                        console.log('Подписчик добавлен в базу')
                    } else {
                        console.log('Подписчик не добавлен в базу')
                    }

                })
                .catch(() => {this.errorFetch = 'Не удалось добавить подписчика а базу'});
            this.email = '';
        },
        checkEmail(){
            let pattern = /^[A-z0-9_-]+@[A-z]+\.[A-z]{1,5}$/i;
            return pattern.test(this.email);
        }
    }
}

const FooterComponent = {
    template:
        `<footer class="footer">
            <div class="container footer__information">
                <div class="footer__information-block footer__big__information">
                    <div class="footer__information-caption">
                        <div class="footer__container-logo">
                            <a href="index.html" class="logo">
                                <img class="logo_img" src="img/logo.png" alt="logo"/>BRAN<span class="letter">D</span>
                            </a>
                        </div>
                    </div>
                    <div class="footer_information-text">
                        <p class="text">
                            Objectively transition extensive data rather than cross functional solutions. Monotonectally syndicate multidisciplinary materials before go forward benefits.
                            Intrinsicly syndicate an expanded array of processes and cross-unit partnerships.</p>

                        <p class="text">Efficiently plagiarize 24/365 action items and focused infomediaries.
                            Distinctively seize superior initiatives for wireless technologies. Dynamically optimize.

                            Objectively strategize seamless relationships via resource sucking testing procedures. Proactively cultivate next-generation results for value-added methodologies. Dynamically plagiarize unique methodologies after performance based methodologies. Monotonectally empower stand-alone mindshare rather than ubiquitous opportunities. Dynamically orchestrate resource sucking scenarios after alternative synergy.

                            Compellingly envisioneer corporate methods of empowerment before standards compliant technologies. Objectively facilitate progressive.
                        </p>
                    </div>
                </div>
                <div class="footer__information-block">
                    <div class="footer__information-caption">COMPANY</div>
                    <div class="footer__information-list">
                        <a class="footer__link" href="#">Home</a>
                        <a class="footer__link" href="#">Shop</a>
                        <a class="footer__link" href="#">About</a>
                        <a class="footer__link" href="#">How It Works</a>
                        <a class="footer__link" href="#">Contact</a>
                    </div>
                </div>
                <div class="footer__information-block">
                    <div class="footer__information-caption">INFORMATION</div>
                    <div class="footer__information-list">
                        <a class="footer__link" href="#">Tearms & Condition</a>
                        <a class="footer__link" href="#">Privacy Policy</a>
                        <a class="footer__link" href="#">How to Buy</a>
                        <a class="footer__link" href="#">How to Sell</a>
                        <a class="footer__link" href="#">Promotion</a>
                    </div>
                </div>
                <div class="footer__information-block">
                    <div class="footer__information-caption">SHOP CATEGORY</div>
                    <div class="footer__information-list">
                        <a class="footer__link" href="#">Men</a>
                        <a class="footer__link" href="#">Women</a>
                        <a class="footer__link" href="#">Child</a>
                        <a class="footer__link" href="#">Apparel</a>
                        <a class="footer__link" href="#">Brows</a>
                    </div>
                </div>
            </div>
            <div class="footer__copyright">
                <div class="container footer__copyright-flex">
                    <div class="footer__copyright__left">
                        <p class="copyright">© 2017  Brand  All Rights Reserved.</p>
                    </div>
                    <div class="footer__copyright__right">
                        <a class="social__icon" href="#"><i class="fab fa-facebook-f"></i></a>
                        <a class="social__icon" href="#"><i class="fab fa-twitter"></i></a>
                        <a class="social__icon" href="#"><i class="fab fa-linkedin-in"></i></a>
                        <a class="social__icon" href="#"><i class="fab fa-pinterest"></i></a>
                        <a class="social__icon" href="#"><i class="fab fa-google-plus-g"></i></a>
                    </div>
                </div>
            </div>
        </footer>`
};

const vue = new Vue({
    el: '#app',
    data: {
        products: [],
        cart: [],
        count_product: '',
        count_view: 3,
        viewAllProduct: false,
        single_product: '',
    },
    methods: {
        getElementFromServerForMain(){
            fetch('/hitsProduct')
                .then(response => response.json())
                .then((items) => {
                    this.products = items;
                })
                .catch(() => {alert('Товары не найдены')})
        },
        getElementFromServer(page){
             fetch(`/products/${page}`)
                .then(response => response.json())
                .then(response => {
                    this.products = response.products;
                    this.count_product = response.count;
                    if (page === 'all') this.viewAllProduct = true;
                })
                .catch(() => {alert('Товары не найдены')})
        },
        getCartFromServer(){
            fetch('/cart')
                .then(response => response.json())
                .then((items) => {
                    this.cart = items;
                })
                .catch(() => {alert('Корзина не получена')})
        },
        addToCart(item) {
            event.preventDefault();
            const cartItem = this.cart.find((cartItem) => +cartItem.id === +item.id);
            if (cartItem) {
                fetch(`/cart/${item.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({qty: cartItem.qty + 1}),
                    headers: {
                        'Content-type': 'application/json',
                    }
                })
                    .then(response => response.json())
                    .then(response => {
                        (response.result) ? cartItem.qty++ : alert('Не удалось добавить товар в корзину');
                    });
            } else {
                fetch('/cart', {
                    method: 'POST',
                    body: JSON.stringify({...item, qty: 1}),
                    headers: {
                        'Content-type': 'application/json',
                    },
                })
                    .then(response => response.json())
                    .then(response => {
                        (response.result) ? this.cart.push({...item, qty: 1}) : alert('Не удалось добавить товар в корзину');
                    });
            }
        },
        deleteFromCart(id){
            event.preventDefault();
            const cartItem = this.cart.find((cartItem) => +cartItem.id === +id);
            if (cartItem && cartItem.qty > 1) {
                fetch(`/cart/${id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({ qty: cartItem.qty - 1 }),
                    headers: {
                        'Content-type': 'application/json',
                    }
                })
                    .then(response => response.json())
                    .then(response => {
                        (response.result) ? cartItem.qty-- : alert('Не удалось добавить товар в корзину');
                    });
            } else {
                if (confirm('Вы действительно хотите удалить последний товар?')) {
                    fetch(`/cart/${id}`, {
                        method: 'DELETE',
                    })
                        .then(response => response.json())
                        .then(response => {
                            (response.result) ? this.cart = this.cart.filter((item) => item.id !== id) : alert('Не удалось удалить товар из корзину');
                        });
                }
            }
        },
        changePage(page){
            event.preventDefault();
            if (page === 'all'){
                this.getElementFromServer('all');
            } else {
                this.getElementFromServer(this.count_view*page);
            }
        },
        searchGoods(query){
            fetch('/search', {
                method: 'POST',
                body: JSON.stringify({search: query, viewPage: this.viewAllProduct}),
                headers: {
                    'content-type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(response => {
                    this.products = response.products;
                    this.count_product = response.count;
                });
        },
        toSinglePage(id){
            window.location.href = 'single_page.html';
        }
    },
    mounted(){
        let url = new RegExp('(index)|(\/$)');
        url.test(window.location.href) ? this.getElementFromServerForMain() : this.getElementFromServer(0);
        this.getCartFromServer();
    },
    computed: {
        findTotal() {
            return '$' + this.cart.reduce((accumulator, currentValue) => {
                return accumulator + currentValue.price * currentValue.qty;
            }, 0);
        }
    },
    components: {
        'header-component': HeaderComponent,
        'gallery-goods-component': GalleryGoods,
        'pagination-component': PaginationComponent,
        'cart-info-component': CartInfoComponent,
        'carouse-component': CarouselComponent,
        'subscribe-component': SubscribeComponent,
        'footer-component': FooterComponent,
    }
});








