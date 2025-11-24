import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Filter, Download, Eye, Calendar, User, CheckCircle, XCircle, Clock, MoreVertical, FileText, RefreshCw } from "lucide-react";

const ResourceManage = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState(null);

  const url = import.meta.env.VITE_SERVER;

  // Fetch resources from admin endpoint
  const fetchResources = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${url}/resources/admin`);
      setResources(response.data);
      setFilteredResources(response.data);
    } catch (err) {
      console.error("Error fetching resources:", err);
      setError("Failed to load resources. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Update resource status using separate PUT endpoints
  const updateResourceStatus = async (resourceId, newStatus) => {
    try {
      setUpdatingId(resourceId);
      
      let endpoint = "";
      switch (newStatus) {
        case "APPROVED":
          endpoint = `${url}/resources/${resourceId}/approve`;
          break;
        case "PENDING":
          endpoint = `${url}/resources/${resourceId}/pending`;
          break;
        case "DECLINED":
          endpoint = `${url}/resources/${resourceId}/decline`;
          break;
        default:
          throw new Error("Invalid status");
      }

      // Make PUT request to the specific endpoint
      await axios.put(endpoint);
      
      // Update local state
      setResources(prev => prev.map(resource => 
        resource.id === resourceId 
          ? { 
              ...resource, 
              status: newStatus, 
              approvedAt: newStatus === "APPROVED" ? new Date().toISOString() : resource.approvedAt 
            }
          : resource
      ));
      
    } catch (err) {
      console.error("Error updating resource status:", err);
      setError("Failed to update resource status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter resources based on search and status
  useEffect(() => {
    let result = resources;

    // Filter by status
    if (statusFilter !== "ALL") {
      result = result.filter(resource => resource.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(resource => 
        resource.title?.toLowerCase().includes(query) ||
        resource.description?.toLowerCase().includes(query) ||
        resource.uploader?.toLowerCase().includes(query)
      );
    }

    setFilteredResources(result);
  }, [resources, searchQuery, statusFilter]);

  useEffect(() => {
    fetchResources();
  }, []);

  // Get status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return { 
          bg: "bg-green-100", 
          text: "text-green-800", 
          border: "border-green-200",
          icon: CheckCircle,
          label: "Approved" 
        };
      case "PENDING":
        return { 
          bg: "bg-yellow-100", 
          text: "text-yellow-800", 
          border: "border-yellow-200",
          icon: Clock,
          label: "Pending" 
        };
      case "DECLINED":
        return { 
          bg: "bg-red-100", 
          text: "text-red-800", 
          border: "border-red-200",
          icon: XCircle,
          label: "Declined" 
        };
      default:
        return { 
          bg: "bg-gray-100", 
          text: "text-gray-800", 
          border: "border-gray-200",
          icon: Clock,
          label: status 
        };
    }
  };

  // Get file type from URL
  const getFileType = (fileUrl) => {
    if (!fileUrl) return "file";
    const ext = fileUrl.split('.').pop()?.toLowerCase();
    if (["pdf", "docx", "doc", "zip", "pptx", "ppt", "xls", "xlsx"].includes(ext)) return ext;
    return "file";
  };

  const getFileTypeDisplay = (type) => {
    switch (type) {
      case "pdf": return "PDF";
      case "docx": case "doc": return "Word";
      case "zip": return "ZIP";
      case "ppt": case "pptx": return "PPT";
      case "xls": case "xlsx": return "Excel";
      default: return "File";
    }
  };

  const getFileColor = (type) => {
    switch (type) {
      case "pdf": return "text-red-500";
      case "docx": case "doc": return "text-blue-500";
      case "zip": return "text-yellow-500";
      case "ppt": case "pptx": return "text-orange-500";
      case "xls": case "xlsx": return "text-green-500";
      default: return "text-gray-500";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mb-4"></div>
        <p className="text-gray-600">Loading resources...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Resources</p>
              <p className="text-2xl font-bold text-gray-900">{resources.length}</p>
            </div>
            <FileText className="text-blue-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">
                {resources.filter(r => r.status === "APPROVED").length}
              </p>
            </div>
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {resources.filter(r => r.status === "PENDING").length}
              </p>
            </div>
            <Clock className="text-yellow-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Declined</p>
              <p className="text-2xl font-bold text-red-600">
                {resources.filter(r => r.status === "DECLINED").length}
              </p>
            </div>
            <XCircle className="text-red-500" size={24} />
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources by title, description, or uploader..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-800 focus:border-transparent min-w-[140px]"
              >
                <option value="ALL">All Status</option>
                <option value="APPROVED">Approved</option>
                <option value="PENDING">Pending</option>
                <option value="DECLINED">Declined</option>
              </select>
            </div>

            {/* Refresh Button */}
            <button 
              onClick={fetchResources}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              <RefreshCw size={16} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <XCircle className="text-red-500 mr-2" size={20} />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Resources Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Resources</h3>
          <p className="text-sm text-gray-600">
            {filteredResources.length} of {resources.length} resources
            {searchQuery || statusFilter !== "ALL" ? " (filtered)" : ""}
          </p>
        </div>

        {/* Scrollable Table */}
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resource
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploader
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResources.map((resource) => {
                  const fileType = getFileType(resource.fileUrl);
                  const fileTypeDisplay = getFileTypeDisplay(fileType);
                  const fileColor = getFileColor(fileType);
                  const statusBadge = getStatusBadge(resource.status);
                  const StatusIcon = statusBadge.icon;

                  return (
                    <tr key={resource.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${fileColor} bg-gray-100`}>
                            <FileText size={20} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {resource.title}
                            </p>
                            <p className="text-sm text-gray-500 line-clamp-2">
                              {resource.description || "No description provided"}
                            </p>
                            <div className="flex items-center mt-1">
                              <span className={`text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 flex items-center`}>
                                <FileText size={10} className={`mr-1 ${fileColor}`} />
                                {fileTypeDisplay}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-900">
                          <User size={16} className="mr-2 text-gray-400" />
                          {resource.uploader}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-2 text-gray-400" />
                          {formatDate(resource.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border} border`}>
                          <StatusIcon size={12} className="mr-1" />
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <select
                            value={resource.status}
                            onChange={(e) => updateResourceStatus(resource.id, e.target.value)}
                            disabled={updatingId === resource.id}
                            className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-800 focus:border-transparent disabled:opacity-50 min-w-[120px]"
                          >
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approve</option>
                            <option value="DECLINED">Decline</option>
                          </select>
                          
                          {updatingId === resource.id && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-800"></div>
                          )}
                          
                          <a
                            href={resource.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-slate-700 transition-colors p-1 rounded hover:bg-gray-100"
                            title="Download"
                          >
                            <Download size={16} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No resources found</h3>
            <p className="text-gray-500 mb-4">
              {resources.length === 0 
                ? "No resources available yet" 
                : "Try adjusting your search or filters"
              }
            </p>
            {(searchQuery || statusFilter !== "ALL") && (
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("ALL");
                }}
                className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceManage;