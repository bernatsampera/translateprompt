import Bleaksvg from "../assets/bleak_transparent.svg";
import type {NavItem} from "../types/navigation";
import Waitlist from "./Waitlist";

interface HeaderProps {
  navItems: NavItem[];
}

function Header({navItems}: HeaderProps) {
  return (
    <header className="navbar bg-base-200 shadow-lg">
      <div className="navbar-start">
        {/* <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <Menu className="w-5 h-5" />
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div> */}
        <div className="flex items-center gap-1">
          <img src={Bleaksvg} alt="Bleak" className="h-8 w-8" />
          <a className="btn btn-ghost text-xl font-bold">TranslatePrompt</a>
        </div>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="font-medium">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="hidden lg:flex navbar-end">
        <Waitlist />
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost btn-circle"
        ></a>
      </div>
    </header>
  );
}

export default Header;
