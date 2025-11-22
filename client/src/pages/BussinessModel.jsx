import React, { useState, useRef, useEffect } from "react";
import { 
  CheckCircle2, 
  Zap, 
  Building2, 
  GraduationCap, 
  ArrowRight, 
  Shield, 
  CreditCard,
  Star
} from "lucide-react";

// --- 1. Internal CSS (Matches Home.jsx & EyeDisease.jsx) ---
const customStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }
  .animate-float-slow { animation: float 6s ease-in-out infinite; }
  .animate-float-medium { animation: float 5s ease-in-out infinite; }
  
  .reveal-section {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.5, 0, 0, 1);
    will-change: opacity, transform;
  }
  .reveal-section.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

// --- 2. Helper Components ---

const RevealOnScroll = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.disconnect(); };
  }, []);

  return (
    <div ref={ref} className={`reveal-section ${isVisible ? "is-visible" : ""}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

const BackgroundIcon = ({ icon: Icon, className }) => (
  <div className={`absolute opacity-5 md:opacity-10 pointer-events-none select-none ${className}`} aria-hidden="true">
    <Icon className="w-full h-full" />
  </div>
);

const Pricing = () => {
  const plans = [
    {
      name: "Explorer",
      price: "Free",
      period: "2 Weeks",
      description: "Perfect for trying out our AI diagnostics tools.",
      icon: Zap,
      color: "slate",
      features: [
        "Access to Eye Disease Detection",
        "Basic Dyslexia Screening",
        "3 AI Reports / Day",
        "Standard Support",
        "Community Access"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Family Plan",
      price: "₹1,599",
      period: "Per 3 Months",
      description: "Complete access for individuals and families.",
      icon: Star,
      color: "cyan",
      features: [
        "Unlimited Eye Disease Scans",
        "Advanced Dyslexia Analysis",
        "Voice Assessment Agent",
        "Downloadable PDF Reports",
        "Blockchain Verification",
        "Priority 24/7 Support"
      ],
      cta: "Get Started",
      popular: true
    },
    {
      name: "Campus Plan",
      price: "₹4,899",
      period: "Per Year",
      description: "Designed for Schools, Colleges & Institutions.",
      icon: GraduationCap,
      color: "purple",
      features: [
        "Multi-User Admin Dashboard",
        "Bulk Student Screening",
        "Institutional Health Reports",
        "API Access for Integration",
        "Dedicated Account Manager",
        "On-premise Setup Support"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-slate-100 overflow-x-hidden font-sans">
      <style>{customStyles}</style>

      <div className="max-w-[90rem] mx-auto px-6 py-8 lg:py-16">
        
        {/* ================= HEADER ================= */}
        <section className="relative py-12 flex flex-col items-center text-center mb-16">
          <BackgroundIcon icon={CreditCard} className="w-48 h-48 top-0 left-10 text-cyan-500 animate-float-slow" />
          <BackgroundIcon icon={Building2} className="w-32 h-32 bottom-0 right-10 text-teal-400 animate-float-medium" />
          
          <RevealOnScroll>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 text-cyan-700 rounded-full font-bold text-sm mb-6 border border-cyan-100">
              <Shield className="w-4 h-4" />
              Simple, Transparent Pricing
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
              Invest in Your Health
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Choose the plan that fits your needs. Whether you're an individual or an educational institution, we have you covered.
            </p>
          </RevealOnScroll>
        </section>

        {/* ================= PRICING CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-start">
          {plans.map((plan, index) => {
            const isPopular = plan.popular;
            // Dynamic color classes based on plan type
            const borderColor = isPopular ? "border-cyan-400" : "border-gray-200";
            const shadowClass = isPopular ? "shadow-2xl shadow-cyan-200/50 scale-105 z-10" : "shadow-xl hover:shadow-2xl hover:-translate-y-2";
            const btnColor = isPopular ? "bg-cyan-600 hover:bg-cyan-700 text-white" : "bg-white text-slate-700 border-2 border-gray-200 hover:border-cyan-300";
            
            return (
              <RevealOnScroll key={plan.name} delay={index * 150}>
                <div className={`relative bg-white rounded-[2.5rem] p-8 lg:p-10 border ${borderColor} ${shadowClass} transition-all duration-500 flex flex-col h-full`}>
                  
                  {/* Popular Badge */}
                  {isPopular && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-cyan-500 text-white px-6 py-2 rounded-full text-sm font-bold tracking-wide shadow-lg">
                      MOST POPULAR
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="mb-8 text-center">
                    <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 ${isPopular ? 'bg-cyan-100 text-cyan-600' : 'bg-slate-100 text-slate-500'}`}>
                      <plan.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                    <p className="text-slate-500 text-sm min-h-[40px]">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-8 pb-8 border-b border-slate-100">
                    <div className="flex items-end justify-center gap-1">
                      <span className="text-4xl lg:text-5xl font-bold text-slate-900">{plan.price}</span>
                      <span className="text-slate-400 font-medium mb-1.5">/{plan.period}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-10 flex-grow">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-600 text-sm font-medium">
                        <CheckCircle2 className={`w-5 h-5 shrink-0 ${isPopular ? 'text-cyan-500' : 'text-slate-400'}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${btnColor}`}>
                    {plan.cta}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>

        {/* ================= TRUST SECTION ================= */}
        <RevealOnScroll delay={400}>
          <div className="mt-24 bg-slate-900 rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Trusted by Leading Institutions
              </h2>
              <p className="text-slate-400 text-lg mb-10">
                Our Campus Plan is currently deployed in over 50+ schools and universities, ensuring early detection and better health outcomes for students.
              </p>
              <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Placeholders for logos */}
                <div className="text-2xl font-bold text-white">MIT</div>
                <div className="text-2xl font-bold text-white">Stanford</div>
                <div className="text-2xl font-bold text-white">IIT Bombay</div>
                <div className="text-2xl font-bold text-white">AIIMS</div>
              </div>
            </div>
          </div>
        </RevealOnScroll>

      </div>
    </div>
  );
};

export default Pricing;