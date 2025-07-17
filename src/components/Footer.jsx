import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 text-gray-600 py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div>
          <h4 className="text-lg font-semibold mb-2 text-indigo-600">GamifyZone</h4>
          <p>Turn learning into a fun and engaging journey with our game-based modules.</p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-indigo-500">Home</a></li>
            <li><a href="/dashboard" className="hover:text-indigo-500">Dashboard</a></li>
            <li><a href="/leaderboard" className="hover:text-indigo-500">Leaderboard</a></li>
            <li><a href="/privacy" className="hover:text-indigo-500">Privacy Policy</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-2">Follow Us</h4>
          <div className="flex gap-4">
            <a href="#" className="hover:text-indigo-600"><Github className="w-5 h-5" /></a>
            <a href="#" className="hover:text-indigo-600"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="hover:text-indigo-600"><Linkedin className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 mt-6">
        &copy; {new Date().getFullYear()} GamifyZone. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
