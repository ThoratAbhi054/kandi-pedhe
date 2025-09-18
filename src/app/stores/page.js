import Image from "next/image";

const storeLocations = [
  {
    id: 1,
    name: "Ingale Pedha House - Main Store",
    subtitle: "Hotel Ingale Inn & Pedha House",
    address: "NH-4 (Pune-Bangalore Highway), Near Hotel Manasi Royal",
    locality: "Khed Wadhe, Satara, Maharashtra 415003",
    mapPin: "44gy6h (NH 965D, Khed, Satara)",
    phones: ["+91 99221 49922", "+91 96899 60404"],
    hours: "Daily: 9:00 AM – 9:30 PM",
    rating: "4.0",
    reviews: "167",
    isMain: true,
    imageUrl: "/images/IngalePedhaHouse.jpg",
    mapUrl: "https://maps.app.goo.gl/MiReGyfwMZEKkqSQ6",
  },
  {
    id: 2,
    name: "Ingale Pedha House - Additional Outlet",
    subtitle: "Satara Locality Branch",
    address: "Plot 10, Survey 84/9/10/11/12/13",
    locality: "Satara Locality, Satara",
    phones: ["+91 99221 49922", "+91 96899 60404"],
    hours: "Daily: 9:00 AM – 9:30 PM",
    rating: "4.0",
    reviews: "167",
    isMain: false,
    imageUrl: "/images/IngalePedhaHouse.jpg",
    mapUrl: "https://maps.google.com/?q=Satara+Locality+Satara",
  },
];

export default function StoreLocator() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Our Store Locations
          </h2>
          <p className="mt-6 text-lg/8 text-gray-600">
            Visit us at our authentic sweet shops to experience the rich
            tradition of Indian sweets. Fresh, delicious, and made with love.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-1 xl:grid-cols-2">
          {storeLocations.map((store) => (
            <div
              key={store.id}
              className="relative bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              {/* Store Image */}
              <div className="relative h-48 sm:h-64">
                <Image
                  alt={store.name}
                  src={store.imageUrl}
                  fill
                  className="object-cover"
                />
                {store.isMain && (
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-400 text-yellow-900">
                      Main Store
                    </span>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm font-medium text-gray-900">
                      {store.rating}
                    </span>
                    <span className="text-sm text-gray-600">
                      ({store.reviews})
                    </span>
                  </div>
                </div>
              </div>

              {/* Store Information */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {store.name}
                  </h3>
                  <p className="text-sm text-gray-600">{store.subtitle}</p>
                </div>

                {/* Address */}
                <div className="mb-4">
                  <div className="flex items-start space-x-2 mb-2">
                    <span className="text-red-500 mt-0.5">📍</span>
                    <div className="text-sm text-gray-700">
                      <p className="font-medium">{store.address}</p>
                      <p>{store.locality}</p>
                      {store.mapPin && (
                        <p className="text-xs text-gray-500 mt-1">
                          Map Pin: {store.mapPin}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">📞</span>
                    <div className="text-sm text-gray-700">
                      {store.phones.map((phone, index) => (
                        <div key={index}>
                          <a
                            href={`tel:${phone.replace(/\s/g, "")}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {phone}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-blue-500">🕒</span>
                    <span className="text-sm text-gray-700">{store.hours}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <a
                    href={store.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg transition-colors duration-200 text-sm font-medium"
                  >
                    Get Directions
                  </a>
                  <a
                    href={`tel:${store.phones[0].replace(/\s/g, "")}`}
                    className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 text-center py-2 px-4 rounded-lg transition-colors duration-200 text-sm font-medium"
                  >
                    Call Store
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Experience Authentic Indian Sweets
            </h3>
            <p className="text-gray-600 max-w-3xl mx-auto mb-6">
              Our stores offer the finest traditional Indian sweets made with
              authentic recipes passed down through generations. Visit us to
              taste the difference that quality ingredients and traditional
              methods make.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="text-green-500">✓</span>
                <span>Fresh Daily Preparation</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="text-green-500">✓</span>
                <span>Traditional Recipes</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="text-green-500">✓</span>
                <span>Premium Quality Ingredients</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
