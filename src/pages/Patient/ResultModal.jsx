import { MdPerson, MdCalendarToday, MdWarning } from "react-icons/md";
import { AiOutlineFileText } from "react-icons/ai";
import { useRef, forwardRef, useImperativeHandle } from "react";

const ResultModal = forwardRef(({ patient, onClose }, ref) => {
  const dialogRef = useRef(null);

  useImperativeHandle(ref, () => ({
    open: () => dialogRef.current?.showModal(),
    close: () => dialogRef.current?.close(),
  }));

  const handleClose = () => {
    dialogRef.current?.close();
    onClose?.();
  };

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box max-w-5xl w-full">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={handleClose}
        >
          ✕
        </button>
        <div className="p-3 space-y-6 max-h-[88vh] overflow-y-auto">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Patient Analysis Results
            </h1>
            <p className="text-gray-600 mt-1">
              Detailed stroke risk assessment and recommendations
            </p>
          </div>
          {patient ? (
            <div className="card border rounded-md">
              <div className="card-body">
                <h2 className="card-title flex items-center">
                  <MdPerson className="text-xl" />
                  Patient Information
                </h2>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-500">Patient Name</p>
                    <p className="font-semibold text-lg">{patient.patient}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="font-semibold">{patient.age} years old</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Checkup</p>
                    <p className="font-semibold flex items-center">
                      <MdCalendarToday className="h-4 w-4 mr-1" />
                      {patient.lastCheckup}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Risk Level</p>
                    <span className="badge bg-red-100 text-red-800">
                      <MdWarning className="mr-1 text-lg" />
                      {patient.riskLevel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>No patient data available.</p>
          )}
          <div className="card rounded-md border">
            <div className="card-body">
              <h2 className="card-title">AI Analysis Results</h2>
              <p className="text-sm text-gray-600">
                Detailed findings from retinal image analysis
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-red-100 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">
                    Risk Factors Detected
                  </h4>
                  <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                    <li>Arteriovenous nicking present</li>
                    <li>Retinal hemorrhages detected</li>
                    <li>Cotton wool spots identified</li>
                    <li>Vessel caliber abnormalities</li>
                  </ul>
                </div>
                <div className="bg-blue-100 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Confidence Metrics
                  </h4>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Overall Accuracy:</span>
                      <span className="font-semibold">94.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Risk Classification:</span>
                      <span className="font-semibold">High (87.3%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Image Quality:</span>
                      <span className="font-semibold">Excellent</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card rounded-md border">
            <div className="card-body">
              <h2 className="card-title flex items-center">
                <AiOutlineFileText className="text-xl" />
                Clinical Recommendations
              </h2>
              <p className="text-sm text-gray-600">
                Add your professional assessment and treatment plan
              </p>
              <label className="label mt-4" htmlFor="recommendations">
                <span className="label-text font-medium">
                  Doctor's Notes & Recommendations
                </span>
              </label>
              <textarea
                id="recommendations"
                className="textarea textarea-bordered rounded-md w-full min-h-32"
                placeholder="Enter your clinical assessment, recommended treatments, follow-up schedule, and any additional notes..."
              ></textarea>
              <div className="flex justify-center mt-5">
                <button className="btn btn-neutral rounded-md">
                  Submit Recommendations
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
});

export default ResultModal;
