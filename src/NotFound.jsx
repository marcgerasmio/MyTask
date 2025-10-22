import { FaBackward } from "react-icons/fa";
import { MdError } from "react-icons/md";

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
    <MdError className="text-red-500" style={{ fontSize: "6rem" }} />
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
        <button
        className="bg-red-500 text-white btn rounded-lg mb-5"
        onClick={() => history.back()}>
        <FaBackward className="h-4 w-4 mr-2" />
       Go Back
        </button>
  </div>
);

export default NotFound;