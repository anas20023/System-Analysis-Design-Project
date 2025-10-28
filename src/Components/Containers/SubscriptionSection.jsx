import { Link } from "react-router-dom";
import { Check, Star, Zap, Shield, Download, Users } from "lucide-react";
import features from '../../data/features'
import plans from "../../data/plans";
const SubscriptionSection = () => {

  return (
    <section className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white font-[archivo] mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mb-8">
            Unlock premium features and accelerate your learning journey with our flexible subscription plans
          </p>

          {/* No billing toggle needed */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center flex-1 min-w-[120px] max-w-[200px]"
            >
              <div className="flex items-center justify-center bg-slate-700 rounded-xl p-3 mb-3 w-12 h-12">
                <feature.icon size={24} className="text-white" />
              </div>
              <p className="text-sm text-gray-300 font-medium leading-tight">
                {feature.text}
              </p>
            </div>
          ))}
        </div>

        {/* Pricing Cards - Flex Layout */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-4 xl:gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`flex flex-col relative bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md lg:max-w-none lg:flex-1 ${
                plan.popular 
                  ? "lg:scale-105 lg:z-10 ring-2 ring-blue-500 order-first lg:order-none" 
                  : ""
              } transition-all duration-300`}
            >
              {/* Popular Badge */}
              {/* {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                  <span className="flex items-center bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                    <Star size={14} className="mr-1 fill-white" />
                    Most Popular
                  </span>
                </div>
              )} */}

              <div className="flex flex-col flex-1 p-6 md:p-8">
                {/* Plan Header */}
                <div className="flex flex-col items-center text-center mb-6 md:mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 font-[archivo] mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    {plan.period !== "forever" && (
                      <span className="text-gray-600 ml-2">/{plan.period}</span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </div>

                {/* Features List */}
                <div className="flex-1 mb-6 md:mb-8">
                  <ul className="space-y-3 md:space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check
                          size={20}
                          className="text-green-500 mr-3 mt-0.5 flex-shrink-0"
                        />
                        <span className="text-gray-700 text-sm leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="flex flex-col">
                  <Link
                    to={plan.name === "Institution" ? "/contact" : "/auth/signup"}
                    className={`flex items-center justify-center py-3 px-6 rounded-lg font-medium text-center transition-all duration-200 ${
                      plan.buttonVariant === "primary"
                        ? "bg-slate-800 hover:bg-slate-700 text-white shadow-md hover:shadow-lg"
                        : "border border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    {plan.buttonText}
                  </Link>
                </div>
              </div>

              {/* Free trial notice for Pro plan */}
              {plan.popular && (
                <div className="flex items-center justify-center bg-gray-50 border-t border-gray-200 px-6 md:px-8 py-4">
                  <p className="text-center text-sm text-gray-600">
                    <strong>30-day free trial</strong> included. No credit card required.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="flex flex-col items-center mt-12">
          <div className="flex flex-col bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 w-full max-w-4xl">
            <h3 className="text-xl font-bold text-white font-[archivo] mb-6 text-center">
              Trusted by Students Worldwide
            </h3>
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-gray-300">
              <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                <div className="text-2xl font-bold text-white mb-1">50K+</div>
                <div className="text-sm">Active Students</div>
              </div>
              <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                <div className="text-2xl font-bold text-white mb-1">10K+</div>
                <div className="text-sm">Premium Resources</div>
              </div>
              <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                <div className="text-2xl font-bold text-white mb-1">4.9/5</div>
                <div className="text-sm">Student Rating</div>
              </div>
              <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                <div className="text-2xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm">Support</div>
              </div>
            </div>
          </div>

          {/* FAQ/Support Links */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-8 text-sm">
            <Link 
              to="/faq" 
              className="text-gray-400 hover:text-white transition-colors whitespace-nowrap"
            >
              Frequently Asked Questions
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-400 hover:text-white transition-colors whitespace-nowrap"
            >
              Contact Support
            </Link>
            <Link 
              to="/refund-policy" 
              className="text-gray-400 hover:text-white transition-colors whitespace-nowrap"
            >
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
};

export default SubscriptionSection;