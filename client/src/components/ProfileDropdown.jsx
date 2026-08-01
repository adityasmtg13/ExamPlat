import { Link } from "react-router-dom";
import {
  FaUserCircle,
  FaUser,
  FaTachometerAlt,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

function ProfileDropdown({
  student,
  logout,
  closeDropdown,
}) {
  const avatar = student?.profilePhoto || null;

  return (
    <div className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-fade">

      {/* Arrow */}
      <div className="absolute -top-2 right-8 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-200"></div>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-5 flex items-center gap-4">

        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white bg-white flex items-center justify-center">
            {avatar ? (
                <img
                src={avatar}
                alt="Profile"
                className="w-full h-full object-cover"
                />
            ) : (
                <FaUserCircle className="text-6xl text-blue-600" />
            )}
        </div>

        <div>
          <h3 className="font-bold text-lg">
            {student?.name}
          </h3>

          <p className="text-sm text-blue-100">
            {student?.email}
          </p>
        </div>
      </div>

      {/* Menu */}
      <div className="py-2">

        <Link
          to="/dashboard"
          onClick={closeDropdown}
          className="flex items-center gap-4 px-6 py-3
            text-gray-800
            hover:bg-blue-50
            hover:text-blue-700
            font-medium
            transition"
        >
          <FaTachometerAlt className="text-gray-800" />
          Dashboard
        </Link>

        <Link
          to="/profile"
          onClick={closeDropdown}
          className="flex items-center gap-4 px-6 py-3
            text-gray-800
            hover:bg-blue-50
            hover:text-blue-700
            font-medium
            transition"
        >
          <FaUser className="text-gray-800" />
          My Profile
        </Link>

        <Link
          to="/settings"
          onClick={closeDropdown}
          className="w-full flex items-center gap-4 px-6 py-3 text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition text-left font-medium"
        >
          <FaCog className="text-gray-600" />
          <span>Settings</span>
          <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            Secure
          </span>
        </Link>

      </div>

      <hr />

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full flex items-center gap-4 px-6 py-4 text-red-600 hover:bg-red-50 font-semibold transition"
      >
        <FaSignOutAlt />
        Logout
      </button>

    </div>
  );
}

export default ProfileDropdown;