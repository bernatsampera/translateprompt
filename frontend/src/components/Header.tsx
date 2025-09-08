import {Menu, Settings} from "lucide-react";
import {Link} from "react-router-dom";
import Bleaksvg from "../assets/bleak_transparent.svg";
import type {NavItem} from "../types/navigation";

interface HeaderProps {
  navItems: NavItem[];
  loggedIn?: boolean;
  onLogout?: () => void;
}

function Header({navItems, loggedIn = false, onLogout}: HeaderProps) {
  return (
    <header className="navbar bg-base-200 shadow-lg">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost md:hidden">
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
        </div>
        <div className="flex items-center gap-1">
          <img src={Bleaksvg} alt="Bleak" className="h-8 w-8" />
          <a className="btn btn-ghost text-lg md:text-xl font-bold" href="/">
            TranslatePrompt
          </a>
        </div>
      </div>
      <div className="navbar-center hidden md:flex">
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
      <div className="flex navbar-end gap-2">
        {loggedIn ? (
          <>
            <Link to="/settings" className="btn btn-outline btn-sm">
              <Settings className="w-4 h-4" />
            </Link>
            <button onClick={onLogout} className="btn btn-outline btn-sm">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/auth" className="btn btn-primary btn-sm">
              Login
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
