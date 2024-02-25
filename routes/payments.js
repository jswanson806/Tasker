// This is your test secret API key.
const stripe = require('stripe')('sk_test_51MNeg0DugXxFxym6nqUpiTKKtRpdLwRjM4Hix8NKPObBVtDYIVuW8FxTbLipSvxvt4Oj45yjeUe2iFUTTLVrdadF00KclEHSAC');
const express = require('express');
const router = new express.Router();

const YOUR_DOMAIN = 'http://localhost:3000';

router.post('/create-checkout-session', async (req, res, next) => {
  try {
    const { job } = req.body;
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price_data: {
              currency: 'usd',
              product_data: {
                  name: 'Tasker Services',
                  description: `Services rendered for job ${job.title}`,

              },
              unit_amount_decimal: job.payment_due,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/`,
      cancel_url: `${YOUR_DOMAIN}/`,
    });

    res.status(200).json({url: session.url});
    
  } catch(err) {
    return next(err);
  }
});

module.exports = router;