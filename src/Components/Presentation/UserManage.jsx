import { useState } from "react";
import Button from "../../../components/button.tsx";
import Modal from "../../../components/modal.tsx";

const UserManage = ({ users,handleDeleteUser }) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [blockedUsers, setBlockedUsers] = useState(new Set());
  const [alert, setAlert] = useState(null);

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

  return (
    <div className="p-4 max-w-7xl mx-auto font-[Archivo]">
      {/* Alert */}
      {alert && (
        <div
          className={`mb-4 px-4 py-2 rounded-md text-white max-w-full sm:max-w-lg mx-auto ${
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

      {/* Empty State */}
      {users.length === 0 ? (
        <p className="text-center text-gray-500 py-20 text-lg">
          No users found
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition duration-200 flex flex-col justify-between w-full min-w-0"
            >
              {/* User Info */}
              <div className="flex items-center gap-4 mb-4">
                {user.profileImageLink ? (
                  <img
                    src={user.profileImageLink}
                    alt={user.fullName}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                    {getInitial(user.fullName)}
                  </div>
                )}
                <div className="flex flex-col overflow-hidden min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {user.fullName}
                  </p>
                  <p className="text-gray-500 text-sm truncate">
                    @{user.username}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="text-sm text-gray-700 space-y-1 mb-4">
                <p>
                  Email: <span className="text-gray-900">{user.email}</span>
                </p>
                <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                <p>
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      blockedUsers.has(user.id)
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {blockedUsers.has(user.id) ? "Blocked" : "Active"}
                  </span>
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 mt-auto">
                <Button
                  color="blue"
                  size="sm"
                  className="flex-1 min-w-[90px]"
                  onClick={() => handleUpdate(user)}
                >
                  Update
                </Button>
                <Button
                  color={blockedUsers.has(user.id) ? "gray" : "yellow"}
                  size="sm"
                  className="flex-1 min-w-[90px]"
                  onClick={() => handleBlock(user.id)}
                >
                  {blockedUsers.has(user.id) ? "Unblock" : "Block"}
                </Button>
                <Button
                  color="red"
                  size="sm"
                  className="flex-1 min-w-[90px]"
                  onClick={() => handleDelete(user)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Update Modal */}
      {isUpdateModalOpen && (
        <Modal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          title="Update User"
          className="w-full max-w-md sm:max-w-lg md:max-w-xl"
        >
          <div className="flex flex-col gap-3 max-h-[70vh] overflow-y-auto">
            {selectedUser && (
              <>
                <input
                  type="text"
                  value={selectedUser.fullName}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, fullName: e.target.value })
                  }
                  placeholder="Full Name"
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 w-full"
                />
                <input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, email: e.target.value })
                  }
                  placeholder="Email"
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 w-full"
                />
                <input
                  type="text"
                  value={selectedUser.username}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, username: e.target.value })
                  }
                  placeholder="Username"
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 w-full"
                />
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
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 w-full"
                >
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                </select>
              </>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-5 flex-wrap">
            <Button color="gray" onClick={() => setIsUpdateModalOpen(false)}>
              Cancel
            </Button>
            <Button color="blue" onClick={saveUpdatedUser}>
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
          className="w-full max-w-md sm:max-w-lg md:max-w-xl"
        >
          <p className="text-gray-700 mb-4">
            This will permanently delete{" "}
            <strong>
              {selectedUser?.fullName} (@{selectedUser?.username})
            </strong>
            . This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 flex-wrap">
            <Button color="gray" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button color="red" onClick={confirmDelete}>
              Delete User
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserManage;
