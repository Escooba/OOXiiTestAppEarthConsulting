export type Size = {
  width: number;
  height: number;
};

export type ImageFocusRegion = {
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
};

export type ImageTransform = {
  scale: number;
  translateX: number;
  translateY: number;
};

/**
 * Calculates deterministic crop transform to centre and fit a requested focus region
 * inside a crop viewport without blurring or over-zooming.
 */
export function calculateFocusTransform(
  imageSize: Size,
  viewportSize: Size,
  focusRegion: ImageFocusRegion,
  maxScale = 2.0
): ImageTransform {
  if (!imageSize.width || !imageSize.height || !viewportSize.width || !viewportSize.height) {
    return { scale: 1, translateX: 0, translateY: 0 };
  }

  // Convert focus region percentages to image pixels
  const focusPixelWidth = Math.max(1, (focusRegion.widthPercent / 100) * imageSize.width);
  const focusPixelHeight = Math.max(1, (focusRegion.heightPercent / 100) * imageSize.height);

  // Calculate scale required to fit focus region into viewport
  const scaleX = viewportSize.width / focusPixelWidth;
  const scaleY = viewportSize.height / focusPixelHeight;

  // Capped scale to avoid blurring small 447x447 raster PNG
  const baseScale = Math.min(scaleX, scaleY);
  const scale = Math.max(1.0, Math.min(maxScale, baseScale));

  // Focus region centre in image pixel coordinates
  const focusCenterX = ((focusRegion.xPercent + focusRegion.widthPercent / 2) / 100) * imageSize.width;
  const focusCenterY = ((focusRegion.yPercent + focusRegion.heightPercent / 2) / 100) * imageSize.height;

  // Image centre in image pixel coordinates
  const imageCenterX = imageSize.width / 2;
  const imageCenterY = imageSize.height / 2;

  // Translation needed to shift focus centre to viewport centre
  const translateX = (imageCenterX - focusCenterX) * scale;
  const translateY = (imageCenterY - focusCenterY) * scale;

  return { scale, translateX, translateY };
}

/**
 * Clamps pan offsets to prevent image from being dragged out of view.
 */
export function clampPanOffset(
  offset: { x: number; y: number },
  scaledImageSize: Size,
  viewportSize: Size
): { x: number; y: number } {
  const maxPanX = Math.max(0, (scaledImageSize.width - viewportSize.width) / 2);
  const maxPanY = Math.max(0, (scaledImageSize.height - viewportSize.height) / 2);

  return {
    x: Math.max(-maxPanX, Math.min(maxPanX, offset.x)),
    y: Math.max(-maxPanY, Math.min(maxPanY, offset.y)),
  };
}
