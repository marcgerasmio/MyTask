import Sidebar from "../../components/Sidebar";
import DashCard from "./DashCard";
import Activity from "./Activity"
import MyCalendar from "../../components/Calendar";
import EmotionCard from "./EmotionCard";
import { useState } from "react";
import InputEmoji from "react-input-emoji";
import { saveEmotion } from "../../lib/functions";

const Dashboard = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [emotion, setEmotion] = useState('');
  
  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 w-full p-4 pt-20 lg:p-6 lg:pt-6 lg:ml-64">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">
                Welcome back!
                <span className="block font-normal text-sm sm:text-base md:text-lg text-gray-600 mt-1">
                  Here's what's happening today.
                </span>
              </h1>
            </div>
            
            <div className="flex-shrink-0 w-full sm:w-auto">
              <button
                className="w-full sm:w-auto bg-green-900 hover:bg-green-800 text-white font-medium px-4 py-2.5 rounded-lg transition-colors duration-200"
                onClick={() => document.getElementById('my_modal_1').showModal()}
              >
                How are you feeling today?
              </button>
            </div>
          </div>


          <div className="mb-6">
            <EmotionCard />
          </div>

     
          <div className="mb-6">
            <DashCard />
          </div>


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
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
        <div className="modal-box bg-gray-200 overflow-visible w-11/12 max-w-md mx-4">
          <h3 className="font-bold text-lg md:text-xl mb-4">
            Hello! How are you feeling today?
          </h3>
          
          <div className="relative z-50 mb-4">
            <InputEmoji
              value={emotion}
              onChange={setEmotion}
              placeholder="Type a message"
              maxLength="1"
            />
          </div>
          
          <div className="modal-action flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button 
              className="btn bg-green-900 hover:bg-green-800 text-white rounded-lg flex-1 sm:flex-none order-2 sm:order-1"
              onClick={() => {
                saveEmotion("emotion", user.id, emotion);
                document.getElementById('my_modal_1').close();
              }}
            >
              Save
            </button>
            <button 
              className="btn bg-gray-400 hover:bg-gray-500 text-white rounded-lg flex-1 sm:flex-none order-1 sm:order-2"
              onClick={() => document.getElementById('my_modal_1').close()}
            >
              Cancel
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default Dashboard;