import { Audio, FidgetSpinner } from 'react-loader-spinner';
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLoadUserQuery } from "@/features/apis/authApi.js";

const Loader = ({ children }) => {
    const { isLoading } = useLoadUserQuery();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (isLoading) {
            setProgress(0);
            const interval = setInterval(() => {
                setProgress((prev) => (prev < 100 ? prev + 10 : 100)); // Increment progress
            }, 300);
            return () => clearInterval(interval); // Cleanup interval on unmount
        } else {
            setProgress(100);
        }
    }, [isLoading]);

    return isLoading ? (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <FidgetSpinner
                visible={true}
                height="80"
                width="80"
                // ballColors={"blue"}
                backgroundColor={"#3571A3"}
                ariaLabel="fidget-spinner-loading"
                wrapperStyle={{}}
                wrapperClass="fidget-spinner-wrapper"
            />
            <p className="mt-4 text-lg font-semibold text-gray-700">{progress}%</p>
        </div>
    ) : (
        <>{children}</>
    );
};

export default Loader;
