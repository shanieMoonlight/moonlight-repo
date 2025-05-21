export const ComponentTemplateCode = `<img
  [src]="_placeholder()"
  [alt]="_alt()"
  sbProgImgLoader
  [fallbackUrl]="_fallbackUrl()"
  [smlToLrgFn]="_smlToLrgFn()"
  [lrgUrl]="_lrgUrl()"
  [retryTimeoutMs]="_retryTimeoutMs()"
  [retryCount]="_retryCount()"
  (error)="_imgError.emit()"
  [style.objectFit]="_objectFit()"
  [style.objectPosition]="_objectPosition()"
  [style.height]="_imgHeight()"
  [style.width]="_imgWidth()"
  [style.view-transition-name]="_transitionId()">`
