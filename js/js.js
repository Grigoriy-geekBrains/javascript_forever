'use strict';

window.addEventListener('load', () => {
    const product = new Product();
    product.init();
    product.getProductsFromServer('/products');
});

function makeGetRequest(url){
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status !== 200) reject();
                const goods = JSON.parse(xhr.responseText);
                resolve(goods);
            }
        };
        xhr.send();
    });
}

class Product {
    constructor(){
        this.cart = [];
        this.products = null;
        this.domElements = {
            goods: null,
            noGoods: null,
            gallery_product: null,
            cart_info: null,
            total_price: 0,
        }
    }

    // Сохранение DOM элементов
    setupDomElements(){
        this.domElements.goods = document.querySelector('.goods');
        this.domElements.noGoods = document.querySelector('.noGoods');
        this.domElements.cart_info = document.querySelector('.commonInfo');
        this.domElements.gallery_product = document.querySelector('.product__gallery');
        this.domElements.total_price = document.querySelector('.sumCost');
        this.products = [];
    }
    init(){
        this.setupDomElements();
        document.querySelectorAll('.product__addToCart').forEach(function(value){
            value.addEventListener('click', self.product__addToCart);
        });
    }
    // Вывод карточек продукта
    createListOfProducts(){
        for (let n = 0; n < this.products.length; n++){
            let product = document.querySelector('.product__blank .product__container').cloneNode(true);
            let image = product.querySelector('.product__img');
            image.src = this.products[n].img;
            product.querySelector('.product__items-caption').textContent = this.products[n].caption;
            product.querySelector('.product__items-price').textContent = '$'+this.products[n].price;
            let button = product.querySelector('.product__addToCart');
            button.addEventListener('click', (event) => this.product__addToCart(event));
            button.dataset.id = n.toString();
            this.domElements.gallery_product.appendChild(product);
        }
    }
    // Отрисовка корзины
    renderCart(){
        this.domElements.goods.innerHTML = '';
        let totalPrice = 0;
        for (let n = 0; n < this.cart.length; n++){
            let product = document.querySelector('.product__blank .cart-menu-section').cloneNode(true);
            product.querySelector('.cart-product').src =  this.products[this.cart[n]].img;
            product.querySelector('.cart-menu-info-caption').textContent = this.products[this.cart[n]].caption;
            product.querySelector('.quantity').textContent = this.products[this.cart[n]].quantity;
            product.querySelector('.cart-menu-info-price .price').textContent = '$'+this.products[this.cart[n]].price;
            let button = product.querySelector('.cart-menu-iconClosed');
            button.addEventListener('click', (event) => this.deleteGoodsFromCart(event));
            button.dataset.id = n;
            this.domElements.goods.appendChild(product);
            totalPrice += this.products[this.cart[n]].quantity*this.products[this.cart[n]].price;
        }
        this.domElements.total_price.textContent = '$' + totalPrice;
    }
    // Добавление товара в корзину по клику
    product__addToCart(event){
        event.preventDefault();
        let id = event.target.dataset.id;
        let existId = this.cart.indexOf(id);
        if (existId !== -1){
            this.products[this.cart[existId]].quantity++;
        } else {
            this.cart.push(id);
        }
        this.renderCart();
        if (this.domElements.goods.classList.contains('hide')){
            this.domElements.goods.classList.remove('hide');
            this.domElements.goods.classList.add('show');
            this.domElements.cart_info.classList.add('showBlock');
            this.domElements.cart_info.classList.remove('hide');
            this.domElements.noGoods.classList.remove('show');
            this.domElements.noGoods.classList.add('hide');
        }
    }
    // Удаление товара из корзины через список товаров в корзине
    deleteGoodsFromCart(event){
        let id = event.target.parentNode.dataset.id;
        if (this.products[this.cart[id]].quantity > 1){
            this.products[this.cart[id]].quantity--;
        } else {
            this.cart.splice(id, 1);
        }
        this.renderCart();
        if (!this.cart.length){
            this.domElements.goods.classList.remove('show');
            this.domElements.goods.classList.add('hide');
            this.domElements.cart_info.classList.add('hide');
            this.domElements.cart_info.classList.remove('showBlock');
            this.domElements.noGoods.classList.remove('hide');
            this.domElements.noGoods.classList.add('show');
        }
    }
    getProductsFromServer(url){
        return makeGetRequest(url).then(
            (products) => {
                this.products = products;
                this.createListOfProducts();
            }
        )
    }
}
