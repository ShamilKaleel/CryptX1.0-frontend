import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import Logo from "@/assets/images/Logo.png";
import { ModeToggle } from "./mode-toggle";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = [
    {
      title: "Home",
      path: "/",
    },
    {
      title: "About Us",
      path: "/about",
    },
    {
      title: "Services",
      path: "/services",
    },
    {
      title: "Contact Us",
      path: "/contact",
    },
  ];

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };
  return (
    <header className=" fixed  w-full flex justify-between items-center py-5  px-5 z-30  transition-all border-b  border-color-border ">
      <Link to="/" className="flex items-center gap-1  duration-300">
        <img src={Logo} alt="Logo" />
        <span className="font-bold text-2xl pl-1 text-primary">
          AgriConnect
        </span>
      </Link>

      <ul
        className={`flex lg:flex-row flex-col gap-5  absolute duration-200  lg:items-center ${
          isMenuOpen ? "top-[92px]" : "top-[-1500px]"
        } left-0 w-full h-screen lg:h-auto lg:static lg:w-auto lg:bg-transparent py-5 lg:py-0 pl-5 lg:pl-0`}
      >
        {navLinks.map((navLink, index) => (
          <li key={index}>
            <NavLink
              to={navLink.path}
              className={({ isActive }) =>
                isActive
                  ? "text-primary font-semibold transition-all underline underline-offset-8 "
                  : "text-muted-foreground hover:text-primary transition-all "
              }
              onClick={toggleMenu}
            >
              {navLink.title}
            </NavLink>
          </li>
        ))}
        <Link
          to="/myBooking"
          className="text-primary  px-8 py-2   hover:bg-primary-dark transition-all rounded-lg block lg:hidden   absolute left-5 right-5 bottom-[205px] text-center border-2 border-primary hover:border-gray-500"
          onClick={toggleMenu}
        >
          My Booking
        </Link>
        <Link
          to="/booking"
          className="bg-primary text-white px-8 py-2   hover:bg-primary-dark transition-all rounded-lg block lg:hidden   absolute left-5 right-5 bottom-40 text-center"
          onClick={toggleMenu}
        >
          Book Now
        </Link>
      </ul>
      <div className="flex items-center  font-semibold gap-5 ">
        <Link
          to="/myBooking"
          className=" text-primary px-8 py-[6px]  hover:text-gray-500 transition-all rounded-lg hidden lg:block  border-2 border-primary hover:border-gray-500"
        >
          My Booking
        </Link>

        <Link
          to="/booking"
          className="bg-primary text-white px-8 py-2  hover:bg-primary-dark transition-all rounded-lg hidden lg:block"
        >
          Doctor Appointment
        </Link>

        <ModeToggle />
      </div>

      <button className="lg:hidden" onClick={toggleMenu}>
        {/* <ion-icon name={isMenuOpen ? "close" : "menu"}></ion-icon> */}
      </button>
    </header>
  );
}
