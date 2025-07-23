import Sidebar from "../components/Sidebar";

const Profile = () => {
  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-6">
          <h1>Profile</h1>
        </main>
      </div>
    </>
  );
};

export default Profile;
