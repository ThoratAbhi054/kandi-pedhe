"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function AboutUs() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-yellow-600 py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1
              className={`text-4xl md:text-6xl font-bold text-white mb-6 transition-all duration-1000 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              आमच्याबद्दल
            </h1>
            <p
              className={`text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto transition-all duration-1000 delay-300 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              इंगळे पेढे हाऊस - १९५४ पासूनची चवीची परंपरा
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-white opacity-10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white opacity-10 rounded-full animate-pulse delay-500"></div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Section */}
            <div
              className={`relative transition-all duration-1000 delay-500 ${
                isLoaded
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
            >
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/IngalePedhaHouse.jpg"
                  alt="Ingale Pedha House"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-3 rounded-full shadow-lg">
                <span className="font-bold text-lg">१९५४ पासून</span>
              </div>
            </div>

            {/* Content Section */}
            <div
              className={`space-y-8 transition-all duration-1000 delay-700 ${
                isLoaded
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10"
              }`}
            >
              {/* Heritage Title */}
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  १९५४ पासूनची आमची
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-yellow-600">
                    {" "}
                    चवीची परंपरा
                  </span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full"></div>
              </div>

              {/* Main Content */}
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  साताऱ्याच्या हृदयात वसलेले,{" "}
                  <strong className="text-orange-600">
                    &lsquo;इंगळे पेढे हाऊस&rsquo;
                  </strong>{" "}
                  हे १९५४ पासून अस्सल महाराष्ट्रीयन मिठाईचे प्रतीक आहे. गेली ७०
                  वर्षांहून अधिक काळ आम्ही आमच्या कौटुंबिक वारसा मोठ्या
                  अभिमानाने जपत आहोत आणि पिढ्यानपिढ्या आवडतील अशा पारंपरिक मिठाई
                  तयार करत आहोत.
                </p>

                <p className="text-lg">
                  आमचा प्रवास एका साध्या ध्येयाने सुरू झाला - प्रत्येक क्षणाला
                  आनंद देणारी शुद्ध, स्वादिष्ट आणि अस्सल मिठाई ग्राहकांपर्यंत
                  पोहोचवणे.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 pt-6">
                <div className="text-center p-4 bg-white rounded-xl shadow-md">
                  <div className="text-3xl font-bold text-orange-600">७०+</div>
                  <div className="text-sm text-gray-600 mt-1">
                    वर्षांचा अनुभव
                  </div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-md">
                  <div className="text-3xl font-bold text-yellow-600">३</div>
                  <div className="text-sm text-gray-600 mt-1">
                    पिढ्यांची परंपरा
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Product Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-1000 delay-300 ${
              isLoaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              आमचे जगप्रसिद्ध
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-yellow-600">
                {" "}
                कंदी पेढे
              </span>
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full mx-auto"></div>
          </div>

          <div
            className={`bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl p-8 md:p-12 shadow-xl transition-all duration-1000 delay-500 ${
              isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  आमच्या ब्रँडचा आत्मा म्हणजे आमचे जगप्रसिद्ध{" "}
                  <strong className="text-orange-600">
                    &lsquo;साताऱ्याचे कंदी पेढे&rsquo;
                  </strong>
                  , जे पिढ्यानपिढ्या चालत आलेल्या पारंपरिक आणि रहस्यमय पद्धतीने
                  बनवले जातात.
                </p>

                <p className="text-lg text-gray-700 leading-relaxed">
                  आम्ही शुद्ध घटक, पारंपरिक कौशल्य आणि गुणवत्तेशी असलेली अतूट
                  बांधिलकी यावर विश्वास ठेवतो. आम्ही बनवलेली प्रत्येक मिठाई ही
                  आमच्या वारशाचे आणि सर्वोत्तम चव देण्याच्या आमच्या वचनाचे
                  प्रतीक आहे.
                </p>
              </div>

              {/* Feature highlights */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-md">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">शुद्ध घटक</h3>
                    <p className="text-sm text-gray-600">
                      केवळ उत्तम दर्जाचे नैसर्गिक साहित्य
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-md">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      पारंपरिक कौशल्य
                    </h3>
                    <p className="text-sm text-gray-600">
                      पिढ्यानपिढ्या चालत आलेली पद्धती
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-md">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      गुणवत्तेची हमी
                    </h3>
                    <p className="text-sm text-gray-600">
                      प्रत्येक उत्पादनात उत्कृष्टता
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Online Store Section */}
      <section className="py-20 bg-gradient-to-br from-orange-600 to-yellow-600">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center transition-all duration-1000 delay-300 ${
              isLoaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              आता तुमच्या घरापर्यंत
            </h2>

            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12">
              <p className="text-xl text-white leading-relaxed mb-8">
                आज, साताऱ्याची हीच चवीची परंपरा थेट तुमच्या घरापर्यंत पोहोचवताना
                आम्हाला विशेष आनंद होत आहे. आमचे नवीन ऑनलाइन स्टोअर हे गेल्या
                अनेक दशकांपासून जपलेली तीच ताजेपणा आणि अस्सल चव देण्याचे एक वचन
                आहे.
              </p>

              <p className="text-xl text-white leading-relaxed mb-8">
                आमच्या प्रत्येक घासात दडलेला हा समृद्ध वारसा अनुभवण्यासाठी आम्ही
                तुम्हाला आमंत्रित करतो.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="/products"
                  className="bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  आमची मिठाई पहा
                </a>
                <a
                  href="/categories"
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-orange-600 transition-all duration-200"
                >
                  श्रेणी पहा
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative footer wave */}
      <div className="h-20 bg-gradient-to-r from-orange-600 to-yellow-600">
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C400,20 800,100 1200,60 L1200,120 L0,120 Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
}
