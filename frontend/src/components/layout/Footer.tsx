import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-ink-900 text-grey-300 py-6 px-6 text-xs w-full mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div className="flex flex-col space-y-1">
          <p>Content ownership: RailNexus Team, Smart India Hackathon 2026</p>
          <p className="text-saffron font-semibold">
            This is a prototype built for SIH 2026 and is not an official Indian Railways production system. All data shown is synthetic.
          </p>
        </div>
        
        <div className="flex flex-col md:items-end space-y-1">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>Best viewed at 1280×800 or higher</p>
          <div className="flex space-x-3 mt-2 text-blue-400">
            <a href="#" className="hover:underline">Disclaimer</a>
            <span>&middot;</span>
            <a href="#" className="hover:underline">Accessibility Statement</a>
            <span>&middot;</span>
            <a href="#" className="hover:underline">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
