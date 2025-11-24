import { useState } from "react";
import Button from "../../../components/button.tsx";
import Modal from "../../../components/modal.tsx";
import { User, Mail, Calendar, Shield, Edit, Trash2, Ban, CheckCircle, XCircle, Search, Filter, MoreVertical } from "lucide-react";

const UserManage = ({ users, handleDeleteUser }) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [blockedUsers, setBlockedUsers] = useState(new Set());
  const [alert, setAlert] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 2500);
  };

  const handleUpdate = (user) => {
    setSelectedUser(user);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    handleDeleteUser(selectedUser.id);
    showAlert("success", "User deleted successfully");
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const handleBlock = (userId) => {
    setBlockedUsers((prev) => {
      const updated = new Set(prev);
      if (updated.has(userId)) {
        updated.delete(userId);
        showAlert("success", "User unblocked successfully");
      } else {
        updated.add(userId);
        showAlert("warning", "User blocked successfully");
      }
      return updated;
    });
  };

  const saveUpdatedUser = () => {
    showAlert("success", "User updated successfully");
    setIsUpdateModalOpen(false);
    setSelectedUser(null);
  };

  const getInitial = (name) => name?.charAt(0)?.toUpperCase() || "?";

  // Filter users based on search and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "ALL" || 
      (statusFilter === "ACTIVE" && !blockedUsers.has(user.id)) ||
      (statusFilter === "BLOCKED" && blockedUsers.has(user.id));
    
    return matchesSearch && matchesStatus;
  });

  // Get status badge styling
  const getStatusBadge = (userId) => {
    const isBlocked = blockedUsers.has(userId);
    if (isBlocked) {
      return { 
        bg: "bg-red-100", 
        text: "text-red-800", 
        border: "border-red-200",
        icon: XCircle,
        label: "Blocked" 
      };
    } else {
      return { 
        bg: "bg-green-100", 
        text: "text-green-800", 
        border: "border-green-200",
        icon: CheckCircle,
        label: "Active" 
      };
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

  return (
    <div className="space-y-6">
      {/* Alert */}
      {alert && (
        <div
          className={`px-4 py-3 rounded-lg text-white ${
            alert.type === "success"
              ? "bg-green-500"
              : alert.type === "warning"
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
        >
          {alert.message}
        </div>
      )}

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
                placeholder="Search users by name, username, or email..."
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
                <option value="ACTIVE">Active</option>
                <option value="BLOCKED">Blocked</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <User className="text-blue-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {users.length - blockedUsers.size}
              </p>
            </div>
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Blocked</p>
              <p className="text-2xl font-bold text-red-600">
                {blockedUsers.size}
              </p>
            </div>
            <Ban className="text-red-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New Today</p>
              <p className="text-2xl font-bold text-purple-600">0</p>
            </div>
            <User className="text-purple-500" size={24} />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Users</h3>
          <p className="text-sm text-gray-600">
            {filteredUsers.length} of {users.length} users
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
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
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
                {filteredUsers.map((user) => {
                  const statusBadge = getStatusBadge(user.id);
                  const StatusIcon = statusBadge.icon;

                  return (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                              {getInitial(user.name)}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              @{user.username}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail size={16} className="mr-2 text-gray-400" />
                          <span className="truncate">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-2 text-gray-400" />
                          {formatDate(user.joinedDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border} border`}>
                          <StatusIcon size={12} className="mr-1" />
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleUpdate(user)}
                            className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-50"
                            title="Edit User"
                          >
                            <Edit size={16} />
                          </button>
                          
                          <button
                            onClick={() => handleBlock(user.id)}
                            className={`${
                              blockedUsers.has(user.id)
                                ? "text-green-600 hover:text-green-800"
                                : "text-yellow-600 hover:text-yellow-800"
                            } transition-colors p-1 rounded hover:bg-gray-100`}
                            title={blockedUsers.has(user.id) ? "Unblock User" : "Block User"}
                          >
                            <Ban size={16} />
                          </button>
                          
                          <button
                            onClick={() => handleDelete(user)}
                            className="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-50"
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
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
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <User size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No users found</h3>
            <p className="text-gray-500 mb-4">
              {users.length === 0 
                ? "No users available yet" 
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

      {/* Update Modal */}
      {isUpdateModalOpen && (
        <Modal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          title="Update User"
          className="w-full max-w-md"
        >
          <div className="space-y-4">
            {selectedUser && (
              <>
                {/* User Avatar Preview */}
                <div className="flex items-center space-x-4 mb-4">
                  {selectedUser.avatarUrl ? (
                    <img
                      src={selectedUser.avatarUrl}
                      alt={selectedUser.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
                      {getInitial(selectedUser.name)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{selectedUser.name}</p>
                    <p className="text-gray-500">@{selectedUser.username}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={selectedUser.name}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, name: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-800 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={selectedUser.email}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, email: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-800 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={selectedUser.username}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, username: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-800 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={blockedUsers.has(selectedUser.id) ? "blocked" : "active"}
                    onChange={(e) => {
                      if (e.target.value === "blocked") {
                        setBlockedUsers((prev) => new Set(prev).add(selectedUser.id));
                      } else {
                        setBlockedUsers((prev) => {
                          const newSet = new Set(prev);
                          newSet.delete(selectedUser.id);
                          return newSet;
                        });
                      }
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-800 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button 
              color="gray" 
              onClick={() => setIsUpdateModalOpen(false)}
              className="px-4 py-2"
            >
              Cancel
            </Button>
            <Button 
              color="blue" 
              onClick={saveUpdatedUser}
              className="px-4 py-2"
            >
              Save Changes
            </Button>
          </div>
        </Modal>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete User"
          className="w-full max-w-md"
        >
          <div className="text-center">
            <Trash2 className="mx-auto text-red-500 mb-4" size={48} />
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete{" "}
              <strong>
                {selectedUser?.name} (@{selectedUser?.username})
              </strong>
              ? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button 
              color="gray" 
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2"
            >
              Cancel
            </Button>
            <Button 
              color="red" 
              onClick={confirmDelete}
              className="px-4 py-2"
            >
              Delete User
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserManage;