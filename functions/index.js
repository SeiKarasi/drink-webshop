const functions = require('firebase-functions');
const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");

const app = express();
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());
app.use(cors({origin: true, credentials: true}));

const stripe = require("stripe")("sk_test_51Nps1yBErcCUqQ7GjzxnPDUc7ZaTIpGOMYWQ3nQK9mYS6k6JtsAkkEU4swZKowVHigca5nDUGgGqYlH1BeWOK2vJ00mLO9iiFn");

app.post("/checkout", async(req, res, next) => {
    try {
        const session =  await stripe.checkout.sessions.create({
            line_items: req.body.items.map((item) => ({
                price_data: {
                    currency: 'huf',
                    product_data: {
                        name: item.name,
                        images: [req.body.images.find(i => i.includes(item.id))]
                    },
                    unit_amount: item.price * 100,
                },
                quantity: item.quantity,
            })),
            mode: "payment",
            success_url: "https://trinkydrinky-webshop.web.app/success-payment",
            cancel_url: "https://trinkydrinky-webshop.web.app/cancel-payment",
        });

        res.status(200).json(session);
    } catch (error) {
        next(error);
    }
});

exports.api = functions.https.onRequest(app);