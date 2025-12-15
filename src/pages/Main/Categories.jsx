import Sidebar from "../../components/Sidebar";
import { CiSearch } from "react-icons/ci";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { FaTimes, FaSave } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { deleteFunction } from "../../lib/functions";
import Supabase from "../../Supabase";

const Categories = () => {
  const dialogRef = useRef();
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [CategoryData, setCategoryData] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  const fetchCategories = async () => {
    const { data } = await Supabase.from("categories").select("*");
    setCategoryData(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredPatients = CategoryData.filter((p) => {
    const search = searchTerm.toLowerCase();
    const matchesNameOrAge = p.category_name.toLowerCase().includes(search);
    const matchesRisk = riskFilter === "" || p.riskLevel === riskFilter;
    return matchesNameOrAge && matchesRisk;
  });

  const openModal = (category = null) => {
    setSelectedCategory(category);
    setCategoryName(category ? category.category_name : "");
    dialogRef.current?.showModal();
  };

  const handleClose = () => {
    dialogRef.current?.close();
    setSelectedCategory(null);
    setCategoryName("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (selectedCategory) {
        // Update existing category
        const { error } = await Supabase
          .from("categories")
          .update({ category_name: categoryName })
          .eq("id", selectedCategory.id);
        
        if (error) throw error;
      } else {
        // Create new category
        const { error } = await Supabase
          .from("categories")
          .insert([{ category_name: categoryName }]);
        
        if (error) throw error;
      }
      
      fetchCategories();
      handleClose();
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Failed to save category");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        const { error } = await Supabase
          .from("categories")
          .delete()
          .eq("id", id);
        
        if (error) throw error;
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Failed to delete category");
      }
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 pt-20 sm:p-6 lg:pt-6 lg:ml-64">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold">
              Categories Management
              <span className="block font-normal text-sm sm:text-base text-gray-600">
                Manage your task categories.
              </span>
            </h1>
            <div className="flex flex-col sm:flex-row gap-2">
              <label className="input rounded-md bg-white flex items-center gap-2">
                <CiSearch className="opacity-50" />
                <input
                  type="search"
                  className="w-full"
                  required
                  placeholder="Search name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </label>
              <button
                className="bg-green-900 text-white btn rounded-lg"
                onClick={() => openModal()}
              >
                <IoIosAddCircle className="h-4 w-4 mr-2" />
                Add Category
              </button>
            </div>
          </div>
          <div className="overflow-x-auto p-6 bg-white mt-6 rounded-md shadow-md">
            <table className="table table-sm">
              <thead>
                <tr className="text-xs sm:text-sm">
                  <th>Category ID</th>
                  <th>Category Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((category) => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="text-sm sm:text-base">
                          {category.category_name}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-sm btn-ghost"
                          onClick={() => openModal(category)}
                        >
                          <FaRegEdit className="h-4 w-4" />
                        </button>
                        <button
                          className="btn btn-sm btn-ghost text-red-600"
                          onClick={() => handleDelete(category.id)}
                        >
                          <FaRegTrashCan className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-xs text-gray-500 mt-2 sm:hidden">
              Scroll horizontally to view full table →
            </div>
          </div>
        </main>
      </div>

      {/* Category Modal */}
      <dialog ref={dialogRef} className="modal backdrop-blur-xs">
        <div className="modal-box w-full max-w-4xl max-h-[90vh] p-0 shadow-2xl rounded-2xl overflow-hidden flex flex-col">
          <div className="bg-green-800 p-6 text-white flex-shrink-0">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-10 text-white hover:bg-white hover:bg-opacity-20"
              onClick={handleClose}
            >
              <FaTimes />
            </button>
            <h1 className="text-2xl font-bold">
              {selectedCategory ? "Edit Category" : "Create Category"}
            </h1>
            <p className="text-green-100 mt-1">
              Fill up necessary information below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="categoryName">
                    Category Name
                  </label>
                  <input
                    id="categoryName"
                    placeholder="Enter category name"
                    className="w-full border rounded-md p-2"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col justify-end sm:flex-row gap-2 pt-4 border-t mt-4">
                <button
                  className="bg-green-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  type="submit"
                >
                  <FaSave className="h-4 w-4 mr-2" />
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default Categories;