// declaration.d.ts
declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.png";

declare module 'mapbox-gl/dist/mapbox-gl';

