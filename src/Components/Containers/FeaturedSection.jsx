import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Download, Eye, Calendar, ArrowRight, FileText, User, Star } from "lucide-react";
import axios from "axios";

const DEFAULT_COVER = "https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?w=1200&q=60";

const FeaturedSection = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch resources from API
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_SERVER}/resources`);
        setResources(response.data);
      } catch (err) {
        console.error("Error fetching resources:", err);
        setError("Failed to load resources. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Safe getters for API data structure
  const getCategory = (r) => r.category || "Uncategorized";
  const getUploaderName = (r) => r.uploaderName || "Unknown";
  const getFileUrl = (r) => r.fileUrl || "#";
  const getStatus = (r) => r.status || "PENDING";
  
  // Get cover image - use document preview for approved resources
  const getCoverImage = (r) => {
    // For approved resources, use document-specific preview images
    if (getStatus(r) === "APPROVED") {
      const fileType = inferFileType(r);
      
      // For PDFs, use PDF preview image
      if (fileType === "pdf") {
        return "https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?w=600&h=300&fit=crop&q=80";
      }
      
      // For Word documents, use Word document preview image
      if (fileType === "docx" || fileType === "doc") {
        return "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&h=300&fit=crop&q=80";
      }
      
      // For ZIP files, use archive preview image
      if (fileType === "zip") {
        return "https://images.unsplash.com/photo-1616400619175-5beda1a0a652?w=600&h=300&fit=crop&q=80";
      }
    }
    
    // Fallback to default cover
    return DEFAULT_COVER;
  };

  const getCreatedAt = (r) => r.createdAt || null;
  const getDownloads = (r) => r.downloadCount || 0;
  const getViews = (r) => r.viewCount || 0;
  const getRating = (r) => r.rating || "—";

  // Infer file type from URL
  const inferFileType = (r) => {
    const url = getFileUrl(r);
    try {
      const ext = url.split('?')[0].split('.').pop().toLowerCase();
      if (["pdf", "docx", "zip", "pptx", "ppt", "xls", "xlsx"].includes(ext)) return ext;
    } catch (e) {
      console.log(e);
    }
    return "file";
  };

  const getFileTypeDisplay = (type) => {
    switch (type) {
      case "pdf":
        return "PDF";
      case "docx":
      case "doc":
        return "Word";
      case "zip":
        return "ZIP";
      case "ppt":
      case "pptx":
        return "PPT";
      case "xls":
      case "xlsx":
        return "Spreadsheet";
      default:
        return "File";
    }
  };

  const getFileColor = (type) => {
    switch (type) {
      case "pdf":
        return "text-red-500";
      case "docx":
      case "doc":
        return "text-blue-500";
      case "zip":
        return "text-yellow-500";
      case "ppt":
      case "pptx":
        return "text-orange-500";
      default:
        return "text-gray-500";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "Unknown date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatNumber = (num) => {
    if (num == null) return "0";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return String(num);
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return { bg: "bg-green-100", text: "text-green-800", label: "Approved" };
      case "PENDING":
        return { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" };
      case "REJECTED":
        return { bg: "bg-red-100", text: "text-red-800", label: "Rejected" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-800", label: status };
    }
  };

  // Filter only approved resources and get top 6
  const approvedResources = resources
    .filter(r => getStatus(r) === "APPROVED")
    // Sort by downloads (or change to your preferred criteria)
    .sort((a, b) => getDownloads(b) - getDownloads(a))
    // Take only top 6
    .slice(0, 6);
  
  // Extract categories from approved resources
  const categories = [
    "All",
    ...Array.from(new Set(approvedResources.map((r) => getCategory(r)))),
  ];

  // Filter by active category
  const filteredResources =
    activeCategory === "All"
      ? approvedResources
      : approvedResources.filter((r) => getCategory(r) === activeCategory);

  // Loading state
  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-slate-800">Loading Resources...</h2>
            <p className="text-slate-600 mt-2">Please wait while we fetch the latest resources</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Unable to Load Resources</h2>
            <p className="text-slate-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-[archivo] mb-4">
            Featured Resources
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover top approved academic resources shared by the CSE community
          </p>
        </div>

        {/* Categories Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === category
                    ? "bg-slate-800 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredResources.map((resource) => {
            const fileType = inferFileType(resource);
            const fileTypeDisplay = getFileTypeDisplay(fileType);
            const fileColor = getFileColor(fileType);
            const cover = getCoverImage(resource);
            const createdAt = getCreatedAt(resource);
            const status = getStatus(resource);
            const statusBadge = getStatusBadge(status);

            return (
              <div
                key={resource.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
              >
                {/* Cover Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={cover}
                    alt={resource.title}
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_COVER;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* File Type Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                      <FileText size={12} className={`mr-1 ${fileColor}`} />
                      {fileTypeDisplay}
                    </span>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`${statusBadge.bg} ${statusBadge.text} text-xs font-medium px-2 py-1 rounded-full`}>
                      {statusBadge.label}
                    </span>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-slate-800/90 text-white text-xs font-medium px-2 py-1 rounded-full">
                      {getCategory(resource)}
                    </span>
                  </div>
                  
                  {/* Gradient Overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* Resource Content */}
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-slate-700 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {resource.description || "No description provided."}
                  </p>

                  {/* Meta Information */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 mb-4 space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center" title="Downloads">
                        <Download size={16} className="mr-1" />
                        <span>{formatNumber(getDownloads(resource))}</span>
                      </div>
                      <div className="flex items-center" title="Views">
                        <Eye size={16} className="mr-1" />
                        <span>{formatNumber(getViews(resource))}</span>
                      </div>
                      <div className="flex items-center" title="Rating">
                        <Star size={16} className="mr-1 text-yellow-400 fill-yellow-400" />
                        <span>{getRating(resource)}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-xs">
                      <Calendar size={14} className="mr-1" />
                      {formatDate(createdAt)}
                    </div>
                  </div>

                  {/* Uploader Information */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <User size={16} className="mr-2" />
                      <span>By: {getUploaderName(resource)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between mt-4">
                    <a
                      href={getFileUrl(resource)}
                      download
                      className="flex items-center bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 group/download"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Download size={16} className="mr-2" />
                      Download
                    </a>
                    <Link
                      to={`/resource/${resource.id}`}
                      className="flex items-center text-slate-800 hover:text-slate-600 font-medium text-sm group/link"
                    >
                      View Details
                      <ArrowRight size={16} className="ml-1 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <FileText size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {approvedResources.length === 0 
                ? "No approved resources available" 
                : "No resources found in this category"
              }
            </h3>
            <p className="text-gray-500">
              {approvedResources.length === 0 
                ? "Check back later for approved resources" 
                : "Try selecting a different category"
              }
            </p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/resources"
            className="inline-flex items-center px-6 py-3 border border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white rounded-md font-medium transition-all duration-200 group"
          >
            View All Resources
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Info Notice */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Showing {filteredResources.length} of {approvedResources.length} featured resources
            {/* {resources.length > approvedResources.length && 
              ` • ${resources.length - approvedResources.length} pending approval`
            } */}
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;