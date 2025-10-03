import UserModal from "../../components/UserModal";
import TaskModal from "../../components/TaskModal";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FetchUsers, FetchEmotions} from "../../lib/data";

const EmotionCard = () => {
  const [EmotionData, setEmotion] = useState([]);
  const [UserData, setUsers] = useState([]);
    useEffect(() => {
    FetchEmotions().then(setEmotion);
    }, []);
    useEffect(() => {
    FetchUsers().then(setUsers);
    }, []);
  
  
  const navigate = useNavigate();
  const modalRef = useRef();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

 
  const filteredEmployees = UserData.filter((emp) => {
    const search = searchTerm.toLowerCase();
    return emp.first_name.toLowerCase().includes(search);
  });
  const getOngoingTask = (tasksData) =>
    tasksData?.find((task) => task.status === "ongoing");

  return (
    <>
      
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 mt-8 p-4 bg-white rounded shadow">
          {filteredEmployees.map((emp) => {
            const employeeEmotion = EmotionData.filter(
              (task) => task.user_id === emp.id
            );
            const nowEmotion = employeeEmotion.find(
              (task) => task.emotion != null
            );
            
            return (
              <div key={emp.id}>
                <div className="mt-5 text-center font-bold text-lg mb-4">
                  <div className="relative inline-block">
                    <img 
                      className="rounded-full h-20 w-20 mx-auto mb-2" 
                      src={emp.image} 
                      alt="Avatar" 
                    />
                    <div className="absolute bottom-17 left-15 w-10 h-10 bg-gray-300 rounded-full border-2 border-white">
                      {nowEmotion ? nowEmotion.emotion : '😐'}
                    </div> 
                  </div>
                  <div>{emp.first_name}</div>
                </div>
              </div>
            );
          })}
        </div>
      {selectedEmployee && (
        <UserModal
          ref={modalRef}
          patient={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          showTasks 
        />
      )}
        <TaskModal
           ref={modalRef}
          onClose={() => {}}
        />
    </>
  );
};

export default EmotionCard;