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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-6 text-lg text-gray-600 font-medium">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Profile</h1>
          <p className="text-lg text-gray-600">
            Manage your personal information and addresses
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8 text-center">
                <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <svg
                      className="w-12 h-12 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <h2 className="text-xl font-bold text-white">
                  {profile.first_name} {profile.last_name}
                </h2>
                <p className="text-blue-100">{profile.email}</p>
              </div>

              {/* Profile Form */}
              <div className="p-6">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={profile.first_name}
                        onChange={(e) =>
                          setProfile({ ...profile, first_name: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={profile.last_name}
                        onChange={(e) =>
                          setProfile({ ...profile, last_name: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      value={profile.contact_no}
                      onChange={(e) =>
                        setProfile({ ...profile, contact_no: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your contact number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={profile.city}
                      onChange={(e) =>
                        setProfile({ ...profile, city: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your city"
                      required
                    />
                  </div>

                  <button
                    type="button"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                  >
                    Save Profile Changes
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Addresses Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Your Addresses
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Manage your delivery addresses
                    </p>
                  </div>
                  <button
                    onClick={handleAddNew}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add New Address
                  </button>
                </div>
              </div>

              <div className="p-6">
                {profile.address.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No addresses yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Add your first address to get started
                    </p>
                    <button
                      onClick={handleAddNew}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                    >
                      Add Your First Address
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {profile.address.map((address) => (
                      <div
                        key={address.id}
                        className={`relative p-6 border-2 rounded-xl transition-all duration-200 hover:shadow-lg ${
                          address.default
                            ? "border-green-200 bg-green-50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        {address.default && (
                          <div className="absolute -top-2 -right-2">
                            <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                              Default
                            </span>
                          </div>
                        )}

                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 text-sm">
                                {address.address1}
                              </p>
                              {address.address2 && (
                                <p className="text-gray-700 text-sm">
                                  {address.address2}
                                </p>
                              )}
                              <p className="text-gray-600 text-sm">
                                {address.city}, {address.state} -{" "}
                                {address.pincode}
                              </p>
                              <p className="text-gray-600 text-sm">
                                {address.country}
                              </p>
                            </div>
                          </div>

                          <div className="border-t border-gray-200 pt-3">
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                  />
                                </svg>
                                {address.contact_no}
                              </div>
                              <div className="flex items-center gap-1">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                  />
                                </svg>
                                {address.email}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                            {!address.default && (
                              <button
                                onClick={() => setDefaultAddress(address.id)}
                                className="flex-1 bg-blue-50 text-blue-600 font-medium py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                              >
                                Set as Default
                              </button>
                            )}
                            <button
                              onClick={() => handleEdit(address)}
                              className="flex-1 bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit/Add Address Modal */}
        {isEditOpen && (
          <Dialog
            open={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {isNewAddress ? "Add New Address" : "Edit Address"}
                    </h2>
                    <p className="text-blue-100 mt-1">
                      {isNewAddress
                        ? "Fill in the details for your new address"
                        : "Update your address information"}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEditOpen(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {selectedAddress && (
                  <div className="space-y-6">
                    {/* Address Fields Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          key: "address1",
                          label: "Address Line 1",
                          required: true,
                          colSpan: "md:col-span-2",
                        },
                        {
                          key: "address2",
                          label: "Address Line 2",
                          required: false,
                          colSpan: "md:col-span-2",
                        },
                        {
                          key: "city",
                          label: "City",
                          required: true,
                          colSpan: "",
                        },
                        {
                          key: "district",
                          label: "District",
                          required: true,
                          colSpan: "",
                        },
                        {
                          key: "state",
                          label: "State",
                          required: true,
                          colSpan: "",
                        },
                        {
                          key: "country",
                          label: "Country",
                          required: true,
                          colSpan: "",
                        },
                        {
                          key: "pincode",
                          label: "Pincode",
                          required: true,
                          colSpan: "",
                        },
                        {
                          key: "contact_no",
                          label: "Contact Number",
                          required: true,
                          colSpan: "",
                        },
                        {
                          key: "email",
                          label: "Email",
                          required: true,
                          colSpan: "md:col-span-2",
                        },
                      ].map(({ key, label, required, colSpan }) => (
                        <div key={key} className={colSpan}>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {label}
                            {required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Default Address Checkbox */}
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                      <input
                        type="checkbox"
                        id="defaultAddress"
                        checked={selectedAddress.default || false}
                        onChange={(e) =>
                          setSelectedAddress({
                            ...selectedAddress,
                            default: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor="defaultAddress"
                        className="text-sm font-medium text-gray-700"
                      >
                        Set as default address
                      </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={() => setIsEditOpen(false)}
                        className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveChanges}
                        disabled={saving}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            {isNewAddress ? "Add Address" : "Update Address"}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Dialog>
        )}
      </div>
    </div>
  );
}
