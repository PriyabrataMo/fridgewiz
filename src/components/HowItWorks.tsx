import { UploadIcon, SparklesIcon, ChefHatIcon } from "./ui/Icons";

export default function HowItWorks() {
  const steps = [
    {
      icon: UploadIcon,
      title: "Upload Your Ingredients",
      description:
        "Take photos of your ingredients or upload existing images. Our AI works with any quality photo.",
      step: "01",
    },
    {
      icon: SparklesIcon,
      title: "AI Magic Happens",
      description:
        "Our advanced AI analyzes your ingredients and considers dietary preferences to create perfect recipe matches.",
      step: "02",
    },
    {
      icon: ChefHatIcon,
      title: "Get Your Recipes",
      description:
        "Receive personalized recipes with step-by-step instructions, cooking times, and nutritional information.",
      step: "03",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How FridgeWiz Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your ingredients into delicious meals in three simple
            steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              {/* Connection line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-green-200 to-blue-200 z-0" />
              )}

              <div className="relative z-10">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-white border-4 border-gray-200 flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  <step.icon className="w-12 h-12 text-gray-600 group-hover:text-gray-800 transition-colors duration-300" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {step.step}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              See It In Action
            </h3>
            <p className="text-gray-600 mb-6">
              Watch how FridgeWiz transforms simple ingredients into amazing
              recipes
            </p>
            <div className="bg-gray-100 rounded-xl p-8 border-2 border-dashed border-gray-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">Demo video coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
