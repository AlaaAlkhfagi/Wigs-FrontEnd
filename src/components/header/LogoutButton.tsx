import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "react-toastify";
import Link from "next/link"; // Importing Link

interface LogoutButtonProps {
  onLogout: () => void; // Define the type for onLogout prop
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const logoutHandler = async () => {
    try {
      // Remove token from localStorage
      localStorage.removeItem('token');
      // Optionally, remove other related items
      localStorage.removeItem('anotherItem');

      // Call onLogout callback
      if (onLogout) onLogout();

      // Reload the page
      window.location.reload();

      // Redirect to the home page
      router.push("/");
    } catch (error) {
      toast.warning("Something went wrong");
      console.log(error);
    }
  };

  return (
    <div className="relative inline-block ml-10">
      <Avatar onClick={toggleMenu} className="cursor-pointer mr-2">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      {showMenu && (
        <div className="absolute right-0 mt-2 w-30 bg-white border border-gray-600 rounded-lg shadow-lg">
          <p className="w-full px-8 py-2 text-center text-gray-800 bg-gray-400 hover:bg-gray-200 rounded-t-lg">Profile</p>

          {/* Register button, appears if there's no token */}
          <Link href="/register">
            <button className="w-full px-8 py-2 text-center text-gray-800 bg-gray-400 hover:bg-gray-200">
              Register
            </button>
          </Link>

          {/* Logout button */}
          <button
            onClick={logoutHandler}
            className="w-full px-8 py-2 text-center text-gray-800 bg-gray-400 hover:bg-gray-200 rounded-b-lg"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default LogoutButton;
