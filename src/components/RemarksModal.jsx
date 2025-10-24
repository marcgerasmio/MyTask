import { forwardRef, useImperativeHandle, useState, useEffect, useRef } from "react";
import { FaTimes, FaPaperPlane } from "react-icons/fa";
import Supabase from "../Supabase";

const TaskRemarksModal = forwardRef(({ task, currentUser }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [remarks, setRemarks] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false)
  }));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [remarks]);

  useEffect(() => {
    if (isOpen && task) {
      fetchRemarks();
    }
  }, [isOpen, task]);

  const fetchRemarks = async () => {
    if (!task) return;
    
    setLoading(true);
    const { data, error } = await Supabase
      .from("remarks")
      .select(`
        *,
        users:user_id (
          id,
          first_name,
          last_name,
          image,
          position
        )
      `)
      .eq("task_id", task.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching remarks:", error);
    } else {
      setRemarks(data || []);
    }
    setLoading(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !task || !currentUser) return;

    const { data, error } = await Supabase
      .from("remarks")
      .insert([
        {
          task_id: task.id,
          user_id: currentUser.id,
          message: newMessage.trim()
        }
      ])
      .select(`
        *,
        users:user_id (
          id,
          first_name,
          last_name,
          image,
          position
        )
      `);

    if (error) {
      console.error("Error sending message:", error);
    } else {
      setRemarks([...remarks, ...data]);
      setNewMessage("");
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed backdrop-blur-xs inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-green-900 text-white p-4 rounded-t-lg flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-bold text-lg">{task?.title}</h3>
            <p className="text-sm text-green-100 mt-1">{task?.description}</p>
            <p className="text-xs text-green-200 mt-1">Deadline: {task?.deadline}</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-green-800 p-2 rounded"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-gray-500">Loading remarks...</div>
            </div>
          ) : remarks.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-gray-400">No remarks yet. Start the conversation!</div>
            </div>
          ) : (
            <div className="space-y-4">
              {remarks.map((remark) => {
                const isCurrentUser = remark.user_id === currentUser?.id;
                return (
                  <div
                    key={remark.id}
                    className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex gap-2 max-w-[70%] ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
                      <img
                        src={remark.users?.image || "/default-avatar.png"}
                        alt={`${remark.users?.first_name} ${remark.users?.last_name}`}
                        className="w-8 h-8 rounded-full flex-shrink-0"
                      />
                      <div>
                        <div
                          className={`rounded-lg p-3 ${
                            isCurrentUser
                              ? "bg-green-900 text-white"
                              : "bg-white text-gray-800 border border-gray-200"
                          }`}
                        >
                          <div className="text-xs font-semibold mb-1">
                            {remark.users?.first_name} {remark.users?.last_name}
                            <span className={`ml-2 font-normal ${isCurrentUser ? "text-green-200" : "text-gray-400"}`}>
                              ({remark.users?.position})
                            </span>
                          </div>
                          <div className="text-sm">{remark.message}</div>
                        </div>
                        <div className={`text-xs text-gray-400 mt-1 ${isCurrentUser ? "text-right" : "text-left"}`}>
                          {formatTime(remark.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder="Type your remark..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-green-900 text-white px-6 py-2 rounded-lg hover:bg-green-800 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FaPaperPlane size={16} />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

TaskRemarksModal.displayName = "TaskRemarksModal";

export default TaskRemarksModal;