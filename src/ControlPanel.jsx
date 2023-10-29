import { colors } from "./colors";
import { colorToCostMapping } from "./colors";

function ControlPanel({
  selectedColor,
  onColorSelect,
  diameter,
  onDiameterChange,
  animationSpeed,
  onSpeedChange,
  onResetGraph,
  onGenerateMaze,
  onGenerateTerrain,
  animationRunning,
}) {
  return (
    <div className="control-panel-container">
      <div className="control-panel">
        <p className="color-picker-label">
          Select a color to visually indicate the expense or difficulty of
          traversing through this particular point.
        </p>
        <div className="color-picker">
          {colors.map((color, index) => (
            <div key={index} className="color-picker-box">
              <div
                key={color}
                className="color-box"
                style={{
                  backgroundColor: color,
                  border: color === selectedColor ? "2px solid black" : "none",
                }}
                onClick={() => onColorSelect(color)}
              />
              <p>
                {colorToCostMapping[color] === Infinity
                  ? "∞"
                  : colorToCostMapping[color]}
              </p>
            </div>
          ))}
        </div>
        <div className="slider-container">
          <label htmlFor="diameter-slider">Grid Size:</label>
          <input
            type="range"
            id="diameter-slider"
            min="9"
            max="21"
            step="2"
            value={diameter}
            onChange={(e) => onDiameterChange(Number(e.target.value))}
          />
        </div>
        <div className="slider-container">
          <label htmlFor="speed-slider">Animation Speed:</label>
          <input
            type="range"
            id="speed-slider"
            min="0"
            max="100"
            value={animationSpeed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="control-panel-buttons">
        <button disabled={animationRunning} onClick={onGenerateMaze}>
          Create maze
        </button>
        <button disabled={animationRunning} onClick={onGenerateTerrain}>
          Create terrain
        </button>
        <button disabled={animationRunning} onClick={onResetGraph}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default ControlPanel;
