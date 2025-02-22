const Footer = () => {
    return (
      <footer className="w-full px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-700 bg-gray-900/80 backdrop-blur-md shadow-md text-center text-xs sm:text-sm text-gray-400 flex flex-col sm:flex-row justify-center items-center gap-2">
        <p>&copy; {new Date().getFullYear()} Task Manager. All Rights Reserved.</p>
      </footer>
    );
  };
  
  export default Footer;
  