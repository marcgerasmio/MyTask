// import React, { useState, useEffect } from 'react';
// import { Upload, User, GraduationCap, Briefcase, Award, FileText, Download } from 'lucide-react';

// const PDSExtractor = () => {
//   const [pdsData, setPdsData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [pdfLibReady, setPdfLibReady] = useState(false);

//   useEffect(() => {
//     // Load PDF.js library
//     const script = document.createElement('script');
//     script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
//     script.async = true;
//     script.onload = () => {
//       if (window.pdfjsLib) {
//         window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
//           'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
//         setPdfLibReady(true);
//       }
//     };
//     script.onerror = () => {
//       setError('Failed to load PDF library');
//     };
//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   const extractPDSInfo = async (file) => {
//     setLoading(true);
//     setError(null);

//     try {
//       if (!window.pdfjsLib) {
//         throw new Error('PDF library not loaded yet. Please try again.');
//       }

//       const arrayBuffer = await file.arrayBuffer();
//       const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
//       let fullText = '';
//       for (let i = 1; i <= pdf.numPages; i++) {
//         const page = await pdf.getPage(i);
//         const textContent = await page.getTextContent();
//         const pageText = textContent.items.map(item => item.str).join(' ');
//         fullText += pageText + '\n';
//       }

//       // Extract information using patterns
//       const extractedData = {
//         personal: extractPersonalInfo(fullText),
//         education: extractEducation(fullText),
//         training: extractTraining(fullText),
//         workExperience: extractWorkExperience(fullText),
//         rawText: fullText
//       };

//       setPdsData(extractedData);
//     } catch (err) {
//       setError('Failed to extract PDF content: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const extractPersonalInfo = (text) => {
//     const info = {};
    
//     // Name patterns
//     const nameMatch = text.match(/(?:NAME|SURNAME|FIRST\s*NAME)[:\s]+([\w\s,]+?)(?:\n|MIDDLE)/i);
//     if (nameMatch) info.name = nameMatch[1].trim();

//     // Date of birth
//     const dobMatch = text.match(/(?:DATE\s*OF\s*BIRTH|BIRTH\s*DATE)[:\s]+(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i);
//     if (dobMatch) info.dateOfBirth = dobMatch[1];

//     // Place of birth
//     const pobMatch = text.match(/(?:PLACE\s*OF\s*BIRTH)[:\s]+([\w\s,]+?)(?:\n|SEX)/i);
//     if (pobMatch) info.placeOfBirth = pobMatch[1].trim();

//     // Contact
//     const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
//     if (emailMatch) info.email = emailMatch[1];

//     const phoneMatch = text.match(/(?:MOBILE|PHONE|CONTACT)[:\s]*([\d\s\-+()]{10,})/i);
//     if (phoneMatch) info.phone = phoneMatch[1].trim();

//     // Address
//     const addressMatch = text.match(/(?:ADDRESS|RESIDENTIAL)[:\s]+([\w\s,#.-]+?)(?:\n\n|\n[A-Z]{3})/i);
//     if (addressMatch) info.address = addressMatch[1].trim();

//     return info;
//   };

//   const extractEducation = (text) => {
//     const education = [];
//     const patterns = [
//       /(?:ELEMENTARY|PRIMARY)[:\s]+([\w\s,.-]+?)(?:\d{4}|\n)/gi,
//       /(?:SECONDARY|HIGH\s*SCHOOL)[:\s]+([\w\s,.-]+?)(?:\d{4}|\n)/gi,
//       /(?:COLLEGE|UNIVERSITY|BACHELOR|MASTER|DOCTORATE)[:\s]+([\w\s,.-]+?)(?:\d{4}|\n)/gi
//     ];

//     patterns.forEach(pattern => {
//       const matches = text.matchAll(pattern);
//       for (const match of matches) {
//         if (match[1] && match[1].trim().length > 3) {
//           education.push(match[1].trim());
//         }
//       }
//     });

//     return education.length > 0 ? education : ['No education information found'];
//   };

//   const extractTraining = (text) => {
//     const training = [];
//     const trainingSection = text.match(/(?:TRAINING|SEMINAR|CERTIFICATE)[:\s\n]+([\s\S]{0,500})/i);
    
//     if (trainingSection) {
//       const lines = trainingSection[1].split('\n').filter(line => line.trim().length > 10);
//       training.push(...lines.slice(0, 5));
//     }

//     return training.length > 0 ? training : ['No training information found'];
//   };

