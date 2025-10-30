import { useState } from 'react';
import { Client } from "@gradio/client";
import { Activity, User, Heart, Droplet, Cigarette, AlertCircle } from 'lucide-react';

export default function RetinalHealthPredictor() {
  const [formData, setFormData] = useState({
    age: '',
    sex: '0',
    bp_systolic: '',
    bp_diastolic: '',
    diabetes: '',
    smoking: '0',
    hypertension: '',
    strokehistory: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const client = await Client.connect("Maikuuuu/RetinalText");
      const response = await client.predict("/predict", {
        age: parseInt(formData.age),
        sex: formData.sex,
        bp_systolic: parseInt(formData.bp_systolic),
        bp_diastolic: parseInt(formData.bp_diastolic),
        diabetes: parseInt(formData.diabetes),
        smoking: formData.smoking,
        hypertension: parseInt(formData.hypertension),
        strokehistory: parseInt(formData.strokehistory)
      });
      
      setResult(response.data);
    } catch (err) {
      setError(err.message || 'An error occurred while making the prediction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Retinal Health Predictor</h1>
          </div>
          
          <p className="text-gray-600 mb-8">
            Enter patient health information to get a retinal health prediction.
          </p>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter age"
                />
              </div>

              {/* Sex */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sex
                </label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="0">0</option>
                  <option value="1">1</option>
                </select>
              </div>

              {/* Blood Pressure Systolic */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Heart className="w-4 h-4 inline mr-2" />
                  Systolic BP (mmHg)
                </label>
                <input
                  type="number"
                  name="bp_systolic"
                  value={formData.bp_systolic}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., 120"
                />
              </div>

              {/* Blood Pressure Diastolic */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Heart className="w-4 h-4 inline mr-2" />
                  Diastolic BP (mmHg)
                </label>
                <input
                  type="number"
                  name="bp_diastolic"
                  value={formData.bp_diastolic}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., 80"
                />
              </div>

              {/* Diabetes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Droplet className="w-4 h-4 inline mr-2" />
                  Diabetes (0=No, 1=Yes)
                </label>
                <input
                  type="number"
                  name="diabetes"
                  value={formData.diabetes}
                  onChange={handleChange}
                  required
                  min="0"
                  max="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="0 or 1"
                />
              </div>

              {/* Smoking */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Cigarette className="w-4 h-4 inline mr-2" />
                  Smoking Status
                </label>
                <select
                  name="smoking"
                  value={formData.smoking}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>

              {/* Hypertension */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hypertension (0=No, 1=Yes)
                </label>
                <input
                  type="number"
                  name="hypertension"
                  value={formData.hypertension}
                  onChange={handleChange}
                  required
                  min="0"
                  max="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="0 or 1"
                />
              </div>

              {/* Stroke History */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <AlertCircle className="w-4 h-4 inline mr-2" />
                  Stroke History (0=No, 1=Yes)
                </label>
                <input
                  type="number"
                  name="strokehistory"
                  value={formData.strokehistory}
                  onChange={handleChange}
                  required
                  min="0"
                  max="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="0 or 1"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : 'Get Prediction'}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Prediction Results</h2>
            <div className="bg-indigo-50 p-6 rounded-lg">
              <pre className="text-gray-800 whitespace-pre-wrap overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Error Section */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">Error</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}