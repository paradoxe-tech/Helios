import { Icon } from './Icon'

export function Sidebar() {
  return (
    <aside className="bg-white p-4 w-72 transition-all duration-300 shadow-md h-screen">
      <nav className="vertical-menu">
        <ul className="space-y-2">
          <MenuItem icon="home" label="Recommandations" />
          <MenuItem icon="heart" label="Abonnements" />
          <MenuItem icon="time" label="Historique" />
          <MenuItem icon="reload" label="À regarder plus tard" />
          <hr/>
        </ul>
      </nav>
    </aside>
  );
}

function MenuItem({ label, icon }) {
  return (
    <li className="p-3 py-2 text-sm cursor-pointer hover:bg-gray-200 rounded-lg transition">
      <Icon name={icon} className="pr-4"/>
      {label}
    </li>
  );
}