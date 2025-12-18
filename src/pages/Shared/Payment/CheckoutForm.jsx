import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

const CheckoutForm = ({ price, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const [clientSecret, setClientSecret] = useState('');
    const [error, setError] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (price > 0) {
            axiosSecure.post('/create-payment-intent', { price })
                .then(res => {
                    console.log("Client secret received");
                    setClientSecret(res.data.clientSecret);
                })
                .catch(err => {
                     console.error("Error creating payment intent:", err);
                     // Fallback order: Server Message -> Axios Message -> Generic Message
                     const errorMessage = err.response?.data?.message || err.message || "Failed to initialize payment. Please try again.";
                     setError(errorMessage);
                });
        }
    }, [axiosSecure, price]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const card = elements.getElement(CardElement);

        if (card === null) {
            return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card
        });

        if (error) {
            console.log('payment error', error);
            setError(error.message);
        } else {
            console.log('payment method', paymentMethod);
            setError('');
        }

        setProcessing(true);

        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    email: user?.email || 'anonymous',
                    name: user?.displayName || 'anonymous'
                }
            }
        });

        if (confirmError) {
             console.log('confirm error', confirmError);
             setError(confirmError.message);
             setProcessing(false);
        } else {
            console.log('payment intent', paymentIntent);
            if (paymentIntent.status === 'succeeded') {
                setTransactionId(paymentIntent.id);
                // Now save the payment in the database
                onSuccess(paymentIntent.id);
                setProcessing(false);
            }
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
                <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white transition-colors focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                            },
                        }}
                    />
                </div>
            </div>
            
            <button 
                className={`btn w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 rounded-xl 
                ${(!stripe || !clientSecret || processing) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                type="submit" 
                disabled={!stripe || !clientSecret || processing}
            >
                {processing ? <span className="loading loading-spinner text-white"></span> : `Pay $${price}`}
            </button>
            
            {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2 animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    {error}
                </div>
            )}
            
            {transactionId && (
                <div className="mt-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm flex items-center gap-2">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    <span>Success! Transaction ID: <span className="font-mono">{transactionId}</span></span>
                </div>
            )}
        </form>
    );
};

CheckoutForm.propTypes = {
    price: PropTypes.number.isRequired,
    onSuccess: PropTypes.func.isRequired
}

export default CheckoutForm;
