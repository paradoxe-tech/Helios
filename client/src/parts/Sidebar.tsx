import { Icon } from './Icon'

export function Sidebar({ scores }) {
  return (
    <aside className="bg-white p-4 w-72 transition-all duration-300">
      <nav className="vertical-menu">
        <ul className="space-y-2">
          <MenuItem icon="home" label="Recommandations" />
          <MenuItem icon="heart" label="Abonnements" />
          <MenuItem icon="time" label="Historique" />
          <MenuItem icon="reload" label="À regarder plus tard" />
          <hr/>
          <ScoreBadge label="Score total" color="grey" score={scores.score} />
          <ScoreBadge label="Appréciation " color="orange" score={scores.predicted_appreciation} />
          <ScoreBadge label="Recommandabilité" color="yellow" score={scores.tournesol_recommendability} />
          <ScoreBadge label="Performance" color="red" score={scores.platform_performance} />
        </ul>
      </nav>
    </aside>
  );
}

function ScoreBadge({ label, score, color }) {
  return (
    <li className="p-3 py-2 text-sm flex items-center gap-4 cursor-pointer transition-all duration-500 bg-white rounded-lg">
      <div
        className="relative flex items-center justify-center w-4 h-4 rounded-full"
        style={{
          background: `conic-gradient(black ${score * 360}deg, #e5e7eb 0deg)`,
        }}
      >
        <div className="absolute w-3 h-3 bg-white rounded-full"></div>
      </div>
      <div>
        <span className="text-sm">{label}</span>
      </div>
    </li>
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