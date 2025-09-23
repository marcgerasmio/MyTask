import { FaBackward } from "react-icons/fa";
import { MdError } from "react-icons/md";

const Loading = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
    <div className="flex flex-col items-center space-y-4 vh-50 bg-gray-200 p-6 rounded-lg shadow-md">
    <span className="loading loading-dots loading-xl"></span>
    <h1>Processing.</h1>
    <p>Please wait while data is loading.</p>
    </div>
  </div>
);

export default Loading;