import Sidebar from "../../components/Sidebar";
import DashCard from "../Dashboard/DashCard";
import Deadline from "./Deadline";
import MyCalendar from "../../components/Calendar";
import EmotionCard from "../Dashboard/EmotionCard";
import { useState } from "react";
import InputEmoji from "react-input-emoji";
import { saveEmotion } from "../../lib/functions";

const EmployeeDashboard = () => {
const user = JSON.parse(sessionStorage.getItem("user"));
const [emotion, setEmotion] = useState('');
  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-3 pt-20 lg:p-6 lg:pt-6 lg:ml-64">
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
                        className="bg-green-900 text-white btn rounded-lg mb-5"
                        onClick={()=>document.getElementById('my_modal_1').showModal()}>
                        How are you feeling today?
                        </button>
                        </div>
          </div>
          <EmotionCard />
          <div className="grid grid-cols-2 gap-4">
        <Deadline />
        <MyCalendar />
          </div>
        </main>
      </div>
      <dialog id="my_modal_1" className="modal">
      <div className="modal-box bg-gray-200">
        <h3 className="font-bold text-lg">Hello! How are you feeling today?</h3>
          <InputEmoji
          value={emotion}
          onChange={setEmotion}
          placeholder="Type a message"
          maxLength="1"
        />
        <div className="modal-action">
            <button className="btn bg-green-900 text-white rounded-1g"
            onClick={() => saveEmotion("emotion", user.id, emotion)}>
              Save</button>
        </div>
      </div>
    </dialog>
    </>
  );
};

export default EmployeeDashboard;
