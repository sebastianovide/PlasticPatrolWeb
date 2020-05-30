declare module "dms2dec" {
  export default function dm2dec(
    lat: string,
    latRef: string,
    lon: string,
    lonRef: string
  ): [number, number];
}
