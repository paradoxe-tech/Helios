export function Icon({ name, filled=false, size="lg", className="", onClick="" }) {
  return (
    <ion-icon 
      class={`text-${size} align-middle rounded-full p-2 inline-block fit-content ${className} cursor-pointer`}
      onClick={onClick}
      name={name + (!filled ? "-outline" : "")}></ion-icon>
  );
}