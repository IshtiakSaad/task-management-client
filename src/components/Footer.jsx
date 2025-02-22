const Footer = () => {
  return (
    <footer className="w-full px-6 py-4 border-t bg-gray-900/80 backdrop-blur-md shadow-md text-center text-sm text-gray-400">
      <p>
        &copy; {new Date().getFullYear()} Task Manager. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
