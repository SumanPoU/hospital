"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChevronDown, ArrowUpRight } from "lucide-react";

const Header = ({ isLoaded: loaderDone = true }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    {
      name: "About Us",
      path: null,
      dropdown: [
        { name: "Our Team", path: "/team" },
        { name: "Our Hospital", path: "/our-hospital" },
        { name: "Mission & Vision", path: "/mission-vision" },
      ],
    },
    {
      name: "Departments",
      path: null,
      dropdown: [
        { name: "Cardiology", path: "/departments/cardiology" },
        { name: "Pediatrics", path: "/departments/pediatrics" },
        { name: "Neurology", path: "/departments/neurology" },
        { name: "Emergency", path: "/departments/emergency" },
      ],
    },
    { name: "Doctors", path: "/doctors" },
    { name: "Contact Us", path: "/contact" },
    { name: "Book Appointment", path: "/book-appointment", button: true },
  ];

  useEffect(() => {
    if (!isHomePage || loaderDone) {
      const timer = setTimeout(() => setIsLoaded(true), 100);
      return () => clearTimeout(timer);
    }
  }, [loaderDone, isHomePage]);

  // Scroll handler
  useEffect(() => {
    let ticking = false;

    const updateScrollState = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
      if (scrollY > lastScrollY && scrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(scrollY);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

  const isActive = (path) => {
    if (!path) return false;
    return pathname === path;
  };

  const isDropdownActive = (dropdown) => {
    if (!dropdown) return false;
    return dropdown.some((item) => pathname === item.path);
  };

  const handleNavigate = (path) => {
    if (path) {
      router.push(path);
      setSheetOpen(false);
      setMobileOpenDropdown(null);
    }
  };

  return (
    <header
      className={`sticky top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${isVisible && isLoaded ? "translate-y-0" : "-translate-y-full"
        } bg-primary text-primary-foreground`}
    >
      <style>{`
        .underline-animation {
          position: relative;
          display: inline-block;
        }
        .underline-animation::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background-color: currentColor;
          transition: width 0.3s ease-in-out;
        }
        .underline-animation:hover::after,
        .underline-animation.active::after {
          width: 100%;
        }
      `}</style>

      <nav className="container max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-0 py-4">
        {/* Logo */}
        <div
          className={`flex items-center transition-all duration-500 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}
          style={{ transitionDelay: isLoaded ? "100ms" : "0ms" }}
        >
          <img
            src="/logo.png"
            alt="Hospital Logo"
            className="cursor-pointer h-8"
            onClick={() => router.push("/")}
          />
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <button
                className={`p-2 focus:outline-none transition-all duration-500 ${isLoaded ? "opacity-100" : "opacity-0"
                  }`}
              >
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[300px] sm:w-[400px] bg-secondary"
            >
              <div className="mt-8 space-y-4">
                {menuItems.map((item) => (
                  <div key={item.name} className="space-y-2">
                    {!item.dropdown ? (
                      <div
                        className={`text-foreground text-lg font-normal cursor-pointer transition-all duration-300 py-2 ${isActive(item.path) ? "font-semibold" : ""
                          }`}
                        onClick={() => handleNavigate(item.path)}
                      >
                        {item.name}
                      </div>
                    ) : (
                      <>
                        <div
                          className={`text-foreground text-lg font-normal cursor-pointer transition-all duration-300 py-2 flex items-center justify-between ${mobileOpenDropdown === item.name
                            ? "font-semibold"
                            : ""
                            }`}
                          onClick={() =>
                            setMobileOpenDropdown(
                              mobileOpenDropdown === item.name
                                ? null
                                : item.name
                            )
                          }
                        >
                          {item.name}
                          <ChevronDown
                            className={`w-5 h-5 transform transition-transform ${mobileOpenDropdown === item.name
                              ? "rotate-180"
                              : ""
                              }`}
                          />
                        </div>
                        {mobileOpenDropdown === item.name && (
                          <div className="ml-4 space-y-2">
                            {item.dropdown.map((d) => (
                              <div
                                key={d.name}
                                className={`text-foreground text-base cursor-pointer transition-all duration-300 py-2 ${isActive(d.path) ? "font-semibold" : ""
                                  }`}
                                onClick={() => handleNavigate(d.path)}
                              >
                                {d.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center justify-center font-sans">
          <ul className="flex gap-6 lg:gap-14 text-lg lg:text-md font-normal items-center">
            {menuItems.map((item, index) => (
              <li
                key={item.name}
                className={`relative cursor-pointer whitespace-nowrap transform transition-all duration-500 ${isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-6"
                  }`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
                onMouseEnter={() =>
                  item.dropdown ? setOpenDropdown(item.name) : null
                }
                onMouseLeave={() =>
                  item.dropdown ? setOpenDropdown(null) : null
                }
              >
                {item.button ? (
                  <button
                    onClick={() => handleNavigate(item.path)}
                    className="relative overflow-hidden font-sans bg-transparent border-2 border-primary-foreground px-2 py-1 text-lg font-normal transition-all duration-300 flex items-center gap-2 z-10 group hover:text-primary"
                  >
                    {" "}
                    {item.name} <ArrowUpRight className="w-6 h-6" />{" "}
                    <div className="absolute top-[140%] size-40 bg-accent rounded-full transform scale-110 -z-10 transition-all duration-300 ease-in-out group-hover:scale-[2] group-hover:bg-primary-foreground"></div>{" "}
                  </button>
                ) : (
                  <span
                    className={`!flex items-center gap-1 underline-animation ${isActive(item.path) || isDropdownActive(item.dropdown)
                      ? "active"
                      : ""
                      }`}
                  >
                    {item.name}
                    {item.dropdown && <ChevronDown className="w-5 h-5 ml-1" />}
                  </span>
                )}

                {/* Desktop Dropdown */}
                {item.dropdown && openDropdown === item.name && (
                  <div className="absolute left-0 top-full w-56 bg-card border border-border shadow-lg z-10">
                    <ul className="py-2">
                      {item.dropdown.map((d) => (
                        <li
                          key={d.name}
                          className={`px-6 py-2 text-foreground cursor-pointer hover:bg-secondary transition duration-200 ${isActive(d.path) ? "bg-muted font-semibold" : ""
                            }`}
                          onClick={() => handleNavigate(d.path)}
                        >
                          {d.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
