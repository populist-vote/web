export interface IMessage<T> {
  populist: T;
}

export interface IResizeHeightMessage {
  resizeHeight: number;
  embedId: string;
}

export function emitData<T>(data: T, origin: string) {
  window.parent.postMessage({ populist: data } as IMessage<T>, origin);
}

export function sendData<T>(data: T, origin: string) {
  const iframe = document.querySelector<HTMLIFrameElement>(
    "iframe.populist-frame"
  );
  if (!iframe) return;
  iframe.contentWindow?.postMessage({ populist: data } as IMessage<T>, origin);
}

export function getOriginHost(origin: string) {
  try {
    const url = new URL(origin);
    url.searchParams.delete("populist");
    return { origin: url.toString(), originHost: url.origin };
  } catch (err) {
    return { origin: "", originHost: "" };
  }
}
