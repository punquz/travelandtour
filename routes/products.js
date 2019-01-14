const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const auth = require('../config/auth');
const isUser = auth.isUser;


const Product = require('../models/product');


const Category = require('../models/category');


router.get('/', function (req, res) {
//router.get('/', isUser, function (req, res) {

    Product.find(function (err, products) {
        if (err)
            console.log(err);

        res.render('all_products', {
            title: 'All products',
            products: products
        });
    });

});



router.get('/:category', function (req, res) {

    let categorySlug = req.params.category;

    Category.findOne({slug: categorySlug}, function (err, c) {
        Product.find({category: categorySlug}, function (err, products) {
            if (err)
                console.log(err);

            res.render('cat_products', {
                title: c.title,
                products: products
            });
        });
    });

});


router.get('/:category/:product', function (req, res) {

    let galleryImages = null;
    let loggedIn = (req.isAuthenticated()) ? true : false;

    Product.findOne({slug: req.params.product}, function (err, product) {
        if (err) {
            console.log(err);
        } else {
            let galleryDir = 'public/product_images/' + product._id + '/gallery';

            fs.readdir(galleryDir, function (err, files) {
                if (err) {
                    console.log(err);
                } else {
                    galleryImages = files;

                    res.render('product', {
                        title: product.title,
                        p: product,
                        galleryImages: galleryImages,
                        loggedIn: loggedIn
                    });
                }
            });
        }
    });

});

// Exports
module.exports = router;


