/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react";
import { Upload as UploadIcon, FileText, X, Cloud, CheckCircle } from "lucide-react";
import axios from "axios";
import Button from "../../../components/button";
import { useNavigate } from "react-router-dom";

const Upload = ({ setNotification }) => {
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const [fileProgresses, setFileProgresses] = useState({});
    const [files, setFiles] = useState([]);
    const [categoriesList, setCategoriesList] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        categories: [],
        tags: ""
    });

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const serverBase = import.meta.env.VITE_SERVER;
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);
                const res = await axios.get(`${serverBase}/categories`);
                setCategoriesList(res.data || []);
            } catch (err) {
                console.error("Failed to load categories", err);
                setCategoriesList([
                    { id: "lecture-notes", name: "Lecture Notes" },
                    { id: "assignments", name: "Assignments" },
                    { id: "research", name: "Research Papers" },
                    { id: "projects", name: "Projects" },
                    { id: "tutorials", name: "Tutorials" },
                    { id: "cheat-sheets", name: "Cheat Sheets" },
                ]);
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, [serverBase]);

    const getAuthToken = () => {
        return document.cookie
            .split("; ")
            .find((row) => row.startsWith("authToken="))
            ?.split("=")[1];
    };

    // Try to decode common JWT payloads to extract uploader/user id
    const parseJwt = (token) => {
        try {
            const payload = token.split(".")[1];
            const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
            return JSON.parse(decodeURIComponent(
                decoded.split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join('')
            ));
        } catch (e) {
            return null;
        }
    };

    const getUploaderIdFromToken = () => {
        const token = getAuthToken();
        if (!token) return null;
        const payload = parseJwt(token);
        if (!payload) return null;
        // common claim keys for user id
        return payload.userId || payload.id || payload.sub || payload.uid || null;
    };

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);

        // Filter valid file types
        const validFiles = selectedFiles.filter((file) => {
            const fileExtension = file.name.split('.').pop().toLowerCase();
            const isValidType =
                file.type === "application/pdf" ||
                file.type.includes("word") ||
                file.type.includes("zip") ||
                fileExtension === "pdf" ||
                fileExtension === "docx" ||
                fileExtension === "zip";

            return isValidType && file.size <= 100 * 1024 * 1024; // 100MB limit
        });

        const invalidFiles = selectedFiles.filter(file => !validFiles.includes(file));

        if (invalidFiles.length > 0) {
            setNotification({
                type: "error",
                title: "Invalid Files",
                message: `${invalidFiles.length} file(s) were rejected. Only PDF, DOCX, and ZIP files under 100MB are allowed.`,
                duration: 5000,
            });
        }

        setFiles(prev => [...prev, ...validFiles]);

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0) {
            const event = {
                target: { files: e.dataTransfer.files }
            };
            handleFileSelect(event);
        }
    };

    const removeFile = (index) => {
        if (uploading) return; // prevent removal during upload
        setFiles(prev => prev.filter((_, i) => i !== index));
        setFileProgresses(prev => {
            const copy = { ...prev };
            delete copy[index];
            return copy;
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "categories") {
            const selectedOptions = Array.from(e.target.selectedOptions);
            const selectedValues = selectedOptions.map(option => option.value);
            setFormData(prev => ({ ...prev, categories: selectedValues }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const aggregateProgress = () => {
        const vals = Object.values(fileProgresses);
        if (vals.length === 0) return 0;
        const sum = vals.reduce((a, b) => a + b, 0);
        return Math.round(sum / vals.length);
    };

    const uploadToCloudinary = async (file, index) => {
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
        const fd = new FormData();
        fd.append("file", file);
        fd.append("upload_preset", uploadPreset);

        try {
            const response = await axios.post(url, fd, {
                onUploadProgress: (progressEvent) => {
                    const percent = progressEvent.total ?
                        Math.round((progressEvent.loaded * 100) / progressEvent.total) :
                        Math.round((progressEvent.loaded * 100) / file.size);
                    setFileProgresses(prev => ({ ...prev, [index]: percent }));
                },
                timeout: 300000 // 5 minutes timeout
            });
            return response.data.secure_url;
        } catch (error) {
            console.error(`Failed to upload file ${file.name}:`, error);
            throw new Error(`Failed to upload ${file.name}`);
        }
    };

    // Minimal payload expected by backend: { uploaderId, title, description, fileUrl }
    const createResourceRecord = async ({ title, description, fileUrl, categoryIds = [], tagsArray = [] }) => {
        const uploaderId = getUploaderIdFromToken();

        const payload = {
            // minimal required fields
            uploaderId: uploaderId ?? undefined,
            title,
            description,
            fileUrl,
            // extras (server may ignore)
            categories: categoryIds.length ? categoryIds : undefined,
            tags: tagsArray.length ? tagsArray : undefined,
            status: "pending"
        };

        // remove undefined fields to keep payload minimal
        Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

        const authToken = getAuthToken();

        const headers = {
            "Content-Type": "application/json",
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        };

        try {
            const res = await axios.post(`${serverBase}/resources/upload`, payload, {
            headers,
            withCredentials: true,
            timeout: 30000
            });
            console.log("Resource created successfully:", res.data);
            return res.data;
        } catch (error) {
            console.error("Failed to create resource record:", error.response?.data || error.message);
            throw new Error(error.response?.data?.message || "Failed to create resource record");
        }
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

        if (!formData.title.trim()) {
            setNotification({
                type: "error",
                title: "Missing Title",
                message: "Please provide a title for your resource.",
                duration: 3000,
            });
            return;
        }

        if (formData.categories.length === 0) {
            setNotification({
                type: "error",
                title: "No Categories Selected",
                message: "Please select at least one category.",
                duration: 3000,
            });
            return;
        }

        if (!cloudName || !uploadPreset) {
            setNotification({
                type: "error",
                title: "Upload Service Unavailable",
                message: "Upload service is not configured. Please try again later.",
                duration: 5000,
            });
            return;
        }

        setUploading(true);
        setFileProgresses({});

        try {
            // Upload files to Cloudinary (parallel)
            const uploadPromises = files.map((file, idx) => uploadToCloudinary(file, idx));
            const uploadedUrls = await Promise.all(uploadPromises);

            // Create resource records (serial to make notifications/errors clearer)
            const tagsArray = formData.tags
                .split(",")
                .map(t => t.trim())
                .filter(Boolean);

            const createdResources = [];
            for (let i = 0; i < uploadedUrls.length; i++) {
                const fileUrl = uploadedUrls[i];

                const created = await createResourceRecord({
                    title: formData.title,
                    description: formData.description,
                    fileUrl,
                    categoryIds: formData.categories,
                    tagsArray
                });

                createdResources.push(created);
                setFileProgresses(prev => ({ ...prev, [i]: 100 }));
            }

            setNotification({
                type: "success",
                title: "Upload Complete!",
                message: `Successfully uploaded ${createdResources.length} resource(s).`,
                duration: 5000,
            });

            // Reset form
            setFiles([]);
            setFormData({
                title: "",
                description: "",
                categories: [],
                tags: ""
            });
            setFileProgresses({});
            navigate("/");

        } catch (err) {
            console.error("Upload failed:", err);
            setNotification({
                type: "error",
                title: "Upload Failed",
                message: err?.response?.data?.message || err.message || "There was an error uploading your files. Please try again.",
                duration: 6000,
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

    const getCategoryName = (categoryId) => {
        const category = categoriesList.find(cat => cat.id === categoryId || cat.name === categoryId);
        return category?.name || categoryId;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-4 sm:py-8 px-3 sm:px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 font-[archivo] mb-3 sm:mb-4">
                        Upload Resources
                    </h1>
                    <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-2">
                        Share your knowledge with the community by uploading study materials, projects, and resources.
                    </p>
                </div>

                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
                    {/* Progress Bar */}
                    {uploading && (
                        <div className="bg-slate-800 p-3 sm:p-4">
                            <div className="flex items-center justify-between text-white mb-2">
                                <span className="text-sm font-medium">Uploading Resources...</span>
                                <span className="text-sm font-medium">{aggregateProgress()}%</span>
                            </div>
                            <div className="w-full bg-slate-600 rounded-full h-2">
                                <div
                                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${aggregateProgress()}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8">
                        {/* File Upload Area */}
                        <div className="mb-6 sm:mb-8">
                            <label className="block text-sm font-medium text-slate-700 mb-3 sm:mb-4">
                                Select Files *
                            </label>

                            <div
                                className="border-2 border-dashed border-slate-300 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-center hover:border-slate-400 transition-colors duration-200 cursor-pointer"
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Cloud size={40} className="mx-auto text-slate-400 mb-3 sm:mb-4" />
                                <p className="text-base sm:text-lg font-medium text-slate-700 mb-2">
                                    Drop your files here or click to browse
                                </p>
                                <p className="text-slate-500 text-xs sm:text-sm mb-3 sm:mb-4">
                                    Supported formats: PDF, DOCX, ZIP (Max 100MB per file)
                                </p>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    onChange={handleFileSelect}
                                    accept=".pdf,.docx,.zip,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/zip"
                                    className="hidden"
                                    id="file-upload"
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="flex items-center mx-auto"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        fileInputRef.current?.click();
                                    }}
                                >
                                    <UploadIcon size={16} className="mr-2" />
                                    Choose Files
                                </Button>
                            </div>

                            {/* Selected Files List */}
                            {files.length > 0 && (
                                <div className="mt-4 sm:mt-6">
                                    <h4 className="font-medium text-slate-700 mb-3 text-sm sm:text-base">
                                        Selected Files ({files.length})
                                    </h4>
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {files.map((file, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                                            >
                                                <div className="flex items-center flex-1 min-w-0">
                                                    <FileText size={18} className="text-slate-500 mr-3 flex-shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-slate-800 text-sm truncate">{file.name}</p>
                                                        <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                                                        {uploading && fileProgresses[index] != null && (
                                                            <div className="w-full max-w-32 sm:max-w-48 h-1.5 bg-slate-200 rounded-full mt-2">
                                                                <div
                                                                    className="h-1.5 rounded-full transition-all duration-200 bg-green-500"
                                                                    style={{ width: `${fileProgresses[index]}%` }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center ml-2">
                                                    {uploading && (
                                                        <div className="text-xs text-slate-500 mr-3 min-w-8 text-right">
                                                            {fileProgresses[index] ? `${fileProgresses[index]}%` : "0%"}
                                                        </div>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFile(index)}
                                                        className="text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                                        disabled={uploading}
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-6 sm:mb-8">
                            <div>
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
                                    disabled={uploading}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="Enter a descriptive title for your resource"
                                />
                            </div>

                            <div>
                                <label htmlFor="categories" className="block text-sm font-medium text-slate-700 mb-2">
                                    Categories * (Select multiple with Ctrl/Cmd)
                                </label>
                                {loadingCategories ? (
                                    <div className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg bg-slate-100 animate-pulse">
                                        Loading categories...
                                    </div>
                                ) : (
                                    <select
                                        id="categories"
                                        name="categories"
                                        value={formData.categories}
                                        onChange={handleInputChange}
                                        required
                                        multiple
                                        disabled={uploading}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-32 sm:min-h-40"
                                        size={6}
                                    >
                                        {categoriesList.map(cat => (
                                            <option key={cat.id || cat.name} value={cat.id || cat.name}>
                                                {cat.name || cat.catagoryName || cat}
                                            </option>
                                        ))}
                                    </select>
                                )}
                                {formData.categories.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {formData.categories.map(catId => (
                                            <span
                                                key={catId}
                                                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-200 text-slate-700"
                                            >
                                                {getCategoryName(catId)}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label htmlFor="tags" className="block text-sm font-medium text-slate-700 mb-2">
                                    Tags (comma separated)
                                </label>
                                <input
                                    type="text"
                                    id="tags"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleInputChange}
                                    disabled={uploading}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="e.g., algorithms, web-dev, database"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    disabled={uploading}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="Describe your resource in detail..."
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-slate-500 text-center sm:text-left">
                                {files.length} file(s) selected • {files.reduce((acc, file) => acc + file.size, 0) > 0 ?
                                    formatFileSize(files.reduce((acc, file) => acc + file.size, 0)) : '0 Bytes'}
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                disabled={uploading || files.length === 0}
                                className="flex items-center bg-slate-800 hover:bg-slate-700 text-white px-6 sm:px-8 py-2 sm:py-3 w-full sm:w-auto justify-center"
                            >
                                {uploading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <UploadIcon size={16} className="mr-2" />
                                        Upload {files.length > 1 ? `${files.length} Resources` : 'Resource'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Upload Guidelines */}
                <div className="mt-6 sm:mt-8 bg-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                    <h3 className="font-bold text-blue-900 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                        <CheckCircle size={18} className="mr-2 flex-shrink-0" />
                        Upload Guidelines
                    </h3>
                    <ul className="text-blue-800 text-xs sm:text-sm space-y-1 sm:space-y-2">
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Ensure you have the rights to share the content</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Provide clear and descriptive titles and descriptions</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Use appropriate categories and tags for better discoverability</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Maximum file size: 100MB per file</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Supported formats: PDF, DOCX, ZIP</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Do not upload copyrighted material without permission</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Upload;
