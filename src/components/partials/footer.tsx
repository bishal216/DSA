import { iconMap } from "@/utils/iconmap";

export default function Footer() {
  return (
    <footer className="py-4 px-2 text-center border-t border-gray-300">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2 text-gray-600">
          <span>Made with</span>
          <iconMap.Heart className="size-4 text-red-500" />
          <span>for learning</span>
        </div>

        <div className="text-gray-600">© 2024 DSAnotes</div>
      </div>
    </footer>
  );
}
