/// <reference path="./types/utils-js.d.ts" />

declare module "docx-preview" {
  interface RenderOptions {
    className?: string;
    inWrapper?: boolean;
    ignoreWidth?: boolean;
    ignoreHeight?: boolean;
    breakPages?: boolean;
    [key: string]: unknown;
  }
  function renderAsync(
    document: Blob | ArrayBuffer | Uint8Array,
    bodyContainer: HTMLElement,
    styleContainer?: HTMLElement | null,
    options?: RenderOptions
  ): Promise<unknown>;
}
