/* eslint-disable no-unused-vars */
// pages/Upload.js
import { useState } from "react";
import { Upload as UploadIcon, FileText, X, Cloud, CheckCircle } from "lucide-react";
import Button from "../../../components/button";

const Upload = ({ setNotification }) => {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        tags: ""
    });

    const categories = [
        "Lecture Notes",
        "Assignments",
        "Research Papers",
        "Projects",
        "Tutorials",
        "Cheat Sheets",
        "Lab Manuals",
        "Exam Prep"
    ];

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const validFiles = selectedFiles.filter(file =>
            file.type === "application/pdf" ||
            file.type.includes("word") ||
            file.type.includes("zip") ||
            file.name.endsWith('.docx')
        );

        if (validFiles.length !== selectedFiles.length) {
            setNotification({
                type: "error",
                title: "Invalid File Type",
                message: "Only PDF, DOCX, and ZIP files are allowed.",
                duration: 3000,
            });
        }

        setFiles(prev => [...prev, ...validFiles]);
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (files.length === 0) {
            setNotification({
                type: "error",
                title: "No Files Selected",
                message: "Please select at least one file to upload.",
                duration: 3000,
            });
            return;
        }

        if (!formData.title || !formData.category) {
            setNotification({
                type: "error",
                title: "Missing Information",
                message: "Please provide a title and category for your upload.",
                duration: 3000,
            });
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        // Simulate upload progress
        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            clearInterval(progressInterval);
            setUploadProgress(100);

            setNotification({
                type: "success",
                title: "Upload Successful!",
                message: `Successfully uploaded ${files.length} file(s).`,
                duration: 5000,
            });

            // Reset form
            setFiles([]);
            setFormData({
                title: "",
                description: "",
                category: "",
                tags: ""
            });

            setTimeout(() => setUploadProgress(0), 1000);
        } catch (error) {
            setNotification({
                type: "error",
                title: "Upload Failed",
                message: "There was an error uploading your files. Please try again.",
                duration: 5000,
            });
        } finally {
            setUploading(false);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 font-[archivo] mb-4">
                        Upload Resources
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Share your knowledge with the community by uploading study materials,
                        projects, and resources.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Progress Bar */}
                    {uploading && (
                        <div className="bg-slate-800 p-4">
                            <div className="flex items-center justify-between text-white mb-2">
                                <span className="text-sm font-medium">Uploading...</span>
                                <span className="text-sm">{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-slate-600 rounded-full h-2">
                                <div
                                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-8">
                        {/* File Upload Area */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-slate-700 mb-4">
                                Select Files *
                            </label>

                            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-slate-400 transition-colors duration-200">
                                <Cloud size={48} className="mx-auto text-slate-400 mb-4" />
                                <p className="text-lg font-medium text-slate-700 mb-2">
                                    Drop your files here or click to browse
                                </p>
                                <p className="text-slate-500 text-sm mb-4">
                                    Supported formats: PDF, DOCX, ZIP (Max 100MB per file)
                                </p>

                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileSelect}
                                    accept=".pdf,.docx,.zip"
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="flex items-center mx-auto"
                                    >
                                        <UploadIcon size={18} className="mr-2" />
                                        Choose Files
                                    </Button>
                                </label>
                            </div>

                            {/* Selected Files List */}
                            {files.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="font-medium text-slate-700 mb-3">Selected Files:</h4>
                                    <div className="space-y-2">
                                        {files.map((file, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                                            >
                                                <div className="flex items-center">
                                                    <FileText size={20} className="text-slate-500 mr-3" />
                                                    <div>
                                                        <p className="font-medium text-slate-800">{file.name}</p>
                                                        <p className="text-sm text-slate-500">
                                                            {formatFileSize(file.size)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(index)}
                                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="md:col-span-2">
                                <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                                    Resource Title *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter a descriptive title for your resource"
                                />
                            </div>

                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
                                    Category *
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all duration-200"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="tags" className="block text-sm font-medium text-slate-700 mb-2">
                                    Tags
                                </label>
                                <input
                                    type="text"
                                    id="tags"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all duration-200"
                                    placeholder="e.g., algorithms, web-dev, database"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all duration-200 resize-none"
                                    placeholder="Describe your resource in detail..."
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-slate-500">
                                {files.length} file(s) selected • {files.reduce((acc, file) => acc + file.size, 0) > 0 ?
                                    formatFileSize(files.reduce((acc, file) => acc + file.size, 0)) : '0 Bytes'}
                            </div>

                            <Button
                                type="submit"
                                disabled={uploading}
                                className="flex items-center bg-slate-800 hover:bg-slate-700 text-white px-8 py-3"
                            >
                                {uploading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <UploadIcon size={18} className="mr-2" />
                                        Upload Resources
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Upload Guidelines */}
                <div className="mt-8 bg-blue-50 rounded-2xl p-6">
                    <h3 className="font-bold text-blue-900 mb-4 flex items-center">
                        <CheckCircle size={20} className="mr-2" />
                        Upload Guidelines
                    </h3>
                    <ul className="text-blue-800 text-sm space-y-2">
                        <li>• Ensure you have the rights to share the content</li>
                        <li>• Provide clear and descriptive titles and descriptions</li>
                        <li>• Use appropriate categories and tags for better discoverability</li>
                        <li>• Maximum file size: 100MB per file</li>
                        <li>• Supported formats: PDF, DOCX, ZIP</li>
                        <li>• Do not upload copyrighted material without permission</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Upload;