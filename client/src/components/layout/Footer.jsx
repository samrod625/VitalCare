import { Activity, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold">VitalCare</span>
            </div>
            <p className="text-gray-400 max-w-md">
              AI-powered healthcare platform with 4 trained models for
              comprehensive health screening.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-4">Services</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a
                  href="/eye-disease"
                  className="group inline-flex flex-col text-gray-400 hover:text-white transition-colors"
                >
                  <span>Eye Disease Detection</span>
                  <span className="mt-1 h-0.5 w-full bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </a>
              </li>
              <li>
                <a
                  href="/mental-health"
                  className="group inline-flex flex-col text-gray-400 hover:text-white transition-colors"
                >
                  <span>Mental Health</span>
                  <span className="mt-1 h-0.5 w-full bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </a>
              </li>
              <li>
                <a
                  href="/public-health"
                  className="group inline-flex flex-col text-gray-400 hover:text-white transition-colors"
                >
                  <span>Public Health</span>
                  <span className="mt-1 h-0.5 w-full bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </a>
              </li>
              <li>
                <a
                  href="/cognitive-health"
                  className="group inline-flex flex-col text-gray-400 hover:text-white transition-colors"
                >
                  <span>Cognitive Health</span>
                  <span className="mt-1 h-0.5 w-full bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-lg font-bold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="group relative flex flex-col items-center p-2.5 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span className="mt-1 h-0.5 w-full bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </a>
              <a
                href="#"
                className="group relative flex flex-col items-center p-2.5 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span className="mt-1 h-0.5 w-full bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 text-center text-gray-400">
          <p>&copy; 2025 VitalCare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
