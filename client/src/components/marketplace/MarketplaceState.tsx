import "./MarketplaceState.css";

type MarketplaceStateProps = {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
};

export default function MarketplaceState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  compact = false,
}: MarketplaceStateProps) {
  return (
    <div className={`marketplace-state${compact ? " compact" : ""}`}>
      <div className="marketplace-state-icon" aria-hidden="true">{icon}</div>
      <h2>{title}</h2>
      <p>{description}</p>
      {actionLabel && onAction && (
        <button type="button" onClick={onAction}>{actionLabel}</button>
      )}
    </div>
  );
}
