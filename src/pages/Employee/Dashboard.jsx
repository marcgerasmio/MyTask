import Sidebar from "../../components/Sidebar";
import DashCard from "../Dashboard/DashCard";
import Deadline from "./Deadline";
import MyCalendar from "../../components/Calendar";
import EmotionCard from "../Dashboard/EmotionCard";
import { useState, useEffect } from "react";
import InputEmoji from "react-input-emoji";
import { saveEmotion } from "../../lib/functions";
import Activity from "../Dashboard/Activity";

const EmployeeDashboard = () => {
  const getUserData = () => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) {
        console.error("No user data found in session storage");
        return null;
      }
      const parsedUser = JSON.parse(userData);
      
   
      if (!parsedUser || !parsedUser.id || !parsedUser.first_name) {
        console.error("Invalid user data structure");
        return null;
      }
      
      return parsedUser;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  };

  const user = getUserData();
  const [emotion, setEmotion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      setError("Unable to load user data. Please log in again.");
    }
  }, [user]);

  const handleEmotionChange = (value) => {
    setError('');
    if (value !== null && value !== undefined) {
      setEmotion(value);
    }
  };

  const handleSaveEmotion = async () => {
    if (!user || !user.id) {
      setError("User information is missing. Please log in again.");
      return;
    }

    if (!emotion || emotion.trim() === '') {
      setError("Please enter how you're feeling before saving.");
      return;
    }

    if (emotion.trim().length === 0) {
      setError("Please enter a valid emotion.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      await saveEmotion("emotion", user.id, emotion.trim());
      
      setEmotion('');
      document.getElementById('my_modal_1').close();
    } catch (err) {
      setError("Failed to save emotion. Please try again.");
      console.error("Error saving emotion:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setEmotion('');
    setError('');
    document.getElementById('my_modal_1').close();
  };


  if (!user) {
    return (
      <div className="flex min-h-screen bg-gray-100 items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">
            Unable to load user data. Please log in again.
          </p>
          <button
            className="bg-green-900 text-white px-4 py-2 rounded-lg"
            onClick={() => window.location.href = '/login'}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
       <main className="flex-1 w-full p-4 pt-20 lg:p-6 lg:pt-6 lg:pl-72">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold">
                Welcome back, {user.first_name}!
                <span className="block font-normal text-sm sm:text-base text-gray-600">
                  Here's what's happening today.
                </span>
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 align-center">
              <button
                className="bg-green-900 text-white btn rounded-lg mb-5 hover:bg-green-800 transition-colors"
                onClick={() => document.getElementById('my_modal_1').showModal()}
              >
                How are you feeling today?
              </button>
            </div>
          </div>

          <div className="mb-6">
            <EmotionCard />
          </div>
        
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="w-full">
              <Deadline />
            </div>
              <div className="w-full">
              <Activity />
            </div>
            <div className="w-full">
              <MyCalendar />
            </div>
          </div>
        </main>
      </div>
      
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box bg-green-900 overflow-visible">
          <h3 className="font-bold text-lg mb-4 text-white">Hello! How are you feeling today?</h3>
          
          {error && (
            <div className="alert alert-error mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <div className="relative z-50">
            <InputEmoji
              value={emotion}
              onChange={handleEmotionChange}
              placeholder="Type a message"
              maxLength="1"
            />
          </div>
          
          <div className="modal-action">
            <button 
              className="btn bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              onClick={handleCloseModal}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              className="btn bg-green-900 text-white rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSaveEmotion}
              disabled={isSubmitting || !emotion.trim()}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default EmployeeDashboard;