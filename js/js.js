'use strict';

const SearchComponent = {
    data(){
      return {
          query: ''
      }
    },
    template:
        `<div>
            <input type="text" class="search" v-model="query" placeholder="Search for Item...">
            <button class="submit__button"><i @click="handlerSearchGoods(query)" class="fas fa-search"></i></button>
        </div>`,
    methods: {
        handlerSearchGoods(query){
            this.$emit('onsearchclick',query);
        }
    }
};

const CartComponent = {
    props: ['cart','find-total'],
    template:
            `<div class="header__cart">
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
                            <a @click="deleteFromCart(product.id)" class="cart-menu-iconClosed"><i :data-id="product.id" class="far fa-times-circle"></i></a>
                        </div>
                    </div>
                    <div v-if="cart.length !== 0" class="commonInfo hide">
                        <div class="cart-menu-total_price">
                            <p class="total_price">TOTAL</p>
                            <p class="total_price sumCost">{{find-total}}</p>
                        </div>
                        <div class="cart-menu-buttons">
                            <a href="checkout.html" class="cart-menu-button">Checkout</a>
                            <a href="shopping.html" class="cart-menu-button">Go to cart</a>
                        </div>
                    </div>
                </div>
            </div>`,
    methods: {
        deleteFromCart(id){
            this.$emit('delete',id);
        }
    }
};

const ErrorFetchComponent = {
     props: ['error'],
    template:
        `<div v-if="error !== ''" class="errorFetch">
            <p class="errorFetch__text">{{error}}</p>
            <button @click="closeWindow" class="errorFetch__button">Закрыть</button>
        </div>`,
    methods: {
        closeWindow(){
            this.$emit('close','')
        }
    }
};


const vue = new Vue({
    el: '#app',
    data: {
        products: [],
        cart: [],
        filterGoods: [],
        errorFetch: ''
    },
    methods: {
        getElementFromServer(){
             fetch('/products')
                .then(response => response.json())
                .then((items) => {
                    this.products = items;
                    this.filterGoods = items;
                })
                .catch(() => {this.errorFetch = 'Товары не найдены'});
             fetch('/cart')
                .then(response => response.json())
                .then((items) => {
                    this.cart = items;
                })
                .catch(() => {this.errorFetch = 'Корзина не получена'});
        },
        addToCart(id){
            event.preventDefault();
            // получить индекс продукта в products по его id
            let index_product =  this.products.findIndex(product => product.id === id);
            if (index_product === -1){
                console.log('Товар не найден в базе, что странно');
                return;
            }
            // получить индекс продукта в cart по его id
            let index_cart = this.cart.findIndex(product => product.id === id);
            if (index_cart !== -1){
                // увеличиваем кол-во товаров корзине, если этот товар уже там есть
                this.updateCart(index_cart,this.cart[index_cart].qty+1);
            } else {
                // добавляем новую позицию товара в корзину
                let property = this.products[index_product];
                fetch('/cart', {
                    method: 'POST',
                    body: JSON.stringify({...property, qty: 1}),
                    headers: {
                        'Content-type': 'application/json',
                    },
                })
                    .then(response => response.json())
                    .then((product) => {
                        this.cart.push(product);
                    })
                    .catch(() => {this.errorFetch = 'Товар не добавлен в корзину'});
            }
        },
        deleteFromCart(id){
            event.preventDefault();
            let index_cart = this.cart.findIndex(product => product.id === id);
            if (this.cart[index_cart].qty > 1){
                this.updateCart(index_cart,this.cart[index_cart].qty-1);
            } else {
                fetch(`cart/${this.cart[index_cart].id}`,{
                    method: 'DELETE'
                })
                .catch(() => {this.errorFetch = 'Товар не удален из корзину'});
                this.cart.splice(index_cart,1);
            }
        },
        updateCart(index, newQty){
            fetch(`cart/${this.cart[index].id}`,{
                method: 'PATCH',
                body: JSON.stringify({qty: newQty}),
                headers: {
                    'Content-type': 'application/json',
                },
            })
                .then(response => response.json())
                .then(item => {
                    this.cart[index].qty = item.qty;
                })
                .catch(() => {this.errorFetch = 'Товар не добавлен в корзину'});
        },
        searchGoods(query){
            if (query === ''){
                this.filterGoods = this.products;
                return;
            }
            this.filterGoods = this.products.filter(item => {
                const rg = new RegExp(query,'i');
                return rg.test(item.caption);
            });
        },
        closeWindowError(){
            this.errorFetch = '';
        }
    },
    mounted(){
        this.getElementFromServer();
    },
    computed: {
        findTotal(){
            return '$' + this.cart.reduce((accumulator, currentValue) => {
                return accumulator + currentValue.price*currentValue.qty;
            },0);
        },
    },
    components: {
        'search-component': SearchComponent,
        'cart-component': CartComponent,
        'error-fetch-component': ErrorFetchComponent,
    }
});








