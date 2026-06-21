import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa6";

function Footer() {
  return (
    <footer className="mt-10 bg-teal-800 text-teal-50">
      <div className="mx-auto max-w-7xl px-5 py-6 md:px-8">
        {/* Social Icons */}
        <div className="flex justify-center items-center gap-3">
          <a
            href="#"
            aria-label="Facebook"
            className="flex h-10 w-10 items-center justify-center rounded-md bg-[#1877F2] text-white transition hover:-translate-y-0.5 hover:opacity-90"
          >
            <FaFacebookF size={18} />
          </a>

          <a
            href="#"
            aria-label="Instagram"
            className="flex h-10 w-10 items-center justify-center rounded-md bg-linear-to-tr from-[#F58529] via-[#DD2A7B] to-[#515BD4] text-white transition hover:-translate-y-0.5 hover:opacity-90"
          >
            <FaInstagram size={19} />
          </a>

          <a
            href="#"
            aria-label="LinkedIn"
            className="flex h-10 w-10 items-center justify-center rounded-md bg-[#0A66C2] text-white transition hover:-translate-y-0.5 hover:opacity-90"
          >
            <FaLinkedinIn size={18} />
          </a>

          <a
            href="#"
            aria-label="YouTube"
            className="flex h-10 w-10 items-center justify-center rounded-md bg-[#FF0000] text-white transition hover:-translate-y-0.5 hover:opacity-90"
          >
            <FaYoutube size={20} />
          </a>
        </div>

        <p className="pt-5 text-center text-sm text-teal-200 md:text-base">
          © 2026 TravelTrail. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
