import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // 🧹 Remove token
    navigate("/"); // 🚀 Redirect to landing page
  };

  return (
    <header className="border-b border-border p-4 flex justify-between items-center">
      <Link
        to="/"
        className="flex items-center cursor-pointer transition-transform duration-300 hover:scale-105 hover:opacity-90"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="32"
          height="32"
          className="mr-2 fill-white"
        >
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
      2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 
      3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 
      8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>

        <h1 className="text-xl font-bold font-mono text-white">UnLovable.ai</h1>
      </Link>

      <div className="flex items-center space-x-2">
        {/* <Button variant="outline" size="sm">Share</Button>
        <Button size="sm">Publish</Button> */}

        {/* Logout Button */}
        <Button
          variant="destructive"
          size="sm"
          onClick={handleLogout}
          className="bg-white text-black font-semibold px-2 py-2 rounded-md hover:bg-gray-200 transition"
        >
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
