const UserInfo = () => {
     const user = JSON.parse(sessionStorage.getItem("user"));
  return (
    <div className="p-4 border-t border-gray-300">
      <div className="flex items-center space-x-3 mb-4">
        <img
          className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"
          src={user.image}
          alt="user"
        />
        <div>
          <p className="text-sm font-bold">{user.first_name} {user.last_name}</p>
          <p className="text-xs text-gray-700">{user.position}</p>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
