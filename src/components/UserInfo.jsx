const UserInfo = () => {
  return (
    <div className="p-4 border-t border-gray-300">
      <div className="flex items-center space-x-3 mb-4">
        <img
          className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"
          src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
          alt="user"
        />
        <div>
          <p className="text-sm font-bold">Dr. Juan Dela Cruz</p>
          <p className="text-xs text-gray-700">Ophthalmologist</p>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
