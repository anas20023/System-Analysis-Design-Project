import { useState } from "react";
import { Link } from "react-router-dom";
import { Download, Eye, Calendar, ArrowRight, FileText, User, Star } from "lucide-react";
import resources from "../../data/resources"; 

const FeaturedSection = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  // Extract unique categories from resources
  const categories = [
    "All",
    ...Array.from(new Set(resources.map(resource => resource.category)))
  ];

  // Get file type display text
  const getFileType = (fileType) => {
    switch(fileType) {
      case 'pdf': return 'PDF Document';
      case 'docx': return 'Word Document';
      case 'zip': return 'ZIP Archive';
      default: return 'File';
    }
  };

  // Get file icon color
  const getFileColor = (fileType) => {
    switch(fileType) {
      case 'pdf': return 'text-red-500';
      case 'docx': return 'text-blue-500';
      case 'zip': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format large numbers
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  // Filter resources based on active category
  const filteredResources = activeCategory === "All" 
    ? resources 
    : resources.filter(resource => resource.category === activeCategory);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-[archivo] mb-4">
            Featured Resources
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover valuable academic resources shared by the CSE community
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

        {/* Featured Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredResources.map((resource) => {
            const fileType = getFileType(resource.file_type);
            const fileColor = getFileColor(resource.file_type);
            
            return (
              <div
                key={resource.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
              >
                {/* Cover Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={resource.cover_image}
                    alt={resource.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* File Type Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                      <FileText size={12} className={`mr-1 ${fileColor}`} />
                      {fileType}
                    </span>
                  </div>
                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
                      <Star size={12} className="mr-1 fill-yellow-400 text-yellow-400" />
                      {resource.rating}
                    </span>
                  </div>
                  {/* Category Badge */}
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-slate-800/90 text-white text-xs font-medium px-2 py-1 rounded-full">
                      {resource.category}
                    </span>
                  </div>
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>

                {/* Resource Content */}
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-slate-700 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {resource.description}
                  </p>

                  {/* Meta Information */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 mb-4 space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center" title="Downloads">
                        <Download size={16} className="mr-1" />
                        <span>{formatNumber(resource.downloads)}</span>
                      </div>
                      <div className="flex items-center" title="Views">
                        <Eye size={16} className="mr-1" />
                        <span>{formatNumber(resource.views)}</span>
                      </div>
                      <div className="flex items-center" title="Rating">
                        <Star size={16} className="mr-1 text-yellow-400 fill-yellow-400" />
                        <span>{resource.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-xs">
                      <Calendar size={14} className="mr-1" />
                      {formatDate(resource.created_at)}
                    </div>
                  </div>

                  {/* Uploader Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <User size={16} className="mr-2" />
                      <span>Uploader ID: {resource.uploader_id}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between mt-4">
                    <a
                      href={resource.file_url}
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
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No resources found</h3>
            <p className="text-gray-500">Try selecting a different category</p>
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
      </div>
    </section>
  );
};

export default FeaturedSection;