import { Button } from "./ui/Button";
import { UploadIcon } from "./ui/Icons";

export default function Hero() {
  return (
    <section className="pt-20 pb-16 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Turn Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              Ingredients
            </span>
            <br />
            Into Amazing Recipes
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Simply upload photos of your ingredients and let our AI create
            personalized recipes just for you. No more wondering what to cook
            with what you have!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="flex items-center gap-2">
              <UploadIcon className="w-5 h-5" />
              Upload Ingredients
            </Button>
            <Button variant="outline" size="lg">
              See Example
            </Button>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold text-sm">
                        1
                      </span>
                    </div>
                    <span className="text-gray-700">
                      Upload ingredient photos
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">2</span>
                    </div>
                    <span className="text-gray-700">
                      AI analyzes your ingredients
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-bold text-sm">
                        3
                      </span>
                    </div>
                    <span className="text-gray-700">
                      Get personalized recipes
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">
                      Drop your ingredient photos here
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
