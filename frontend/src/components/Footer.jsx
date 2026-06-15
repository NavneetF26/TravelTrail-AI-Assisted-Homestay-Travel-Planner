function Footer() {
  return (
    <footer className="bg-teal-100 mt-10 py-8">
      <div className="max-w-5xl mx-auto px-4 text-center">
        {/* NAV LINKS */}
        <div className="flex flex-wrap justify-center gap-6 font-medium text-teal-950 text-base">
          <a href="/about" className="hover:underline transition">
            About
          </a>
          <a href="/contact" className="hover:underline transition">
            Contact
          </a>
          <a href="#" className="hover:underline transition">
            Privacy
          </a>
        </div>

        {/* DIVIDER */}
        <div className="my-5 h-px bg-teal-600 w-full opacity-70"></div>

        {/* SOCIAL LINKS */}
        <div className="flex flex-wrap justify-center gap-6 text-teal-900 text-base">
          <a href="#" className="hover:text-blue-700 transition">
            Instagram
          </a>
          <a href="#" className="hover:text-blue-700 transition">
            Facebook
          </a>
          <a href="#" className="hover:text-blue-700 transition">
            X
          </a>
        </div>

        {/* COPYRIGHT */}
        <p className="mt-5 text-teal-700 text-sm md:text-base font-medium">
          © 2026 TravelTrail. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
