import { useRendering } from "../../helpers/use-rendering";
import { CompositionProps, COMP_NAME } from "../../types/constants";
import { DownloadButton } from "./DownloadButton/DownloadButton";
import { StatusText } from "./StatusText";
import { ProgressBar } from "./ProgressBar";

export const RenderControls: React.FC<{
  inputProps: CompositionProps;
}> = ({ inputProps }) => {
  const { renderMedia, state } = useRendering(COMP_NAME, inputProps);

  return (
    <div>
      {(state.status === "init" ||
        state.status === "invoking" ||
        state.status === "error") && (
        <>
          <DownloadButton
            disabled={state.status === "invoking"}
            loading={state.status === "invoking"}
            onClick={renderMedia}
          >
            Download Video
          </DownloadButton>
          {state.status === "error" && (
            <StatusText status="error" errorMessage={state.error.message} />
          )}
        </>
      )}
      {(state.status === "rendering" || state.status === "done") && (
        <>
          <DownloadButton
            href={state.status === "done" ? state.url : undefined}
            state={state}
            disabled={state.status === "rendering"}
            loading={state.status === "rendering"}
          >
            Download Video
          </DownloadButton>
          <ProgressBar
            progress={state.status === "rendering" ? state.progress : 1}
          />
          {state.status === "rendering" && <StatusText status="rendering" />}
        </>
      )}
    </div>
  );
};
