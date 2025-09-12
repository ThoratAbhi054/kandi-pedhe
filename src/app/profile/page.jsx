"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "../../utils/constant";
import { AuthActions } from "../../app/auth/utils";
import { Dialog } from "@headlessui/react";

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
    avatar: null,
    user: "",
    address: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isNewAddress, setIsNewAddress] = useState(false);

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
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          contact_no: data.contact_no || "",
          city: data.city || "",
          avatar: data.avatar || null,
          user: data.user || "",
          address: data.address || [],
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleEdit = (address) => {
    setSelectedAddress({ ...address });
    setIsNewAddress(false);
    setIsEditOpen(true);
  };

  const handleAddNew = () => {
    setSelectedAddress({
      address1: "",
      address2: "",
      city: "",
      district: "",
      state: "",
      country: "",
      pincode: "",
      contact_no: "",
      email: "",
      default: false,
    });
    setIsNewAddress(true);
    setIsEditOpen(true);
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const method = isNewAddress ? "POST" : "PATCH";
      const endpoint = isNewAddress
        ? `${API_URL}/iam/addresses/`
        : `${API_URL}/iam/addresses/${selectedAddress.id}/`;

      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...selectedAddress,
          user: profile.user,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Address save error:", errorData);

        // Show specific validation errors
        if (errorData.city) {
          alert(`City field error: ${errorData.city[0]}`);
        } else if (errorData.detail) {
          alert(`Error: ${errorData.detail}`);
        } else {
          alert("Failed to save address. Please check all required fields.");
        }
        return;
      }

      const updatedAddress = await response.json();

      setProfile((prevProfile) => ({
        ...prevProfile,
        address: isNewAddress
          ? [...prevProfile.address, updatedAddress]
          : prevProfile.address.map((addr) =>
              addr.id === selectedAddress.id ? updatedAddress : addr
            ),
      }));

      alert(
        isNewAddress
          ? "Address added successfully!"
          : "Address updated successfully!"
      );
      setIsEditOpen(false);
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const setDefaultAddress = async (addressId) => {
    try {
      const response = await fetch(`${API_URL}/iam/addresses/${addressId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // FIXED: Added Authorization header
        },
        body: JSON.stringify({ default: true }),
      });

      if (!response.ok) throw new Error("Failed to update default address");

      fetchAddresses(); // Refresh addresses list after update
    } catch (error) {
      console.error("Error updating default address:", error);
      alert("Failed to update default address. Please try again.");
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

      {/* Profile Form */}
      <form className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            value={profile.first_name}
            onChange={(e) =>
              setProfile({ ...profile, first_name: e.target.value })
            }
            placeholder="First Name"
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="text"
            value={profile.last_name}
            onChange={(e) =>
              setProfile({ ...profile, last_name: e.target.value })
            }
            placeholder="Last Name"
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>
        <input
          type="email"
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          placeholder="Email"
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          type="text"
          value={profile.contact_no}
          onChange={(e) =>
            setProfile({ ...profile, contact_no: e.target.value })
          }
          placeholder="Phone Number"
          className="w-full p-3 border rounded-lg"
          required
        />
      </form>

      {/* Address List */}
      <section className="mt-6">
        <h2 className="text-lg font-medium text-gray-900">Your Addresses</h2>
        <button
          onClick={handleAddNew}
          className="mt-3 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700"
        >
          + Add Address
        </button>
        <div className="mt-4 space-y-3">
          {profile.address.map((address) => (
            <div
              key={address.id}
              className="flex justify-between items-start p-4 border rounded-lg bg-gray-100"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {address.address1},
                </p>
                {address.address2 && (
                  <p className="text-sm text-gray-700">{address.address2},</p>
                )}
                <p className="text-sm text-gray-700">
                  {address.city}, {address.state} - {address.pincode}
                </p>
                <p className="text-sm text-gray-600">📞 {address.contact_no}</p>
                <p className="text-sm text-gray-600">✉️ {address.email}</p>
              </div>
              {address.default ? (
                <p className="text-sm font-semibold text-green-600">
                  ✅ Default Address
                </p>
              ) : (
                <button
                  onClick={() => setDefaultAddress(address.id)}
                  className="mt-2 text-sm text-blue-600 underline"
                >
                  Set as Default
                </button>
              )}
              <button
                onClick={() => handleEdit(address)}
                className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Edit/Add Address Modal */}
      {isEditOpen && (
        <Dialog
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          className="fixed inset-0 flex items-center justify-center bg-black/30"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {isNewAddress ? "Add Address" : "Edit Address"}
            </h2>
            {selectedAddress && (
              <div className="space-y-4">
                {[
                  { key: "address1", label: "Address Line 1", required: true },
                  { key: "address2", label: "Address Line 2", required: false },
                  { key: "city", label: "City", required: true },
                  { key: "district", label: "District", required: true },
                  { key: "state", label: "State", required: true },
                  { key: "country", label: "Country", required: true },
                  { key: "pincode", label: "Pincode", required: true },
                  {
                    key: "contact_no",
                    label: "Contact Number",
                    required: true,
                  },
                  { key: "email", label: "Email", required: true },
                ].map(({ key, label, required }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label}{" "}
                      {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type={
                        key === "email"
                          ? "email"
                          : key === "contact_no"
                          ? "tel"
                          : "text"
                      }
                      value={selectedAddress[key] || ""}
                      onChange={(e) =>
                        setSelectedAddress({
                          ...selectedAddress,
                          [key]: e.target.value,
                        })
                      }
                      placeholder={`Enter ${label.toLowerCase()}`}
                      required={required}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                ))}
                <button
                  onClick={handleSaveChanges}
                  className="w-full bg-green-500 p-3 rounded-lg text-white"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            )}
          </div>
        </Dialog>
      )}
    </div>
  );
}
