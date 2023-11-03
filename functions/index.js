const functions = require('firebase-functions');
// Stripe function
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
        const session = await stripe.checkout.sessions.create({
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
            success_url: req.body.url + "/success-payment",
            cancel_url: req.body.url + "/cancel-payment",
        });

        res.status(200).json(session);
    } catch (error) {
        next(error);
    }
});

exports.api = functions.https.onRequest(app);

// Time scheduledFunction
const admin = require('firebase-admin');
admin.initializeApp();

exports.scheduledFunction = functions.pubsub
  .schedule('every 20 minutes') 
  .timeZone('Europe/Budapest')
  .onRun(async (context) => {
    const db = admin.firestore();
    
    const collectionRef = db.collection('Users');
    const querySnapshot = await collectionRef.get();
    
    querySnapshot.forEach(async (doc) => {
        const userData = doc.data();
        if(userData.discountToLink){
            await doc.ref.update({ discount: 5});
        } else {
            await doc.ref.update({ discount: 0});
        }
        
        if(userData.gameHealth < 3){
            await doc.ref.update({ gameHealth: 3 });
        }
        
    });
    
    return null;
  });