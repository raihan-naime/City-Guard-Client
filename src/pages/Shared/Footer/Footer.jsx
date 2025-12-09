const Footer = () => {
  return (
    <footer className="bg-neutral text-neutral-content p-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Column 1 */}
        <aside>
          <h2 className="text-2xl font-bold mb-2">CityGuard</h2>
          <p>
            Public Infrastructure Issue Reporting System <br />
            Providing reliable tech since 2025
          </p>
        </aside>

        {/* Column 2 */}
        <nav className="flex flex-col">
          <h6 className="footer-title">Services</h6>
          <a className="link link-hover">Branding</a>
          <a className="link link-hover">Design</a>
          <a className="link link-hover">Marketing</a>
          <a className="link link-hover">Advertisement</a>
        </nav>

        {/* Column 3 */}
        <nav className="flex flex-col">
          <h6 className="footer-title">Company</h6>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
          <a className="link link-hover">Press kit</a>
        </nav>

        {/* Column 4 */}
        <nav className="flex flex-col">
          <h6 className="footer-title">Legal</h6>
          <a className="link link-hover">Terms of use</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Cookie policy</a>
        </nav>

      </div>
    </footer>
  );
};

export default Footer;
