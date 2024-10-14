export function Icon({ name, filled=false, size="lg", className="" }) {
  return (
    <div className={`text-${size} align-middle inline fit-content ${className}`}>
      <ion-icon name={name + (!filled ? "-outline" : "")}></ion-icon>
    </div>
  );
}