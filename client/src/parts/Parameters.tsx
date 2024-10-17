import { useState } from 'react';
import { Icon } from "./Icon";

export function Parameters({ parameters, setParameters }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSliderChange = (param: string, value: number) => {
    setParameters((prevParams) => ({
      ...prevParams,
      [param]: value,
    }));
  };

  return (
    <div className={`relative rounded-full inline-block fit-content hover:bg-gray-200 ${isOpen ? 'bg-gray-200': ''}`} >
      <Icon name="settings" filled={isOpen} size="xl" onClick={() => setIsOpen(!isOpen)} />

      {isOpen && (
        <div className="absolute top-10 right-0 bg-white p-4 shadow-lg rounded-lg z-10 w-52">
          <h4 className="text-sm font-semibold mb-2">Ajuster vos coefficients</h4>
          <div className="mb-2">
            <label className="text-xs">Appréciation</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.025}
              value={parameters.lA}
              onChange={(e) => handleSliderChange('lA', Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="mb-2">
            <label className="text-xs">Recommandabilité</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.025}
              value={parameters.lU}
              onChange={(e) => handleSliderChange('lU', Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="mb-2">
            <label className="text-xs">Performance</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.025}
              value={parameters.lG}
              onChange={(e) => handleSliderChange('lG', Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}