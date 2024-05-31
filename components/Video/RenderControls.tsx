import { useRendering } from "../../helpers/use-rendering";
import { CompositionProps, COMP_NAME } from "../../types/constants";
import { DownloadButton } from "./DownloadButton/DownloadButton";
import { ErrorComp } from "./Error";
import { ProgressBar } from "./ProgressBar";

export const RenderControls: React.FC<{
  inputProps: CompositionProps;
}> = ({ inputProps }) => {
  const { renderMedia, state, undo } = useRendering(COMP_NAME, inputProps);

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
            <ErrorComp message={state.error.message} />
          )}
        </>
      )}
      {(state.status === "rendering" || state.status === "done") && (
        <>
          <ProgressBar
            progress={state.status === "rendering" ? state.progress : 1}
          />
          <DownloadButton secondary onClick={undo}>
            Regenerate
          </DownloadButton>
          <DownloadButton
            href={state.status === "done" ? state.url : undefined}
            state={state}
            disabled={state.status === "rendering"}
            loading={state.status === "rendering"}
          >
            Download Video
          </DownloadButton>
        </>
      )}
    </div>
  );
};
