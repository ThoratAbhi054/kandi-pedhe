"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "../../utils/constant";
import { AuthActions } from "../../app/auth/utils";

export default function CompleteProfilePage() {
  const { getToken } = AuthActions();
  const accessToken = getToken("access");
  const router = useRouter();

  // ✅ Profile State
  const [profile, setProfile] = useState({
    id: "",
    first_name: "",
    last_name: "",
    contact_no: "",
    city: "",
    // address: "",
    avatar: null,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ✅ Fetch Profile from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/iam/users/me/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Profile fetch failed");

        const data = await res.json();

        // ✅ Extract Profile Data
        const userProfile = data || {};
        setProfile({
          id: userProfile.id || "",
          first_name: userProfile.first_name || "",
          last_name: userProfile.last_name || "",
          contact_no: userProfile.contact_no || "",
          city: userProfile.city || "",
          // address: Array.isArray(userProfile.address)
          //   ? userProfile.address.join(", ")
          //   : "",
          avatar: userProfile.avatar || null,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  // ✅ Handle Profile Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`${API_URL}/iam/users/${profile.id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      if (!res.ok) throw new Error("Profile update failed");

      alert("Profile updated successfully!");
      router.push("/checkout"); // ✅ Redirect to checkout
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-semibold text-gray-700 animate-pulse">
          Loading...
        </div>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md mt-10 border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Complete Your Profile 📝
      </h1>

      {/* Avatar Upload (Future Implementation) */}
      <div className="flex justify-center mb-4">
        <img
          src={profile.avatar || "/images/default-avatar.png"}
          alt="Profile Avatar"
          className="w-24 h-24 rounded-full border-4 border-gray-300 shadow-md"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name */}
        <div>
          <label className="block text-gray-700 font-medium">First Name</label>
          <input
            type="text"
            placeholder="Enter First Name"
            value={profile.first_name}
            onChange={(e) =>
              setProfile({ ...profile, first_name: e.target.value })
            }
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            required
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-gray-700 font-medium">Last Name</label>
          <input
            type="text"
            placeholder="Enter Last Name"
            value={profile.last_name}
            onChange={(e) =>
              setProfile({ ...profile, last_name: e.target.value })
            }
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-700 font-medium">
            Phone Number
          </label>
          <input
            type="text"
            placeholder="Enter Phone Number"
            value={profile.contact_no}
            onChange={(e) =>
              setProfile({ ...profile, contact_no: e.target.value })
            }
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            required
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-gray-700 font-medium">City</label>
          <input
            type="text"
            placeholder="Enter City"
            value={profile.city}
            onChange={(e) => setProfile({ ...profile, city: e.target.value })}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        {/* Address */}
        {/* <div>
          <label className="block text-gray-700 font-medium">Address</label>
          <textarea
            placeholder="Enter Address (comma-separated)"
            value={profile.address}
            onChange={(e) =>
              setProfile({ ...profile, address: e.target.value })
            }
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            required
          />
        </div> */}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={saving}
          className={`w-full py-3 rounded-lg text-white font-semibold transition ${
            saving
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-500 hover:bg-indigo-600"
          }`}
        >
          {saving ? "Saving..." : "Save & Continue"}
        </button>
      </form>
    </div>
  );
}
