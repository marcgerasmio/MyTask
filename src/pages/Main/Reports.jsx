import { useState, useEffect, useRef } from "react";
import { FaChartBar, FaTasks, FaCheckCircle, FaClock, FaUsers } from "react-icons/fa";
import * as Chart from "chart.js";
import Sidebar from "../../components/Sidebar";
import Supabase from "../../Supabase";

// Register Chart.js components
const { Chart: ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, PieController, LineController, BarController } = Chart;
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement, 
  PointElement, 
  Title,
  PieController,
  LineController,
  BarController
);

const Reports = () => {
  const [taskData, setTaskData] = useState([]);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Chart refs
  const pieChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);
  const pieChartInstance = useRef(null);
  const lineChartInstance = useRef(null);
  const barChartInstance = useRef(null);

  // Fetch data from Supabase - All statuses, filter only by date
  const fetchData = async (start, end) => {
    setLoading(true);
    try {
      const { data } = await Supabase.from("tasks").select(`
        "*",
        userDetails!id ("*")
      `)
      .gte('created_at', start)
      .lte('created_at', end)
      .order('id', { ascending: true });

      setTaskData(data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setTaskData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleTask();
  }, []);

  function GetFirstAndLastDate(year, month) {
    const firstDayOfMonth = new Date(year, month - 1, 2);
    const lastDayOfMonth = new Date(year, month, 1);
    const start = firstDayOfMonth.toISOString();
    const end = lastDayOfMonth.toISOString();
    fetchData(start, end);
  }

  function getCurrentMonthAndYear() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    return { monthNumber: month, year: year };
  }

  function handleTask() {
    const { monthNumber, year } = getCurrentMonthAndYear();
    setMonth(monthNumber);
    setYear(year);
    GetFirstAndLastDate(year, monthNumber);
    setCurrentPage(1);
  }

  // Analytics calculations
  const getStatusCounts = () => {
    const counts = {
      completed: 0,
      pending: 0,
      ongoing: 0,
      tba: 0
    };
    taskData.forEach(task => {
      counts[task.status]++;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();
  const totalTasks = taskData.length;
  const completionRate = totalTasks > 0 ? ((statusCounts.completed / totalTasks) * 100).toFixed(1) : 0;

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTasks = taskData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(taskData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // User performance data
  const getUserPerformance = () => {
    const userMap = {};
    taskData.forEach(task => {
      const userId = task.userDetails.id;
      if (!userMap[userId]) {
        userMap[userId] = {
          name: task.userDetails.first_name,
          total: 0,
          completed: 0
        };
      }
      userMap[userId].total++;
      if (task.status === 'completed') {
        userMap[userId].completed++;
      }
    });
    return Object.values(userMap);
  };

  // Timeline data
  const getTimelineData = () => {
    const days = 7;
    const timeline = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const tasksOnDay = taskData.filter(task => {
        const taskDate = new Date(task.created_at);
        return taskDate.toDateString() === date.toDateString();
      }).length;
      timeline.push({ date: dateStr, tasks: tasksOnDay });
    }
    return timeline;
  };

  // Create/Update Charts
  useEffect(() => {
    if (!loading && taskData.length > 0) {
      // Pie Chart
      if (pieChartRef.current) {
        if (pieChartInstance.current) {
          pieChartInstance.current.destroy();
        }

        const ctx = pieChartRef.current.getContext('2d');
        pieChartInstance.current = new ChartJS(ctx, {
          type: 'pie',
          data: {
            labels: ['Completed', 'Pending', 'Ongoing', 'For Approval'],
            datasets: [{
              data: [statusCounts.completed, statusCounts.pending, statusCounts.ongoing, statusCounts.tba],
              backgroundColor: ['#166534', '#EAB308', '#FB923C', '#3B82F6'],
              borderWidth: 2,
              borderColor: '#fff'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 15,
                  font: { size: 12 }
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.parsed || 0;
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                    return `${label}: ${value} (${percentage}%)`;
                  }
                }
              }
            }
          }
        });
      }

      // Line Chart
      if (lineChartRef.current) {
        if (lineChartInstance.current) {
          lineChartInstance.current.destroy();
        }

        const timelineData = getTimelineData();
        const ctx = lineChartRef.current.getContext('2d');
        lineChartInstance.current = new ChartJS(ctx, {
          type: 'line',
          data: {
            labels: timelineData.map(d => d.date),
            datasets: [{
              label: 'Tasks Created',
              data: timelineData.map(d => d.tasks),
              borderColor: '#3B82F6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.4,
              fill: true,
              pointRadius: 4,
              pointHoverRadius: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'bottom'
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1
                }
              }
            }
          }
        });
      }

      // Bar Chart
      if (barChartRef.current) {
        if (barChartInstance.current) {
          barChartInstance.current.destroy();
        }

        const userPerformance = getUserPerformance();
        const ctx = barChartRef.current.getContext('2d');
        barChartInstance.current = new ChartJS(ctx, {
          type: 'bar',
          data: {
            labels: userPerformance.map(u => u.name),
            datasets: [
              {
                label: 'Total Tasks',
                data: userPerformance.map(u => u.total),
                backgroundColor: '#3B82F6',
                borderRadius: 5
              },
              {
                label: 'Completed Tasks',
                data: userPerformance.map(u => u.completed),
                backgroundColor: '#166534',
                borderRadius: 5
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 15
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1
                }
              }
            }
          }
        });
      }
    }

    return () => {
      if (pieChartInstance.current) pieChartInstance.current.destroy();
      if (lineChartInstance.current) lineChartInstance.current.destroy();
      if (barChartInstance.current) barChartInstance.current.destroy();
    };
  }, [taskData, loading]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-4 pt-20 sm:p-6 lg:pt-6 lg:ml-64">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-6">
          <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold">
            <FaChartBar className="inline mr-2 mb-1" />
            Task Reports & Analytics
            <span className="block font-normal text-sm sm:text-base text-gray-600 mt-1">
              Comprehensive overview of task performance and metrics
            </span>
          </h1>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex gap-2 mt-4 sm:mt-0">
              <select 
                defaultValue="Month"
                className="select"
                onChange={(e) => setMonth(e.target.value)} 
                value={month}
              >
                <option disabled={true}>Month</option>
                <option value={1}>January</option>
                <option value={2}>February</option>
                <option value={3}>March</option>
                <option value={4}>April</option>
                <option value={5}>May</option>
                <option value={6}>June</option>
                <option value={7}>July</option>
                <option value={8}>August</option>
                <option value={9}>September</option>
                <option value={10}>October</option>
                <option value={11}>November</option>
                <option value={12}>December</option>
              </select>
              <select 
                defaultValue="Year"
                className="select w-25"
                onChange={(e) => setYear(e.target.value)} 
                value={year}
              >
                <option disabled={true}>Year</option>
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </select>
              <button 
                className="bg-green-900 text-white btn rounded-lg"
                onClick={() => GetFirstAndLastDate(year, month)}
              >
                Display
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-6 rounded-lg shadow-md hover:shadow-lg transition hover:scale-[1.02] bg-gray-500 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Total Tasks</p>
                <p className="text-3xl font-bold">{totalTasks}</p>
              </div>
              <FaTasks className="text-4xl" />
            </div>
          </div>
          
          <div className="p-6 rounded-lg shadow-md hover:shadow-lg transition hover:scale-[1.02] bg-green-800 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Completed</p>
                <p className="text-3xl font-bold">{statusCounts.completed}</p>
              </div>
              <FaCheckCircle className="text-4xl" />
            </div>
          </div>
          
          <div className="p-6 rounded-lg shadow-md hover:shadow-lg transition hover:scale-[1.02] bg-yellow-500 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Pending</p>
                <p className="text-3xl font-bold">{statusCounts.pending}</p>
              </div>
              <FaClock className="text-4xl" />
            </div>
          </div>
          
          <div className="p-6 rounded-lg shadow-md hover:shadow-lg transition hover:scale-[1.02] bg-orange-400 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Completion Rate</p>
                <p className="text-3xl font-bold">{completionRate}%</p>
              </div>
              <FaUsers className="text-4xl" />
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Task Status Distribution</h2>
            <div className="relative" style={{ height: '300px' }}>
              {loading || taskData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-400">
                  {loading ? 'Loading...' : 'No data available for selected period'}
                </div>
              ) : (
                <canvas ref={pieChartRef}></canvas>
              )}
            </div>
          </div>

          {/* Line Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Task Creation Timeline (Last 7 Days)</h2>
            <div className="relative" style={{ height: '300px' }}>
              {loading || taskData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-400">
                  {loading ? 'Loading...' : 'No data available for selected period'}
                </div>
              ) : (
                <canvas ref={lineChartRef}></canvas>
              )}
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Team Member Performance</h2>
            <div className="relative" style={{ height: '300px' }}>
              {loading || taskData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-400">
                  {loading ? 'Loading...' : 'No data available for selected period'}
                </div>
              ) : (
                <canvas ref={barChartRef}></canvas>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Task Details</h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : taskData.length === 0 ? (
            <div className="text-center py-12">
              <FaTasks className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No tasks found for selected period
              </h3>
              <p className="text-gray-500 text-sm">
                Try selecting a different month or year to view tasks
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{task.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            className="h-8 w-8 rounded-full mr-2" 
                            src={task.userDetails.image} 
                            alt={task.userDetails.first_name}
                          />
                          <span className="text-sm">{task.userDetails.first_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{task.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          task.status === 'completed' ? 'bg-green-100 text-green-800' :
                          task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          task.status === 'ongoing' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {task.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(task.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                  <div className="text-sm text-gray-700">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, taskData.length)} of {taskData.length} tasks
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded ${
                        currentPage === 1
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-green-800 text-white hover:bg-green-900'
                      }`}
                    >
                      Previous
                    </button>
                    
                    {/* Page Numbers */}
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      // Show first page, last page, current page, and pages around current
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`px-3 py-1 rounded ${
                              currentPage === pageNumber
                                ? 'bg-green-800 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return <span key={pageNumber} className="px-2">...</span>;
                      }
                      return null;
                    })}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded ${
                        currentPage === totalPages
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-green-800 text-white hover:bg-green-900'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Reports;