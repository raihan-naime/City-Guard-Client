import { Link } from "react-router-dom";

const ErrorPage = () => {
    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <h1 className="text-9xl font-bold">404</h1>
                    <p className="py-6 text-2xl font-semibold">Oops! Page not found.</p>
                    <p className="mb-8">The page you are looking for might have been removed had its name changed or is temporarily unavailable.</p>
                    <Link to="/" className="btn btn-primary">Back to Home</Link>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
