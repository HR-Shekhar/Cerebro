import { useState } from 'react';
import { Brain, ChevronRight, ArrowRight, Code, Database, Shield } from 'lucide-react';

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden font-sans">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="absolute rounded-full bg-white"
              style={{
                width: `${Math.random() * 10 + 1}px`,
                height: `${Math.random() * 10 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.3,
                animation: `float ${Math.random() * 15 + 10}s linear infinite`
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center py-6 px-8 md:px-16">
        <div className="flex items-center space-x-2">
          <Brain className="w-8 h-8 text-blue-400" />
          <span className="text-xl font-bold tracking-wider">CEREBRO</span>
        </div>
        <div className="hidden md:flex space-x-8">
          <a href="/learn-more" className="hover:text-blue-400 transition-colors">Features</a>
          <a href="/learn-more" className="hover:text-blue-400 transition-colors">About</a>
        
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-8 pt-16 pb-24 md:py-32 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Unlock Your Mind's Full Potential
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Cerebro is the next-generation cognitive enhancement platform designed to transform how you think, learn, and create.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <button 
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300 ease-out hover:scale-105"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => window.location.href = '/home'}
            >
              <span>Get Started</span>
              <ArrowRight className={`ml-2 w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
            </button>
            
            <a href="#learn-more" className="group inline-flex items-center justify-center px-6 py-3 text-lg font-medium text-white border border-gray-500 rounded-full hover:bg-white/10 transition-all duration-300">
              Learn More
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>
        </div>
      </main>

      {/* Feature Cards */}
      <section id="learn-more" className="relative z-10 px-8 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">Redefine Your Cognitive Boundaries</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md p-8 rounded-2xl border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 group">
            <div className="bg-blue-500/20 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-colors">
              <Brain className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-4">Neural Enhancement</h3>
            <p className="text-gray-400">Advanced algorithms personalized to your cognitive patterns for optimal mental performance.</p>
          </div>
          
          {/* Card 2 */}
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md p-8 rounded-2xl border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 group">
            <div className="bg-purple-500/20 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-purple-500/30 transition-colors">
              <Code className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-4">Adaptive Learning</h3>
            <p className="text-gray-400">Evolving systems that grow with you, continuously adapting to maximize your cognitive development.</p>
          </div>
          
          {/* Card 3 */}
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md p-8 rounded-2xl border border-gray-700 hover:border-pink-500 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20 group">
            <div className="bg-pink-500/20 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-pink-500/30 transition-colors">
              <Database className="w-8 h-8 text-pink-400" />
            </div>
            <h3 className="text-xl font-bold mb-4">Knowledge Integration</h3>
            <p className="text-gray-400">Seamlessly connect disparate information domains to generate breakthrough insights.</p>
          </div>
        </div>
      </section>

      {/* Testimonial/Stats Section */}
      <section className="relative z-10 px-8 py-16 max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-md rounded-3xl border border-gray-700 p-8 md:p-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">94%</h3>
              <p className="text-gray-300">Performance Improvement</p>
            </div>
            <div>
              <h3 className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">2.7x</h3>
              <p className="text-gray-300">Faster Learning</p>
            </div>
            <div>
              <h3 className="text-4xl md:text-5xl font-bold text-pink-400 mb-2">3</h3>
              <p className="text-gray-300">Active Users</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-8 py-16 md:py-24 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Cognitive Experience?</h2>
        <p className="text-gray-300 mb-10 max-w-2xl mx-auto">Join the cognitive revolution today and discover what your mind is truly capable of with Cerebro.</p>
        
        <button 
          className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300 ease-out hover:scale-105"
          onClick={() => window.location.href = '/home'}
        >
          Begin Your Journey
          <ArrowRight className="ml-2 w-5 h-5" />
        </button>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-6 md:mb-0">
            <Brain className="w-6 h-6 text-blue-400" />
            <span className="text-lg font-bold tracking-wider">CEREBRO</span>
          </div>
          
          <div className="flex space-x-8 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>

          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Cerebro. All rights reserved.
        </div>
      </footer>

      {/* CSS animation for floating particles */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-100px) translateX(100px);
          }
          100% {
            transform: translateY(-200px) translateX(0);
          }
        }
      `}</style>
    </div>
  );
}