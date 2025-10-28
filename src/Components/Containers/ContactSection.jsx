import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Plus, Minus } from "lucide-react";
import contactInfo from "../../data/contactInfo";
import faqItems from "../../data/faq";
const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };



  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-[archivo] mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8">
          {/* Contact Information */}
          <div className="flex flex-col lg:w-2/5">
            <div className="bg-slate-800 rounded-2xl p-8 text-white mb-8">
              <h3 className="text-2xl font-bold font-[archivo] mb-2">
                Let's talk about everything!
              </h3>
              <p className="text-gray-300 mb-6">
                Whether you have questions about our resources, need technical support, 
                or want to discuss partnership opportunities, we're here to help.
              </p>
              
              {/* Contact Info Grid */}
              <div className="flex flex-col gap-6">
                {contactInfo.map((item, index) => (
                  <a
                    key={index}
                    href={item.link}
                    className="flex items-start p-4 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-center bg-white/10 rounded-lg p-3 mr-4 group-hover:bg-white/20 transition-colors">
                      <item.icon size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-white font-medium text-sm mb-1">{item.details}</p>
                      <p className="text-gray-300 text-sm">{item.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                <MessageCircle size={20} className="mr-2 text-slate-800" />
                Quick Support
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-slate-800 rounded-full mr-3"></div>
                  Technical issues with downloads
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-slate-800 rounded-full mr-3"></div>
                  Account and subscription help
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-slate-800 rounded-full mr-3"></div>
                  Resource upload questions
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-slate-800 rounded-full mr-3"></div>
                  Partnership inquiries
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="flex flex-col lg:w-3/5">
            <div className="bg-gray-50 rounded-2xl p-8 h-full">
              <h3 className="text-2xl font-bold text-gray-900 font-[archivo] mb-6">
                Send us a Message
              </h3>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex flex-col flex-1">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="subject" className="text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all duration-200"
                    placeholder="What is this regarding?"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="message" className="text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white py-4 px-8 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg mt-4"
                >
                  <Send size={18} className="mr-2" />
                  Send Message
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By submitting this form, you agree to our privacy policy and terms of service.
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 font-[archivo] mb-4">
              Frequently Asked Questions
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find quick answers to common questions about our platform
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col gap-4">
              {faqItems.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex items-center justify-between w-full p-6 text-left hover:bg-gray-50 transition-colors duration-200"
                  >
                    <h4 className="font-semibold text-gray-900 text-lg pr-4">
                      {faq.question}
                    </h4>
                    <div className="flex-shrink-0">
                      {openFaq === index ? (
                        <Minus size={20} className="text-slate-800" />
                      ) : (
                        <Plus size={20} className="text-slate-800" />
                      )}
                    </div>
                  </button>
                  
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      openFaq === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    } overflow-hidden`}
                  >
                    <div className="px-6 pb-6">
                      <div className="w-12 h-1 bg-slate-800 rounded-full mb-4"></div>
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Still Need Help */}
            <div className="text-center mt-12">
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-8 text-white">
                <h4 className="text-2xl font-bold font-[archivo] mb-4">
                  Still need help?
                </h4>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  Can't find the answer you're looking for? Don't worry, our support team is here to help you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="mailto:support@cse-rsp.com"
                    className="flex items-center justify-center bg-white text-slate-800 hover:bg-gray-100 py-3 px-6 rounded-lg font-medium transition-all duration-200"
                  >
                    <Mail size={18} className="mr-2" />
                    Email Support
                  </a>
                  <a
                    href="/contact"
                    className="flex items-center justify-center border border-white text-white hover:bg-white hover:text-slate-800 py-3 px-6 rounded-lg font-medium transition-all duration-200"
                  >
                    <MessageCircle size={18} className="mr-2" />
                    Contact Form
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;