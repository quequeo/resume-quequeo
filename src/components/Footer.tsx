const Footer = () => {
  return (
    <footer className="bg-light text-center text-lg-start mt-auto">
      <div className="text-center p-3" style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}>
        <span>© {new Date().getFullYear()} Resume AI</span> - Hosted with ❤️
      </div>
    </footer>
  );
};

export default Footer;
