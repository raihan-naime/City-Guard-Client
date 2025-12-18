import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import PropTypes from 'prop-types';

// Retrieve key from env
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripeKey) {
    console.error("VITE_STRIPE_PUBLISHABLE_KEY is missing! Payment will fail.");
} else {
    console.log("Stripe Key loaded:", stripeKey.slice(0, 8) + "...");
}

const stripePromise = loadStripe(stripeKey);

const Payment = ({ price, onSuccess }) => {
    if (!stripeKey) return <div className="text-red-500">Stripe Configuration Missing</div>;
    return (
        <div className="w-full">
            <Elements stripe={stripePromise}>
                <CheckoutForm price={price} onSuccess={onSuccess} />
            </Elements>
        </div>
    );
};

Payment.propTypes = {
    price: PropTypes.number.isRequired,
    onSuccess: PropTypes.func.isRequired
}

export default Payment;
