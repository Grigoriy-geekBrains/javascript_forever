'use strict';

const vue = new Vue({
    el: '#app',
    data: {
        products: [],
        cart: [],
    },
    methods: {
        getElementFromServer(){
             fetch('/products')
                .then(response => response.json())
                .then((items) => {
                    this.products = items;
                });
            fetch('/cart')
                .then(response => response.json())
                .then((items) => {
                    this.cart = items;
                });
        },
        addToCart(event){
            event.preventDefault();
            let id_product = +event.target.dataset.id;
            // получить индекс продукта в products по его id
            let index_product =  this.products.findIndex(product => product.id === id_product);
            if (index_product === -1){
                console.log('Товар не найден в базе, что странно');
                return;
            }
            // получить индекс продукта в cart по его id
            let index_cart = this.cart.findIndex(product => product.id === id_product);
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
                    });
            }
        },
        deleteFromCart(event){
            event.preventDefault();
            let id_product = +event.target.dataset.id;
            let index_cart = this.cart.findIndex(product => product.id === id_product);
            if (this.cart[index_cart].qty > 1){
                this.updateCart(index_cart,this.cart[index_cart].qty-1);
            } else {
                fetch(`cart/${this.cart[index_cart].id}`,{
                    method: 'DELETE'
                });
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
                });
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
        }
    }
});


// return this.topping.reduce((accumulator, currentValue) => {
//     return accumulator + currentValue.getCalories();
// },0);








