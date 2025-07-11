import { SparklesIcon, CameraIcon, ChefHatIcon, ClockIcon } from "./ui/Icons";

export default function Features() {
  const features = [
    {
      icon: CameraIcon,
      title: "Smart Photo Recognition",
      description:
        "Our AI accurately identifies ingredients from your photos, even in challenging lighting or angles.",
      color: "from-green-400 to-green-500",
    },
    {
      icon: SparklesIcon,
      title: "AI-Powered Recipes",
      description:
        "Get personalized recipe suggestions based on your available ingredients and dietary preferences.",
      color: "from-blue-400 to-blue-500",
    },
    {
      icon: ChefHatIcon,
      title: "Professional Quality",
      description:
        "Recipes created by professional chefs and validated by our culinary experts.",
      color: "from-purple-400 to-purple-500",
    },
    {
      icon: ClockIcon,
      title: "Quick & Easy",
      description:
        "From photo to recipe in seconds. Perfect for busy weeknights and meal planning.",
      color: "from-orange-400 to-orange-500",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose FridgeWiz?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of cooking with our advanced AI technology
            that transforms your ingredients into culinary masterpieces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div
                className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 md:p-12">
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Cooking?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of home cooks who have discovered the joy of
              cooking with FridgeWiz. Your next favorite recipe is just a photo
              away!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:from-green-500 hover:to-blue-600 transition-colors">
                Get Started Free
              </button>
              <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
