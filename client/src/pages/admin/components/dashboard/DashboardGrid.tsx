import { useCallback } from "react";
import type { ReactNode } from "react";
import { Responsive, WidthProvider } from "react-grid-layout/legacy";
import type { Layout, ResponsiveLayouts } from "react-grid-layout/legacy";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

/**
 * Re-exported so other files (e.g. Dashboard.tsx) don't need to import
 * directly from react-grid-layout/legacy themselves.
 */
export type Layouts = ResponsiveLayouts<string>;

const BREAKPOINTS = { lg: 1200, md: 900, sm: 620 };
const COLS = { lg: 12, md: 8, sm: 4 };

export interface DashboardGridProps {
  children: ReactNode;
  layouts: Layouts;
  onLayoutChange?: (layout: Layout, layouts: Layouts) => void;
  /** When provided, layout changes are persisted to localStorage under this key. */
  storageKey?: string;
  rowHeight?: number;
}

export function DashboardGrid({
  children,
  layouts,
  onLayoutChange,
  storageKey,
  rowHeight = 64,
}: DashboardGridProps) {
  const handleLayoutChange = useCallback(
    (layout: Layout, allLayouts: Layouts) => {
      onLayoutChange?.(layout, allLayouts);
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(allLayouts));
        } catch {
          // ignore quota/serialization errors — persistence is a nice-to-have
        }
      }
    },
    [onLayoutChange, storageKey],
  );

  return (
    <ResponsiveGridLayout
      className="dashboard-grid"
      layouts={layouts}
      breakpoints={BREAKPOINTS}
      cols={COLS}
      rowHeight={rowHeight}
      margin={[20, 20]}
      containerPadding={[0, 0]}
      draggableHandle=".panel-drag-handle"
      resizeHandles={["se"]}
      onLayoutChange={handleLayoutChange}
    >
      {children}
    </ResponsiveGridLayout>
  );
}

/** Reads a previously saved layout for `storageKey`, falling back to `fallback`. */
export function loadDashboardLayouts(storageKey: string, fallback: Layouts): Layouts {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as Layouts) : fallback;
  } catch {
    return fallback;
  }
}