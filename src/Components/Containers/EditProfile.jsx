// src/pages/profile/EditProfile.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../../../components/button";
import { ArrowLeft, User, Mail, Loader2, Upload } from "lucide-react";

const EditProfile = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    bio: ""
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const [loading, setLoading] = useState(true); // initial fetch
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // helper to get auth token from cookie (same approach as ProfilePage)
  const getAuthToken = () => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('authToken='))
      ?.split('=')[1];
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const authToken = getAuthToken();

        const res = await axios.get(`${import.meta.env.VITE_SERVER}/users/me`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {})
          }
        });

        const user = res.data;
        setForm({
          name: user.name || "",
          username: user.username || "",
          email: user.email || "",
          bio: user.bio || ""
        });
        if (user.avatarUrl) setAvatarPreview(user.avatarUrl);
      } catch (err) {
        console.error("Fetch profile error:", err);
        // Redirect to login if unauthorized
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          navigate("/auth/login");
        } else {
          setError("Failed to load profile. Try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    navigate(-1); // back
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const authToken = getAuthToken();

      // If user selected a new avatar file, send multipart/form-data
      if (avatarFile) {
        const fd = new FormData();
        fd.append("avatar", avatarFile);
        fd.append("name", form.name);
        fd.append("username", form.username);
        fd.append("email", form.email);
        fd.append("bio", form.bio);

        await axios.patch(
          `${import.meta.env.VITE_SERVER}/users/me`,
          fd,
          {
            withCredentials: true,
            headers: {
              ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {})
              // Do NOT set Content-Type header here; axios will set boundary for multipart.
            }
          }
        );
      } else {
        // No file: send JSON
        await axios.patch(
          `${import.meta.env.VITE_SERVER}/users/me`,
          {
            name: form.name,
            username: form.username,
            email: form.email,
            bio: form.bio
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {})
            }
          }
        );
      }

      // On success, navigate back (or to profile)
      navigate("/profile"); // or navigate(-1);
    } catch (err) {
      console.error("Update profile error:", err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to update profile.");
        if (err.response?.status === 401) {
          navigate("/auth/login");
          return;
        }
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-slate-800 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-800">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-600 hover:text-slate-800 transition-colors duration-200"
          >
            <ArrowLeft size={18} className="mr-2" /> Back
          </button>
          <h2 className="text-xl font-semibold text-slate-800">Edit Profile</h2>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded">{error}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-1 flex flex-col items-center">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-slate-100 shadow-md mb-3">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-200 flex items-center justify-center text-2xl text-slate-700">
                    {form.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
              </div>

              <label className="flex items-center cursor-pointer text-sm text-slate-700 hover:text-slate-900">
                <Upload size={16} className="mr-2" />
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                Change Avatar
              </label>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="text-sm text-slate-500">Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 rounded-md border border-slate-200 bg-slate-50"
                  placeholder="Your full name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-500">Username</label>
                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 rounded-md border border-slate-200 bg-slate-50"
                    placeholder="username"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-500">Email</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    className="w-full mt-1 p-3 rounded-md border border-slate-200 bg-slate-50"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-500">Bio</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full mt-1 p-3 rounded-md border border-slate-200 bg-slate-50"
                  placeholder="Tell us about yourself"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3">
            <Button variant="secondary" onClick={handleCancel} type="button">
              Cancel
            </Button>

            <Button type="submit" className="flex items-center" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
