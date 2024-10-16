import { SearchField } from "react-aria-components";
import { Icon } from './Icon'

export function Menu() {
  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Icon name="menu" size="4xl"/>
        <img
          src="https://via.placeholder.com/40"
          alt="Brand Logo"
          className="w-10 h-10"
        />
        <span className="text-xl font-semibold text-gray-800">Dédale.tv</span>
      </div>

      <SearchField />

      <div className="flex items-center space-x-6">
        <button aria-label="Notifications" className="text-gray-600 hover:text-gray-800">
          <Icon name="notifications" size="xl"/>
        </button>
        <img
          src="https://via.placeholder.com/40"
          alt="User Avatar"
          className="w-10 h-10 rounded-full"
        />
      </div>
    </header>
  );
}