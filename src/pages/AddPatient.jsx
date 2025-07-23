import Sidebar from "../components/Sidebar";

const AddPatient = () => {
  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-6">
          <h1>Add Patient</h1>
        </main>
      </div>
    </>
  );
};

export default AddPatient;
