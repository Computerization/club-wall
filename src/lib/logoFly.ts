export interface FlyRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * Single-flight source rect for the preview modal's shared-element logo
 * entrance. The clicked gallery tile records its logo's bounding box here
 * right before opening the preview; the modal reads it once and uses it as the
 * start of the logo's flight into the card.
 */
let flyRect: FlyRect | null = null;

export function setLogoFlyRect(rect: FlyRect | null): void {
  flyRect = rect;
}

export function takeLogoFlyRect(): FlyRect | null {
  const r = flyRect;
  flyRect = null;
  return r;
}
