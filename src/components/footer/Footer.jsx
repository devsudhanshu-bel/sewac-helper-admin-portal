import logo from "../../assets/Company Logo.png";

const Footer = () => {
  return (
    <footer
      className="
        px-6
        py-2

        bg-gradient-to-r
        from-[#311b92]
        via-[#4527a0]
        to-[#5e35b1]
      "
    >
      <div className="flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-2 text-white text-[13px] font-medium">
          <span>©</span>

          <span>Sewac Helper 2026</span>
        </div>

        {/* RIGHT */}
        <img
          src={logo}
          alt="Eco Paradigm"
          className="
    h-8
    w-auto
    object-contain
  "
        />
      </div>
    </footer>
  );
};

export default Footer;
