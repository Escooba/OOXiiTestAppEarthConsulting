import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hand, X, CheckCircle2, ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2, Info } from 'lucide-react';
import type { ApparatusHelpConfig } from '../help/apparatusHelpConfig';
import { calculateFocusTransform, clampPanOffset, type Size } from '../help/cropGeometry';
import { useTheme } from '../lib/ThemeContext';

interface Props {
  open: boolean;
  onClose: () => void;
  config: ApparatusHelpConfig | null;
}

export function ApparatusHelpDialog({ open, onClose, config }: Props) {
  const { t } = useTheme();
  const [viewMode, setViewMode] = useState<'focused' | 'full'>('focused');
  const [userZoom, setUserZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [imageSize, setImageSize] = useState<Size>({ width: 447, height: 447 });
  const [viewportSize, setViewportSize] = useState<Size>({ width: 360, height: 270 });

  const triggerRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  // Reset state and trap focus on modal open
  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement as HTMLElement;
      setViewMode(config?.focusRegion ? 'focused' : 'full');
      setUserZoom(1);
      setPanOffset({ x: 0, y: 0 });

      // Disable body scrolling while modal is open
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Focus close button inside modal
      setTimeout(() => closeButtonRef.current?.focus(), 50);

      return () => {
        document.body.style.overflow = prevOverflow;
        triggerRef.current?.focus();
      };
    }
  }, [open, config]);

  // Update viewport size measurement on resize
  useEffect(() => {
    if (!open || !viewportRef.current) return;
    const updateSize = () => {
      if (viewportRef.current) {
        const rect = viewportRef.current.getBoundingClientRect();
        setViewportSize({ width: rect.width || 360, height: rect.height || 270 });
      }
    };
    updateSize();

    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [open]);

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

  const hasFocusRegion = !!config.focusRegion && config.focusRegion.widthPercent > 0;
  const isFocusedMode = viewMode === 'focused' && hasFocusRegion;

  // Zoom actions
  const handleZoomIn = () => setUserZoom((z) => Math.min(2.5, z + 0.3));
  const handleZoomOut = () => {
    setUserZoom((z) => {
      const next = Math.max(1, z - 0.3);
      if (next === 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };
  const handleResetZoom = () => {
    setUserZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Pointer drag handlers for panning
  const handlePointerDown = (e: React.PointerEvent) => {
    if (userZoom <= 1 && !isFocusedMode) return;
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
    const rawOffset = {
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy,
    };

    const baseScale = isFocusedMode && config.focusRegion
      ? calculateFocusTransform(imageSize, viewportSize, config.focusRegion).scale
      : 1;

    const scaledImageSize = {
      width: viewportSize.width * baseScale * userZoom,
      height: viewportSize.height * baseScale * userZoom,
    };

    setPanOffset(clampPanOffset(rawOffset, scaledImageSize, viewportSize));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {
        // Ignore if pointer capture release throws
      }
    }
  };

  // Calculate base focus transform
  let baseTransform = { scale: 1, translateX: 0, translateY: 0 };
  if (isFocusedMode && config.focusRegion) {
    baseTransform = calculateFocusTransform(imageSize, viewportSize, config.focusRegion);
  }

  const finalScale = baseTransform.scale * userZoom;
  const finalX = baseTransform.translateX + panOffset.x;
  const finalY = baseTransform.translateY + panOffset.y;

  const stageStyle: React.CSSProperties = {
    transform: `translate(${finalX}px, ${finalY}px) scale(${finalScale})`,
    transformOrigin: 'center center',
  };

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
        aria-describedby="apparatus-help-instruction"
      >
        <motion.div
          initial={{ scale: 0.94, y: 12 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.94, y: 12 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[440px] bg-[var(--card)] text-[var(--text)] rounded-3xl overflow-hidden border border-[var(--card-border)] shadow-2xl flex flex-col max-h-[92vh] safe-area-padding"
        >
          {/* Dialog Header */}
          <div className="p-3.5 sm:p-4 flex justify-between items-center border-b border-[var(--card-border)] bg-[var(--bg)]/50 gap-2">
            <div className="flex items-center gap-2.5 min-w-0 pr-1">
              <div className="w-8 h-8 rounded-full bg-[var(--primary)]/15 border border-[var(--primary)]/40 flex items-center justify-center text-[var(--primary)] shrink-0">
                <Hand size={16} />
              </div>
              <h3 id="apparatus-help-title" className="font-semibold text-[var(--text)] text-base leading-tight break-words">
                {config.title}
              </h3>
            </div>
            <button
              ref={closeButtonRef}
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
            {/* Asset Notice Badge for Illustrations */}
            {config.assetNotice && (
              <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold flex items-center gap-2">
                <Info size={14} className="shrink-0" />
                <span>{config.assetNotice}</span>
              </div>
            )}

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
                  className="flex items-center gap-1.5 px-3.5 min-h-[44px] rounded-xl bg-[var(--card)] border border-[var(--primary)]/40 text-[var(--primary)] text-xs font-bold hover:bg-[var(--card-active)] transition-colors"
                >
                  {isFocusedMode ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
                  <span>{isFocusedMode ? t('ui.view_full_chart') : t('ui.focused_view')}</span>
                </button>
              )}

              {/* Zoom controls (Touch target min 44x44px) */}
              <div className="flex items-center gap-1 ml-auto">
                <button
                  type="button"
                  aria-label="Zoom out"
                  disabled={userZoom <= 1}
                  onClick={handleZoomOut}
                  className="min-w-[44px] min-h-[44px] rounded-xl bg-[var(--card)] border border-[var(--card-border)] text-[var(--text)] flex items-center justify-center disabled:opacity-30 hover:border-[var(--primary)] transition-colors"
                >
                  <ZoomOut size={16} />
                </button>
                <span className="text-xs font-mono font-bold text-[var(--text-muted)] px-1">
                  {Math.round(userZoom * 100)}%
                </span>
                <button
                  type="button"
                  aria-label="Zoom in"
                  disabled={userZoom >= 2.5}
                  onClick={handleZoomIn}
                  className="min-w-[44px] min-h-[44px] rounded-xl bg-[var(--card)] border border-[var(--card-border)] text-[var(--text)] flex items-center justify-center disabled:opacity-30 hover:border-[var(--primary)] transition-colors"
                >
                  <ZoomIn size={16} />
                </button>
                {userZoom > 1 && (
                  <button
                    type="button"
                    aria-label="Reset zoom"
                    onClick={handleResetZoom}
                    className="min-w-[44px] min-h-[44px] rounded-xl bg-[var(--card)] border border-[var(--card-border)] text-[var(--text)] flex items-center justify-center hover:border-[var(--primary)] transition-colors ml-0.5"
                  >
                    <RotateCcw size={15} />
                  </button>
                )}
              </div>
            </div>

            {/* Apparatus Crop Viewport */}
            <div
              ref={viewportRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className={`relative w-full aspect-[4/3] bg-white rounded-2xl border border-[var(--card-border)] overflow-hidden flex items-center justify-center select-none touch-none ${
                userZoom > 1 || isFocusedMode ? 'cursor-grab active:cursor-grabbing' : ''
              }`}
            >
              {/* Image Stage */}
              <div
                style={stageStyle}
                className="relative w-full h-full flex items-center justify-center transition-transform duration-150 ease-out"
              >
                <div className="relative inline-block max-w-full max-h-full">
                  <img
                    src={config.imageSrc}
                    alt={config.imageAlt}
                    decoding="async"
                    fetchPriority="high"
                    onLoad={(e) => {
                      const img = e.currentTarget;
                      if (img.naturalWidth && img.naturalHeight) {
                        setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
                      }
                    }}
                    className="w-auto h-auto max-w-full max-h-full block object-contain"
                  />

                  {/* High-Contrast Overlay Bounding Boxes */}
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

            {/* External Caption Box */}
            {config.highlightCaption && (
              <div className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                <span>{config.highlightCaption}</span>
              </div>
            )}

            {/* Tester Instruction Callout Box */}
            <div className="bg-[var(--bg)] border border-[var(--card-border)] rounded-2xl p-4 flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--primary)] flex items-center gap-1.5">
                <CheckCircle2 size={13} />
                {t('ui.tester_instructions')}
              </span>
              <p id="apparatus-help-instruction" className="text-sm text-[var(--text)] leading-relaxed font-normal">
                {config.instruction}
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-4 border-t border-[var(--card-border)] bg-[var(--bg)]/30">
            <button
              type="button"
              onClick={onClose}
              className="w-full min-h-[48px] rounded-2xl bg-[var(--primary)] text-[#091522] font-bold text-base hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_4px_16px_rgba(59,224,212,0.25)]"
            >
              {t('ui.got_it')}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
