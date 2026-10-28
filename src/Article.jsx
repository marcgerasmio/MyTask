import Sidebar from "./components/Sidebar";
import { useState, useEffect } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { CiMemoPad } from "react-icons/ci";
import { FiTrash2, FiRefreshCw, FiLink, FiExternalLink } from "react-icons/fi";

const CONFIG_KEY = "wp_extractor_config"; // stores only the endpoint URL, not post data

const WordPressExtractor = () => {
  const [webAppUrl, setWebAppUrl] = useState("");
  const [sheetUrl, setSheetUrl] = useState("");
  const [editingConfig, setEditingConfig] = useState(true);

  const [url, setUrl] = useState("https://www.carsu.edu.ph");
  const [yearFrom, setYearFrom] = useState(new Date().getFullYear());
  const [yearTo, setYearTo] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [syncingId, setSyncingId] = useState(null);
  const [status, setStatus] = useState("");
  const [datasets, setDatasets] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [datasetToDelete, setDatasetToDelete] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CONFIG_KEY);
      if (raw) {
        const cfg = JSON.parse(raw);
        setWebAppUrl(cfg.webAppUrl || "");
        setSheetUrl(cfg.sheetUrl || "");
        if (cfg.webAppUrl) setEditingConfig(false);
      }
    } catch (error) {
      console.error("Error loading config:", error);
    }
  }, []);

  useEffect(() => {
    if (webAppUrl && !editingConfig) loadDatasets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingConfig]);

  const saveConfig = () => {
    if (!webAppUrl) {
      setStatus("Please paste the Apps Script Web App URL");
      return;
    }
    localStorage.setItem(CONFIG_KEY, JSON.stringify({ webAppUrl, sheetUrl }));
    setEditingConfig(false);
    setStatus("Connected to your Google Sheet.");
  };

  // --- month-year helpers ---
  // "2026-03" style key used for the dataset id / sheet tab name
  const monthKeyOf = (dateString) => new Date(dateString).toISOString().slice(0, 7);

  // "March 2026" style label used for display
  // Falls back gracefully for legacy datasets saved before month-based tabs
  // (those have yearFrom/yearTo instead of monthKey).
  const monthLabelOf = (monthKey, dataset) => {
    if (!monthKey || typeof monthKey !== "string" || !monthKey.includes("-")) {
      if (dataset?.yearFrom) {
        return dataset.yearFrom === dataset.yearTo
          ? `${dataset.yearFrom} (legacy)`
          : `${dataset.yearFrom}-${dataset.yearTo} (legacy)`;
      }
      return "Unknown";
    }
    const [y, m] = monthKey.split("-").map(Number);
    if (!y || !m) return "Unknown";
    return new Date(y, m - 1, 1).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
  };

  const domainOf = (cleanUrl) =>
    cleanUrl.replace(/^https?:\/\//, "").replace(/[:\\/?*\[\]]/g, "-");

  const sheetNameFor = (cleanUrl, monthKey) =>
    `${domainOf(cleanUrl)}_${monthKey}`.substring(0, 31);

  // splits a flat posts array into { "2026-03": [...], "2026-04": [...] }
  const groupPostsByMonth = (posts) => {
    const groups = {};
    posts.forEach((post) => {
      const key = monthKeyOf(post.date);
      (groups[key] ||= []).push(post);
    });
    return groups;
  };

  // --- talking to the Apps Script web app ---
  const loadDatasets = async () => {
    if (!webAppUrl) return;
    try {
      const res = await fetch(`${webAppUrl}?action=list`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      // newest month first
      const sorted = [...(data.datasets || [])].sort((a, b) =>
        (b.monthKey || "").localeCompare(a.monthKey || "")
      );
      setDatasets(sorted);
    } catch (error) {
      setStatus(`Error loading datasets: ${error.message}`);
    }
  };

  const saveDatasetToSheet = async (dataset) => {
    const res = await fetch(webAppUrl, {
      method: "POST",
      // text/plain avoids a CORS preflight that Apps Script doesn't handle well
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "saveDataset", dataset }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data;
  };

  const deleteDatasetFromSheet = async (id) => {
    const res = await fetch(webAppUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "deleteDataset", id }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data;
  };

  // --- fetching from the WordPress API ---
  function getYearRange(startYear, endYear) {
    const lo = Math.min(startYear, endYear);
    const hi = Math.max(startYear, endYear);
    const start = new Date(lo, 0, 1, 0, 0, 0);
    const end = new Date(hi, 11, 31, 23, 59, 59);
    return { start: start.toISOString(), end: end.toISOString() };
  }

  const stripHtml = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const fetchAllPosts = async (baseUrl, start, end) => {
    let allPosts = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        const response = await fetch(
          `${baseUrl}/wp-json/wp/v2/posts?per_page=100&page=${page}&after=${start}&before=${end}&_embed`
        );
        if (!response.ok) {
          if (response.status === 400) {
            hasMore = false;
            break;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.length === 0) {
          hasMore = false;
        } else {
          allPosts = [...allPosts, ...data];
          setStatus(`Fetched ${allPosts.length} posts...`);
          page++;
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        hasMore = false;
      }
    }

    return allPosts
      .map((post) => ({
        title: stripHtml(post.title.rendered),
        content: stripHtml(post.content.rendered),
        date: post.date,
        link: post.link,
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // --- extract / sync / delete ---
  const handleExtract = async () => {
    if (!webAppUrl) {
      setStatus("Connect a Google Sheet first.");
      return;
    }
    if (!url) {
      setStatus("Please enter a WordPress site URL");
      return;
    }
    if (yearFrom > yearTo) {
      setStatus("'From' year cannot be after 'To' year");
      return;
    }

    setLoading(true);
    setStatus("Fetching posts...");

    try {
      let cleanUrl = url.trim();
      if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
        cleanUrl = "https://" + cleanUrl;
      }
      cleanUrl = cleanUrl.replace(/\/$/, "");

      const { start, end } = getYearRange(yearFrom, yearTo);
      const posts = await fetchAllPosts(cleanUrl, start, end);

      if (posts.length === 0) {
        setStatus(`No posts found for ${yearFrom === yearTo ? yearFrom : `${yearFrom}-${yearTo}`}.`);
        setLoading(false);
        return;
      }

      const grouped = groupPostsByMonth(posts);
      const monthKeys = Object.keys(grouped).sort();

      let savedCount = 0;
      for (const monthKey of monthKeys) {
        const monthPosts = grouped[monthKey];
        const id = sheetNameFor(cleanUrl, monthKey);
        setStatus(`Saving ${monthPosts.length} posts for ${monthLabelOf(monthKey)}...`);
        await saveDatasetToSheet({
          id,
          url: cleanUrl,
          monthKey,
          posts: monthPosts,
          lastSynced: new Date().toISOString(),
        });
        savedCount += monthPosts.length;
      }

      await loadDatasets();
      setStatus(`Saved ${savedCount} posts across ${monthKeys.length} month(s) to your Google Sheet.`);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (dataset) => {
    setSyncingId(dataset.id);
    setStatus(`Syncing ${dataset.url} (${monthLabelOf(dataset.monthKey, dataset)})...`);

    try {
      let start, end;

      if (dataset.monthKey && dataset.monthKey.includes("-")) {
        // month-based dataset: re-fetch just that month window
        const [y, m] = dataset.monthKey.split("-").map(Number);
        start = new Date(y, m - 1, 1, 0, 0, 0).toISOString();
        end = new Date(y, m, 0, 23, 59, 59).toISOString(); // last day of that month
      } else if (dataset.yearFrom) {
        // legacy year-range dataset: fall back to its original range
        ({ start, end } = getYearRange(dataset.yearFrom, dataset.yearTo));
      } else {
        throw new Error("This dataset is missing both monthKey and year info — cannot sync.");
      }

      const posts = await fetchAllPosts(dataset.url, start, end);
      const record = { ...dataset, posts, lastSynced: new Date().toISOString() };

      await saveDatasetToSheet(record);
      await loadDatasets();
      setStatus(`Synced ${posts.length} posts into your Google Sheet.`);
    } catch (error) {
      setStatus(`Error syncing: ${error.message}`);
      console.error(error);
    } finally {
      setSyncingId(null);
    }
  };

  const handleDeleteClick = (dataset) => {
    setDatasetToDelete(dataset);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!datasetToDelete) return;
    try {
      await deleteDatasetFromSheet(datasetToDelete.id);
      await loadDatasets();
    } catch (error) {
      setStatus(`Error deleting: ${error.message}`);
    }
    setShowDeleteModal(false);
    setDatasetToDelete(null);
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let y = currentYear; y >= currentYear - 6; y--) yearOptions.push(y);

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 pt-20 sm:p-6 lg:pt-6 lg:ml-64">
       <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
  <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold">
    Article Repository 
    <span className="block font-normal text-sm sm:text-base text-gray-600">
      Stored in a shared Google Sheet — anyone with the link can view it
    </span>
  </h1>

  <div className="flex gap-2">
    {/* Repository Button */}
    <a
      href="https://docs.google.com/spreadsheets/d/1YqeXBGXCoFAOoaIVdgXw_60l8CS396m1EYUEG3_gP60/edit?gid=1315364513#gid=1315364513"
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-sm btn-outline"
    >
      <FiExternalLink className="mr-2 h-4 w-4" />
      Repository
    </a>
  </div>
</div>

          {/* Connection card */}
          <div className="bg-white mt-6 p-4 sm:p-6 rounded-md shadow-md">
            {editingConfig ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Apps Script Web App URL
                  </label>
                  <input
                    type="text"
                    value={webAppUrl}
                    onChange={(e) => setWebAppUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/XXXX/exec"
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Google Sheet Link (optional, for "Open Sheet")
                  </label>
                  <input
                    type="text"
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/XXXX/edit"
                    className="input input-bordered w-full"
                  />
                </div>
                <button
                  className="bg-green-900 text-white btn btn-sm rounded-lg"
                  onClick={saveConfig}
                >
                  <FiLink className="h-4 w-4 mr-2" />
                  Connect
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <FiLink className="h-4 w-4 text-green-700" />
                  <span className="font-semibold">Connected to Google Sheet</span>
                </div>
                <div className="flex gap-2">
                  {sheetUrl && (
                    <a
                      href={sheetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-ghost text-blue-600"
                    >
                      <FiExternalLink className="h-4 w-4 mr-1" />
                      Open Sheet
                    </a>
                  )}
                  <button className="btn btn-sm btn-ghost" onClick={() => setEditingConfig(true)}>
                    Change
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Extract controls */}
          {!editingConfig && (
            <div className="bg-white mt-6 p-4 sm:p-6 rounded-md shadow-md">
              <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Site URL</label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://www.carsu.edu.ph"
                    className="input input-bordered w-full"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">From Year</label>
                  <select
                    className="select select-bordered w-25"
                    onChange={(e) => setYearFrom(parseInt(e.target.value))}
                    value={yearFrom}
                    disabled={loading}
                  >
                    {yearOptions.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">To Year</label>
                  <select
                    className="select select-bordered w-25"
                    onChange={(e) => setYearTo(parseInt(e.target.value))}
                    value={yearTo}
                    disabled={loading}
                  >
                    {yearOptions.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <button
                  className="bg-green-900 text-white btn rounded-lg"
                  onClick={handleExtract}
                  disabled={loading || !url}
                >
                  <IoIosAddCircle className="h-4 w-4 mr-2" />
                  {loading ? "Extracting..." : "Extract & Save"}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Posts are automatically split into one sheet tab per month (e.g. "domain_2026-03").
              </p>

              {status && (
                <div
                  className={`mt-4 p-3 rounded-lg text-sm ${
                    status.includes("Error")
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : status.includes("Saved") || status.includes("Synced") || status.includes("Connected")
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}
                >
                  {status}
                </div>
              )}
            </div>
          )}

          {/* Datasets table */}
          {!editingConfig && (
            <>
              <div className="flex justify-between items-center mt-8 mb-2">
                <h2 className="text-base sm:text-lg font-bold">Datasets in Sheet</h2>
                <button className="btn btn-sm btn-ghost" onClick={loadDatasets} title="Refresh list">
                  <FiRefreshCw className="h-4 w-4" />
                </button>
              </div>

              {datasets.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-md shadow-md">
                  <div className="flex justify-center mb-4">
                    <CiMemoPad className="h-16 w-16 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No datasets yet. Extract a site above to save one.
                  </h3>
                </div>
              ) : (
                <div className="overflow-x-auto p-6 bg-white rounded-md shadow-md overflow-y-auto h-[50vh]">
                  <table className="table table-sm">
                    <thead>
                      <tr className="text-x1 text-black sm:text-sm">
                        <th>Site URL</th>
                        <th>Month</th>
                        <th>Posts</th>
                        <th>Last Synced</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {datasets.map((dataset) => (
                        <tr key={dataset.id}>
                          <td className="text-sm">{dataset.url}</td>
                          <td className="text-sm">{monthLabelOf(dataset.monthKey, dataset)}</td>
                          <td className="text-sm">{dataset.postCount}</td>
                          <td className="text-sm">
                            {dataset.lastSynced ? new Date(dataset.lastSynced).toLocaleString() : "—"}
                          </td>
                          <td>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSync(dataset)}
                                className="btn btn-sm btn-ghost text-blue-600 hover:bg-blue-50"
                                title="Sync/update from the API"
                                disabled={syncingId === dataset.id}
                              >
                                <FiRefreshCw
                                  className={`h-4 w-4 ${syncingId === dataset.id ? "animate-spin" : ""}`}
                                />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(dataset)}
                                className="btn btn-sm btn-ghost text-red-600 hover:bg-red-50"
                                title="Remove this dataset from the sheet"
                              >
                                <FiTrash2 className="h-4 w-4" />
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
              )}
            </>
          )}
        </main>
      </div>

      {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Delete</h3>
            <p className="py-4">
              Remove "{datasetToDelete?.url}" (
              {datasetToDelete && monthLabelOf(datasetToDelete.monthKey, datasetToDelete)}
              ) from the Google Sheet? This deletes its tab from the sheet — the live site is unaffected.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDatasetToDelete(null);
                }}
              >
                Cancel
              </button>
              <button className="btn btn-error" onClick={handleDeleteConfirm}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WordPressExtractor;