import Sidebar from "../../components/Sidebar";

const AddPatient = () => {
  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <h1 className="text-3xl font-extrabold">
              Add Patient
              <span className="block font-normal text-lg text-gray-600">
                Easily register new patients and begin tracking their care
                journey.
              </span>
            </h1>
          </div>
        </main>
      </div>
    </>
  );
};

export default AddPatient;
