"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "../../utils/constant";
import { AuthActions } from "../../app/auth/utils";

export default function CompleteProfilePage() {
  const { getToken } = AuthActions();
  const accessToken = getToken("access");
  const router = useRouter();

  const [profile, setProfile] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    contact_no: "",
    city: "",
    address: [],
    avatar: null,
    user: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
        setProfile({
          id: data.id || "",
          first_name: data?.first_name || "",
          last_name: data?.last_name || "",
          email: data?.email || "",
          contact_no: data.contact_no || "",
          city: data.city || "",
          address: data.address || [],
          user: data.user || "",
          avatar: data.avatar || null,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

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
        body: JSON.stringify({
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          contact_no: profile.contact_no,
          city: profile.city,
        }),
      });

      if (!res.ok) throw new Error("Profile update failed");

      for (const address of profile.address) {
        const addressData = { ...address, user: profile.user };
        await fetch(`${API_URL}/iam/addresses/`, {
          method: address.id ? "PATCH" : "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addressData),
        });
      }

      alert("Profile updated successfully!");
      router.push("/carts");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold text-gray-700 animate-pulse">
        Loading...
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-10 border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Complete Your Profile 📝
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            value={profile.first_name}
            onChange={(e) =>
              setProfile({ ...profile, first_name: e.target.value })
            }
            placeholder="First Name"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            required
          />
          <input
            type="text"
            value={profile.last_name}
            onChange={(e) =>
              setProfile({ ...profile, last_name: e.target.value })
            }
            placeholder="Last Name"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            required
          />
        </div>
        <input
          type="email"
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          placeholder="Email"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          required
        />
        <input
          type="text"
          value={profile.contact_no}
          onChange={(e) =>
            setProfile({ ...profile, contact_no: e.target.value })
          }
          placeholder="Phone Number"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          required
        />
        <input
          type="text"
          value={profile.city}
          onChange={(e) => setProfile({ ...profile, city: e.target.value })}
          placeholder="City"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        />

        {profile.address.map((addr, idx) => (
          <div key={idx} className="border p-4 rounded-lg bg-gray-100">
            <input
              type="text"
              value={addr.address1}
              onChange={(e) => {
                const newAddresses = [...profile.address];
                newAddresses[idx].address1 = e.target.value;
                setProfile({ ...profile, address: newAddresses });
              }}
              placeholder="Address 1"
              className="w-full p-2 border rounded-lg mb-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              required
            />
            <input
              type="text"
              value={addr.address2}
              onChange={(e) => {
                const newAddresses = [...profile.address];
                newAddresses[idx].address2 = e.target.value;
                setProfile({ ...profile, address: newAddresses });
              }}
              placeholder="Address 2"
              className="w-full p-2 border rounded-lg mb-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
            <input
              type="text"
              value={addr.pincode}
              onChange={(e) => {
                const newAddresses = [...profile.address];
                newAddresses[idx].pincode = e.target.value;
                setProfile({ ...profile, address: newAddresses });
              }}
              placeholder="Pincode"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              required
            />
            <input
              type="text"
              value={addr.city}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  address: profile.address.map((a, i) =>
                    i === idx ? { ...a, city: e.target.value } : a
                  ),
                })
              }
              placeholder="City"
              className="w-full p-2 border rounded-lg mb-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              required
            />
            <input
              type="text"
              value={addr.district}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  address: profile.address.map((a, i) =>
                    i === idx ? { ...a, district: e.target.value } : a
                  ),
                })
              }
              placeholder="District"
              className="w-full p-2 border rounded-lg mb-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              required
            />
            <input
              type="text"
              value={addr.contact_no}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  address: profile.address.map((a, i) =>
                    i === idx ? { ...a, contact_no: e.target.value } : a
                  ),
                })
              }
              placeholder="Contact No"
              className="w-full p-2 border rounded-lg mb-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              required
            />
            <input
              type="email"
              value={addr.email}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  address: profile.address.map((a, i) =>
                    i === idx ? { ...a, email: e.target.value } : a
                  ),
                })
              }
              placeholder="Email"
              className="w-full p-2 border rounded-lg mb-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              required
            />
            <input
              type="text"
              value={addr.state}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  address: profile.address.map((a, i) =>
                    i === idx ? { ...a, state: e.target.value } : a
                  ),
                })
              }
              placeholder="State"
              className="w-full p-2 border rounded-lg mb-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              required
            />
            <input
              type="text"
              value={addr.country}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  address: profile.address.map((a, i) =>
                    i === idx ? { ...a, country: e.target.value } : a
                  ),
                })
              }
              placeholder="Country"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              required
            />
            <input
              type="checkbox"
              checked={addr.default}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  address: profile.address.map((a, i) =>
                    i === idx ? { ...a, default: e.target.checked } : a
                  ),
                })
              }
              className="mr-2"
            />{" "}
            Default Address
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            setProfile({ ...profile, address: [...profile.address, {}] })
          }
          className="w-full bg-green-500 text-white p-3 rounded-md font-semibold shadow-md hover:bg-green-600"
        >
          Add Address
        </button>
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
