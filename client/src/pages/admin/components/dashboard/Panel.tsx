import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { MoreHorizontal, Maximize2 } from "lucide-react";

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  children: ReactNode;
  panelId: string;
  openPanelMenu: string | null;
  setOpenPanelMenu: (value: string | null) => void;
  onView?: () => void; // Prop mới để gọi màn hình Full-screen
}

export const Panel = forwardRef<HTMLDivElement, PanelProps>(
  ({ title, subtitle, children, panelId, openPanelMenu, setOpenPanelMenu, onView, className, ...rest }, ref) => {
    const isOpen = openPanelMenu === panelId;

    return (
      <div ref={ref} className={`panel ${className ?? ""}`} {...rest}>
        <div className="panel-header">
          <div className="panel-heading">
            <h3 className="panel-title">{title}</h3>
            {subtitle ? <p className="panel-subtitle">{subtitle}</p> : null}
          </div>
          
          <div className="panel-options-wrap">
            <button
              type="button"
              className="panel-options-trigger"
              onClick={() => setOpenPanelMenu(isOpen ? null : panelId)}
            >
              <MoreHorizontal size={16} />
            </button>

            {/* Menu giờ chỉ có 1 nút: View fullscreen */}
            {isOpen && (
              <div className="panel-options-menu">
                <button
                  type="button"
                  className="panel-option-item"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => {
                    setOpenPanelMenu(null); // Đóng menu
                    onView?.(); // Mở full-screen
                  }}
                >
                  <Maximize2 size={14} />
                  View fullscreen
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="panel-body">{children}</div>

        <span
          className="panel-drag-handle panel-grip"
          role="button"
          aria-label={`Drag to move ${title} panel`}
          title="Drag to move"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <circle cx="3" cy="3" r="1.4" />
            <circle cx="10" cy="3" r="1.4" />
            <circle cx="3" cy="7" r="1.4" />
            <circle cx="10" cy="7" r="1.4" />
            <circle cx="3" cy="11" r="1.4" />
            <circle cx="10" cy="11" r="1.4" />
          </svg>
        </span>
      </div>
    );
  },
);

Panel.displayName = "Panel";