import type { SVGProps } from "react";
import type { ChipProps } from "@heroui/chip";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

export const PlusIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    >
      <path d="M6 12h12" />
      <path d="M12 18V6" />
    </g>
  </svg>
);

export const VerticalDotsIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <path
      d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
      fill="currentColor"
    />
  </svg>
);

export const SearchIcon = (props: IconSvgProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M22 22L20 20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

export const ChevronDownIcon = ({
  strokeWidth = 1.5,
  ...otherProps
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...otherProps}
  >
    <path
      d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={strokeWidth}
    />
  </svg>
);

export const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "NOMBRE CLIENTE", uid: "nombre", sortable: true },
  { name: "FECHA NACIMIENTO", uid: "fecha_nacimiento", sortable: true },
  { name: "ASESOR", uid: "asesor" },
  { name: "CODIGO", uid: "codigo" },
  { name: "PRECIO", uid: "precio", sortable: true },
  { name: "DESCUENTO", uid: "descuento", sortable: true },
  { name: "DESCUENTO EXTRA", uid: "extra", sortable: true },
  { name: "TOTAL", uid: "total", sortable: true },
  { name: "ESTADO", uid: "status", sortable: true },
  { name: "CREADO", uid: "creado", sortable: true },
  { name: "MODIFICADO", uid: "modificado", sortable: true },
  { name: "ACCIONES", uid: "actions" },
];

export const statusOptions = [
  { name: "Ingresada", uid: "Ingresada" },
  { name: "Aprobada", uid: "Aprobada" },
  { name: "Anulada", uid: "Anulada" },
];

export const statusColorMap: Record<string, ChipProps["color"]> = {
  Aprovada: "success",
  Anulada: "danger",
  Ingresada: "warning",
};

export const INITIAL_VISIBLE_COLUMNS = [
  "nombre",
  "asesor",
  "total",
  "status",
  "actions",
];