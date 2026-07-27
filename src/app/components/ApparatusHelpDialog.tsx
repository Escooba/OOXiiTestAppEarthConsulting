import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hand, X, CheckCircle2, ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
import type { ApparatusHelpConfig } from '../help/apparatusHelpConfig';

interface Props {
  open: boolean;
  onClose: () => void;
  config: ApparatusHelpConfig | null;
}

export function ApparatusHelpDialog({ open, onClose, config }: Props) {
  const [viewMode, setViewMode] = useState<'focused' | 'full'>('focused');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset state when modal opens or config changes
  useEffect(() => {
    if (open) {
      setViewMode(config?.focusRegion ? 'focused' : 'full');
      setZoomLevel(1);
      setPanOffset({ x: 0, y: 0 });
    }
  }, [open, config]);

  // Keyboard Escape listener
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open || !config) return null;

  const hasFocusRegion = !!config.focusRegion;
  const isFocusedMode = viewMode === 'focused' && hasFocusRegion;

  // Zoom actions
  const handleZoomIn = () => setZoomLevel((z) => Math.min(3, z + 0.5));
  const handleZoomOut = () => {
    setZoomLevel((z) => {
      const next = Math.max(1, z - 0.5);
      if (next === 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Pointer drag handlers for panning when zoomed
  const handlePointerDown = (e: React.PointerEvent) => {
    if (zoomLevel <= 1 && !isFocusedMode) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: panOffset.x,
      panY: panOffset.y,
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPanOffset({
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    }
  };

  // Calculate crop transform for focused mode
  const focus = config.focusRegion;
  let transformStyle: React.CSSProperties = {};

  if (isFocusedMode && focus) {
    const scale = 100 / focus.widthPercent;
    const originX = focus.xPercent + focus.widthPercent / 2;
    const originY = focus.yPercent + focus.heightPercent / 2;

    transformStyle = {
      transformOrigin: `${originX}% ${originY}%`,
      transform: `scale(${scale * zoomLevel}) translate(${panOffset.x / scale}px, ${panOffset.y / scale}px)`,
    };
  } else {
    transformStyle = {
      transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
    };
  }

  const highlights = config.highlightRegions || config.highlights || [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="apparatus-help-title"
      >
        <motion.div
          initial={{ scale: 0.92, y: 16 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.92, y: 16 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[440px] bg-[var(--card)] text-[var(--text)] rounded-3xl overflow-hidden border border-[var(--card-border)] shadow-2xl flex flex-col max-h-[92vh]"
        >
          {/* Dialog Header */}
          <div className="p-3.5 sm:p-4 flex justify-between items-center border-b border-[var(--card-border)] bg-[var(--bg)]/50">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="w-8 h-8 rounded-full bg-[var(--primary)]/15 border border-[var(--primary)]/40 flex items-center justify-center text-[var(--primary)] shrink-0">
                <Hand size={16} />
              </div>
              <h3 id="apparatus-help-title" className="font-semibold text-[var(--text)] text-base truncate">
                {config.title}
              </h3>
            </div>
            <button
              type="button"
              aria-label="Close help modal"
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-[var(--bg)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors shrink-0"
            >
              <X size={20} />
            </button>
          </div>

          {/* Dialog Content Area */}
          <div className="p-3.5 sm:p-4 flex-1 overflow-y-auto flex flex-col gap-3.5">
            {/* Toolbar for View Mode & Zoom Controls */}
            <div className="flex items-center justify-between gap-2 flex-wrap bg-[var(--bg)]/60 p-2 rounded-2xl border border-[var(--card-border)]">
              {/* View Toggle */}
              {hasFocusRegion && (
                <button
                  type="button"
                  onClick={() => {
                    setViewMode(isFocusedMode ? 'full' : 'focused');
                    handleResetZoom();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--card)] border border-[var(--primary)]/40 text-[var(--primary)] text-xs font-bold hover:bg-[var(--card-active)] transition-colors min-h-[36px]"
                >
                  {isFocusedMode ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
                  <span>{isFocusedMode ? 'View full chart' : 'Focused view'}</span>
                </button>
              )}

              {/* Zoom controls */}
              <div className="flex items-center gap-1 ml-auto">
                <button
                  type="button"
                  aria-label="Zoom out"
                  disabled={zoomLevel <= 1}
                  onClick={handleZoomOut}
                  className="w-9 h-9 rounded-xl bg-[var(--card)] border border-[var(--card-border)] text-[var(--text)] flex items-center justify-center disabled:opacity-30 hover:border-[var(--primary)] transition-colors"
                >
                  <ZoomOut size={15} />
                </button>
                <span className="text-xs font-mono font-bold text-[var(--text-muted)] px-1.5">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  aria-label="Zoom in"
                  disabled={zoomLevel >= 3}
                  onClick={handleZoomIn}
                  className="w-9 h-9 rounded-xl bg-[var(--card)] border border-[var(--card-border)] text-[var(--text)] flex items-center justify-center disabled:opacity-30 hover:border-[var(--primary)] transition-colors"
                >
                  <ZoomIn size={15} />
                </button>
                {zoomLevel > 1 && (
                  <button
                    type="button"
                    aria-label="Reset zoom"
                    onClick={handleResetZoom}
                    className="w-9 h-9 rounded-xl bg-[var(--card)] border border-[var(--card-border)] text-[var(--text)] flex items-center justify-center hover:border-[var(--primary)] transition-colors ml-1"
                  >
                    <RotateCcw size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Apparatus Image Box */}
            <div
              ref={containerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className={`relative w-full aspect-[4/3] bg-white rounded-2xl border border-[var(--card-border)] overflow-hidden flex items-center justify-center select-none ${
                zoomLevel > 1 || isFocusedMode ? 'cursor-grab active:cursor-grabbing' : ''
              }`}
            >
              <div
                style={transformStyle}
                className="relative w-full h-full flex items-center justify-center transition-transform duration-150 ease-out"
              >
                <div className="relative inline-block max-w-full max-h-full">
                  <img
                    src={config.imageSrc}
                    alt={config.imageAlt}
                    decoding="async"
                    fetchPriority="high"
                    className="w-auto h-auto max-w-full max-h-full block object-contain"
                  />

                  {/* High-Contrast Red Highlight Bounding Boxes (No Text Overlaying Symbols, No Blurry Glows) */}
                  {highlights.map((h) => (
                    <div
                      key={h.id}
                      style={{
                        left: `${h.xPercent}%`,
                        top: `${h.yPercent}%`,
                        width: `${h.widthPercent}%`,
                        height: `${h.heightPercent}%`,
                      }}
                      className="absolute border-2 border-red-600 bg-red-500/10 rounded-md pointer-events-none z-10"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* External Caption (Rendered outside the chart canvas) */}
            {config.highlightCaption && (
              <div className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0 animate-pulse" />
                <span>{config.highlightCaption}</span>
              </div>
            )}

            {/* Tester Instruction Callout Box */}
            <div className="bg-[var(--bg)] border border-[var(--card-border)] rounded-2xl p-4 flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--primary)] flex items-center gap-1.5">
                <CheckCircle2 size={13} />
                Tester Instructions
              </span>
              <p className="text-sm text-[var(--text)] leading-relaxed font-normal">
                {config.instruction}
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-4 border-t border-[var(--card-border)] bg-[var(--bg)]/30">
            <button
              type="button"
              onClick={onClose}
              className="w-full min-h-[48px] rounded-2xl bg-[var(--primary)] text-[#091522] font-bold text-base hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_4px_16px_rgba(59,224,212,0.3)]"
            >
              Got it
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