//   const extractWorkExperience = (text) => {
//     const experience = [];
//     const expSection = text.match(/(?:WORK\s*EXPERIENCE|EMPLOYMENT|POSITION)[:\s\n]+([\s\S]{0,800})/i);
    
//     if (expSection) {
//       const lines = expSection[1].split('\n').filter(line => line.trim().length > 10);
//       experience.push(...lines.slice(0, 8));
//     }

//     return experience.length > 0 ? experience : ['No work experience found'];
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (!pdfLibReady) {
//       setError('PDF library is still loading. Please wait a moment and try again.');
//       return;
//     }
//     if (file && file.type === 'application/pdf') {
//       extractPDSInfo(file);
//     } else {
//       setError('Please upload a valid PDF file');
//     }
//   };

//   const downloadJSON = () => {
//     if (!pdsData) return;
    
//     const dataStr = JSON.stringify(pdsData, null, 2);
//     const dataBlob = new Blob([dataStr], { type: 'application/json' });
//     const url = URL.createObjectURL(dataBlob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = 'pds_extracted_data.json';
//     link.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
//       <div className="max-w-6xl mx-auto">
//         <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
//             <FileText className="text-indigo-600" size={36} />
//             PDS Information Extractor
//           </h1>
//           <p className="text-gray-600 mb-6">Upload a Personal Data Sheet (PDS) PDF to extract structured information</p>

//           <div className="border-2 border-dashed border-indigo-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors">
//             <input
//               type="file"
//               accept=".pdf"
//               onChange={handleFileUpload}
//               className="hidden"
//               id="file-upload"
//               disabled={!pdfLibReady}
//             />
//             <label htmlFor="file-upload" className={`cursor-pointer ${!pdfLibReady ? 'opacity-50' : ''}`}>
//               <Upload className="mx-auto text-indigo-600 mb-4" size={48} />
//               <p className="text-lg font-medium text-gray-700 mb-2">
//                 {pdfLibReady ? 'Click to upload PDS PDF' : 'Loading PDF library...'}
//               </p>
//               <p className="text-sm text-gray-500">PDF files only</p>
//             </label>
//           </div>

//           {loading && (
//             <div className="mt-6 text-center">
//               <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
//               <p className="mt-4 text-gray-600">Extracting information...</p>
//             </div>
//           )}

//           {error && (
//             <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
//               {error}
//             </div>
//           )}
//         </div>

//         {pdsData && (
//           <>
//             <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-gray-800">Extracted Information</h2>
//                 <button
//                   onClick={downloadJSON}
//                   className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
//                 >
//                   <Download size={20} />
//                   Download JSON
//                 </button>
//               </div>

//               <div className="grid md:grid-cols-2 gap-6">
//                 <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
//                   <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                     <User className="text-blue-600" size={24} />
//                     Personal Information
//                   </h3>
//                   <div className="space-y-2">
//                     {Object.entries(pdsData.personal).map(([key, value]) => (
//                       <div key={key} className="bg-white p-3 rounded">
//                         <span className="font-medium text-gray-700 capitalize">
//                           {key.replace(/([A-Z])/g, ' $1').trim()}:
//                         </span>
//                         <span className="ml-2 text-gray-600">{value}</span>
//                       </div>
//                     ))}
//                     {Object.keys(pdsData.personal).length === 0 && (
//                       <p className="text-gray-500 italic">No personal information extracted</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
//                   <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                     <GraduationCap className="text-green-600" size={24} />
//                     Education
//                   </h3>
//                   <ul className="space-y-2">
//                     {pdsData.education.map((edu, idx) => (
//                       <li key={idx} className="bg-white p-3 rounded text-gray-700">
//                         {edu}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>

//                 <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
//                   <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                     <Award className="text-purple-600" size={24} />
//                     Training & Seminars
//                   </h3>
//                   <ul className="space-y-2">
//                     {pdsData.training.map((train, idx) => (
//                       <li key={idx} className="bg-white p-3 rounded text-gray-700">
//                         {train}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>

//                 <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg">
//                   <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                     <Briefcase className="text-orange-600" size={24} />
//                     Work Experience
//                   </h3>
//                   <ul className="space-y-2">
//                     {pdsData.workExperience.map((exp, idx) => (
//                       <li key={idx} className="bg-white p-3 rounded text-gray-700">
//                         {exp}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-lg shadow-xl p-8">
//               <h3 className="text-xl font-semibold text-gray-800 mb-4">JSON Output</h3>
//               <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
//                 {JSON.stringify(pdsData, null, 2)}
//               </pre>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PDSExtractor;