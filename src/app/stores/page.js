"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { API_URL } from "../../utils/constant";
import {
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  StarIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  SparklesIcon,
  HeartIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

export default function StoreLocator() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getStores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/cms/branches/`, {
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setStores(data?.results || []);
    } catch (err) {
      console.error("Error fetching stores:", err);
      setError("Failed to load store information. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getStores();
  }, [getStores]);

  const generateMapUrl = (address) => {
    if (!address) return "#";
    const query = encodeURIComponent(
      `${address.address1}, ${address.address2}, ${address.city}, ${address.state}, ${address.pincode}, ${address.country}`
    );
    return `https://maps.google.com/?q=${query}`;
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return "";
    return phone.replace(/\s/g, "");
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-pulse">
                  <BuildingOfficeIcon className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Our Store Locations
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Visit us at our authentic sweet shops to experience the rich
                tradition of Indian sweets. Fresh, delicious, and made with
                love.
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[...Array(2)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <div className="h-10 bg-gray-200 rounded w-32" />
                    <div className="h-10 bg-gray-200 rounded w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-24 w-24 text-red-400 mb-4">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Stores
          </h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={getStores}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <BuildingOfficeIcon className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Store Locations
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Visit us at our authentic sweet shops to experience the rich
              tradition of Indian sweets. Fresh, delicious, and made with love
              at each of our locations.
            </p>
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Fresh Daily
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Traditional Recipes
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Premium Quality
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stores Grid */}
        <section>
          {stores.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {stores.map((store, index) => (
                <div
                  key={store.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Store Image */}
                  <div className="relative h-64">
                    <Image
                      alt={store.title}
                      src="/images/IngalePedhaHouse.jpg"
                      fill
                      className="object-cover"
                    />
                    {store.is_main && (
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 shadow-lg">
                          <StarIcon className="w-3 h-3 mr-1" />
                          Main Store
                        </span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                        <StarIcon className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium text-gray-900">
                          4.8
                        </span>
                        <span className="text-sm text-gray-600">(127)</span>
                      </div>
                    </div>
                  </div>

                  {/* Store Information */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {store.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {store.description}
                      </p>
                    </div>

                    {/* Address */}
                    {store.address && (
                      <div className="mb-4">
                        <div className="flex items-start space-x-3">
                          <MapPinIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-gray-700">
                            <p className="font-medium">
                              {store.address.address1}
                            </p>
                            {store.address.address2 && (
                              <p>{store.address.address2}</p>
                            )}
                            <p>
                              {store.address.city}, {store.address.state}{" "}
                              {store.address.pincode}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {store.address.country}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Contact Information */}
                    <div className="space-y-3 mb-6">
                      {store.contact_no && (
                        <div className="flex items-center space-x-3">
                          <PhoneIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <div className="text-sm text-gray-700">
                            <a
                              href={`tel:${formatPhoneNumber(
                                store.contact_no
                              )}`}
                              className="hover:text-blue-600 transition-colors font-medium"
                            >
                              {store.contact_no}
                            </a>
                          </div>
                        </div>
                      )}

                      {store.email && (
                        <div className="flex items-center space-x-3">
                          <EnvelopeIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                          <div className="text-sm text-gray-700">
                            <a
                              href={`mailto:${store.email}`}
                              className="hover:text-blue-600 transition-colors"
                            >
                              {store.email}
                            </a>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-3">
                        <ClockIcon className="w-5 h-5 text-purple-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">
                          Daily: 9:00 AM – 9:30 PM
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href={generateMapUrl(store.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-center py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md font-semibold flex items-center justify-center gap-2"
                      >
                        <MapPinIcon className="w-4 h-4" />
                        Get Directions
                      </a>
                      {store.contact_no && (
                        <a
                          href={`tel:${formatPhoneNumber(store.contact_no)}`}
                          className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 text-center py-3 px-4 rounded-xl transition-all duration-200 font-semibold flex items-center justify-center gap-2"
                        >
                          <PhoneIcon className="w-4 h-4" />
                          Call Store
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto h-32 w-32 text-gray-300 mb-6">
                <BuildingOfficeIcon className="w-full h-full" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No stores found
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                We&apos;re working on adding more store locations. Please check
                back soon!
              </p>
            </div>
          )}
        </section>

        {/* Call to Action Section */}
        <div className="mt-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-8 text-center text-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              🍯 Can&apos;t Visit Our Stores?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              No worries! We offer online ordering and delivery services. Get
              your favorite sweets delivered fresh to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-white text-orange-600 hover:bg-gray-100 font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
                Order Online
              </button>
              <button className="px-6 py-3 border-2 border-white text-white hover:bg-white hover:text-orange-600 font-semibold rounded-xl transition-all duration-200">
                Contact Us
              </button>
            </div>
          </div>
        </div>

        {/* Store Features */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Why Choose Our Stores?
            </h3>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Every visit to our stores is an experience in authentic Indian
              sweet-making tradition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SparklesIcon className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Fresh Daily
              </h4>
              <p className="text-gray-600 text-sm">
                All our sweets are prepared fresh daily using traditional
                methods and premium ingredients.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeartIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Made with Love
              </h4>
              <p className="text-gray-600 text-sm">
                Each sweet is crafted with love and care, following recipes
                passed down through generations.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <EyeIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Transparent Process
              </h4>
              <p className="text-gray-600 text-sm">
                Watch our skilled artisans create these delicious treats right
                before your eyes.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
