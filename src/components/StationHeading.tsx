interface StationHeadingProps {
  kicker: string;
  title: string;
  lead: string;
}

export function StationHeading({ kicker, title, lead }: StationHeadingProps) {
  return (
    <header className="station-heading">
      <p className="section-kicker">{kicker}</p>
      <h1 id="station-title" tabIndex={-1}>
        {title}
      </h1>
      <p>{lead}</p>
    </header>
  );
}
